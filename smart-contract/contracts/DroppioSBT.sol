// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Interface untuk kontrak eksternal Droppio (cek kelayakan user)
interface IDroppio {
    function getEligibilityLevel(address user) external view returns (string memory);
}

contract DroppioSBT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter; // Counter ID token
    IDroppio public droppioContract; // Referensi ke kontrak Droppio

    string public baseURI; // IPFS base URI untuk metadata badge

    // Mapping untuk mengecek apakah user sudah pernah mint badge tertentu
    mapping(address => mapping(string => bool)) public hasMinted;

    // Konstruktor: set kontrak droppio dan base URI IPFS
    constructor(address _droppioAddress, string memory _baseURI) ERC721("DroppioSoulboundBadge", "DSBB") {
        tokenCounter = 1;
        droppioContract = IDroppio(_droppioAddress);
        baseURI = _baseURI;
    }

    /**
     * Fungsi untuk mint badge.
     * Hanya bisa mint satu kali per level dan harus memenuhi syarat kelayakan.
     */
    function mintBadge(string calldata badgeLevel) external {
        require(_isValidLevel(badgeLevel), "Invalid badge level");
        require(!hasMinted[msg.sender][badgeLevel], "Already claimed");

        // Ambil level kelayakan dari kontrak eksternal
        string memory eligibleLevel = droppioContract.getEligibilityLevel(msg.sender);
        require(_isEligible(badgeLevel, eligibleLevel), "Not eligible");

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);

        // Buat tokenURI berdasarkan level dan baseURI IPFS
        string memory tokenUri = string(abi.encodePacked(baseURI, _getFileName(badgeLevel)));
        _setTokenURI(newTokenId, tokenUri);

        hasMinted[msg.sender][badgeLevel] = true;
        tokenCounter++;
    }

    // Fungsi owner-only untuk mengubah base URI IPFS
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    // Cek apakah level badge valid (bronze/silver/gold)
    function _isValidLevel(string memory level) internal pure returns (bool) {
        bytes32 l = keccak256(abi.encodePacked(level));
        return (
            l == keccak256("bronze") ||
            l == keccak256("silver") ||
            l == keccak256("gold")
        );
    }

    // Cek apakah user eligible mint badge level tertentu
    function _isEligible(string memory requested, string memory actual) internal pure returns (bool) {
        bytes32 req = keccak256(abi.encodePacked(requested));
        bytes32 act = keccak256(abi.encodePacked(actual));

        if (req == keccak256("bronze")) {
            return (act == keccak256("bronze") || act == keccak256("silver") || act == keccak256("gold"));
        } else if (req == keccak256("silver")) {
            return (act == keccak256("silver") || act == keccak256("gold"));
        } else if (req == keccak256("gold")) {
            return (act == keccak256("gold"));
        } else {
            return false;
        }
    }

    // Mengembalikan nama file JSON metadata berdasarkan level badge
    function _getFileName(string memory level) internal pure returns (string memory) {
        if (keccak256(abi.encodePacked(level)) == keccak256("bronze")) {
            return "droppio-bronzeSBT.json";
        } else if (keccak256(abi.encodePacked(level)) == keccak256("silver")) {
            return "droppio-silverSBT.json";
        } else if (keccak256(abi.encodePacked(level)) == keccak256("gold")) {
            return "droppio-goldSBT.json";
        } else {
            revert("Invalid level");
        }
    }

    // Override: Mencegah token ditransfer (non-transferable SBT)
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721)
    {
        require(from == address(0) || to == address(0), "SBTs are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // Override: Disable approval untuk SBT
    function approve(address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved");
    }

    // Override: Disable approval for all
    function setApprovalForAll(address operator, bool approved) public override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved");
    }

    // Override: Disable transferFrom
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be transferred");
    }

    // Override: Disable safeTransferFrom
    function safeTransferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be transferred");
    }

    // Override: Disable safeTransferFrom with data
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data)
        public
        override(ERC721, IERC721)
    {
        revert("Soulbound tokens cannot be transferred");
    }
}
