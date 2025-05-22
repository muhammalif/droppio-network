// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Interface untuk token ERC20 $IDRX
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Droppio {
    address public owner;                          // Pemilik kontrak
    IERC20 public idrxToken;                       // Instance token ERC20 $IDRX

    uint256 public creatorRegistrationFee = 250_000 * 10**6; // Biaya registrasi kreator (250.000 $IDRX)
    uint256 public totalRegistrationFees;          // Total akumulasi fee registrasi (dapat ditarik owner)

    mapping(address => bool) public isCreator;     // Menandai apakah suatu alamat telah menjadi kreator
    mapping(address => uint256) public balances;   // Saldo tip untuk masing-masing kreator
    mapping(address => uint256) public totalTipped;// Total tip yang pernah dikirim oleh user

    // Event log
    event CreatorRegistered(address indexed creator);
    event CreatorRegistrationFeeChanged(uint256 newFee);
    event Tipped(address indexed from, address indexed to, uint256 amount, string message);
    event Withdrawn(address indexed creator, uint256 amount);
    event FeeWithdrawn(address indexed to, uint256 amount);

    // Konstruktor, dijalankan sekali saat deploy kontrak
    constructor(address _idrxAddress) {
        owner = msg.sender;
        idrxToken = IERC20(_idrxAddress);
    }

    // Modifier agar fungsi hanya bisa dipanggil owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// Fungsi untuk registrasi kreator baru
    /// User membayar fee, statusnya jadi kreator
    function registerAsCreator() external {
        require(!isCreator[msg.sender], "Already a creator");

        // Transfer fee dari user ke kontrak
        bool success = idrxToken.transferFrom(msg.sender, address(this), creatorRegistrationFee);
        require(success, "Transfer failed");

        // Tambahkan fee ke total yang bisa ditarik oleh owner
        totalRegistrationFees += creatorRegistrationFee;

        // Tandai sebagai kreator
        isCreator[msg.sender] = true;

        emit CreatorRegistered(msg.sender);
    }

    /// Fungsi untuk owner mengubah biaya registrasi kreator
    function setCreatorRegistrationFee(uint256 newFee) external onlyOwner {
        creatorRegistrationFee = newFee;
        emit CreatorRegistrationFeeChanged(newFee);
    }

    /// Fungsi untuk memberikan tip kepada kreator
    /// User harus memberikan sejumlah IDRX dan disimpan di saldo kreator
    function tip(address to, uint256 amount, string calldata message) external {
        require(isCreator[to], "Recipient not a creator");
        require(amount > 0, "Amount must be > 0");

        // Transfer tip ke kontrak
        bool success = idrxToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        // Tambahkan saldo kreator dan catat total tip oleh pengirim
        balances[to] += amount;
        totalTipped[msg.sender] += amount;

        emit Tipped(msg.sender, to, amount, message);
    }

    /// Fungsi bagi kreator untuk menarik semua saldo tip-nya
    function withdraw() external {
        require(isCreator[msg.sender], "Not a creator");

        uint256 amt = balances[msg.sender];
        require(amt > 0, "No balance");

        // Reset saldo agar tidak bisa ditarik ulang
        balances[msg.sender] = 0;

        // Transfer tip ke kreator
        bool success = idrxToken.transfer(msg.sender, amt);
        require(success, "Withdraw failed");

        emit Withdrawn(msg.sender, amt);
    }

    /// Melihat saldo tip yang bisa ditarik oleh kreator tertentu
    function getBalance(address creator) external view returns (uint256) {
        return balances[creator];
    }

    /// Menentukan level eligibility user berdasarkan total tip yang pernah mereka kirim
    function getEligibilityLevel(address user) public view returns (string memory) {
        uint256 total = totalTipped[user];
        if (total >= 1_000_000 * 10**6) return "gold";
        if (total >=   500_000 * 10**6) return "silver";
        if (total >=   100_000 * 10**6) return "bronze";
        return "none";
    }

    /// Fungsi untuk owner menarik akumulasi fee registrasi
    /// Tidak termasuk tip milik kreator
    function withdrawFees(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(totalRegistrationFees > 0, "No fees to withdraw");

        uint256 amt = totalRegistrationFees;
        totalRegistrationFees = 0;

        // Transfer fee ke alamat tujuan
        bool success = idrxToken.transfer(to, amt);
        require(success, "Withdraw failed");

        emit FeeWithdrawn(to, amt);
    }

    /// Melihat total saldo token IDRX yang disimpan di kontrak
    function idrxTokenBalance() public view returns (uint256) {
        return idrxToken.balanceOf(address(this));
    }
}
