const { expect } = require("chai");
const hre = require("hardhat"); // gunakan hardhat runtime environment
const { ethers } = hre;

describe("Droppio Contract", function () {
  let Droppio, droppio, IDRX, idrx, owner, user1, user2;
  let initialSupply, creatorFee;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    initialSupply = ethers.parseUnits("1000000", 6);
    creatorFee = ethers.parseUnits("250000", 6);

    const IDRXMock = await ethers.getContractFactory("contracts/test/MockIDRX.sol:MockIDRX");
    idrx = await IDRXMock.deploy(initialSupply);
    await idrx.waitForDeployment();

    Droppio = await ethers.getContractFactory("Droppio");
    droppio = await Droppio.deploy(await idrx.getAddress());
    await droppio.waitForDeployment();

    // Transfer half of the supply to each user
    const halfSupply = initialSupply / 2n;
    await idrx.transfer(user1.address, halfSupply);
    await idrx.transfer(user2.address, halfSupply);
  });
  
  it("should register user as creator", async () => {
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await expect(droppio.connect(user1).registerAsCreator())
      .to.emit(droppio, "CreatorRegistered")
      .withArgs(user1.address);

    expect(await droppio.isCreator(user1.address)).to.equal(true);
  });

  it("should fail if already registered as creator", async () => {
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await droppio.connect(user1).registerAsCreator();

    await expect(droppio.connect(user1).registerAsCreator()).to.be.revertedWith("Already a creator");
  });

  it("should change registration fee by owner", async () => {
    await expect(droppio.setCreatorRegistrationFee(100))
      .to.emit(droppio, "CreatorRegistrationFeeChanged")
      .withArgs(100);
  });

  it("should allow tipping to a registered creator", async () => {
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await droppio.connect(user1).registerAsCreator();

    const tipAmount = ethers.parseUnits("1000", 6);
    await idrx.connect(user2).approve(await droppio.getAddress(), tipAmount);
    await expect(droppio.connect(user2).tip(user1.address, tipAmount, "Good job"))
      .to.emit(droppio, "Tipped");

    expect(await droppio.balances(user1.address)).to.equal(tipAmount);
  });

  it("should allow creator to withdraw tips", async () => {
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await droppio.connect(user1).registerAsCreator();

    const tipAmount = ethers.parseUnits("1000", 6);
    await idrx.connect(user2).approve(await droppio.getAddress(), tipAmount);
    await droppio.connect(user2).tip(user1.address, tipAmount, "Thanks");

    await expect(droppio.connect(user1).withdraw())
      .to.emit(droppio, "Withdrawn")
      .withArgs(user1.address, tipAmount);
  });

  it("should allow owner to withdraw registration fees", async () => {
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await droppio.connect(user1).registerAsCreator();

    await expect(droppio.withdrawFees(owner.address))
      .to.emit(droppio, "FeeWithdrawn");
  });

  it("should return eligibility levels correctly", async () => {
    const amount = ethers.parseUnits("500000", 6);
    await idrx.connect(user1).approve(await droppio.getAddress(), creatorFee);
    await droppio.connect(user1).registerAsCreator();

    await idrx.connect(user2).approve(await droppio.getAddress(), amount);
    await droppio.connect(user2).tip(user1.address, amount, "Silver tipper");

    expect(await droppio.getEligibilityLevel(user2.address)).to.equal("silver");
  });
});
