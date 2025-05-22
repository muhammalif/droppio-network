const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("DroppioSBT Contract", function () {
  let Droppio, droppio, SBT, sbt, IDRX, idrx;
  let owner, user1, user2;
  let fee;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const totalSupply = ethers.parseUnits("1000000", 6);
    fee = ethers.parseUnits("250000", 6);

    const IDRXMock = await ethers.getContractFactory("contracts/test/MockIDRX.sol:MockIDRX");
    idrx = await IDRXMock.deploy(totalSupply);
    await idrx.waitForDeployment();

    Droppio = await ethers.getContractFactory("Droppio");
    droppio = await Droppio.deploy(idrx.target);
    await droppio.waitForDeployment();

    const DroppioSBT = await ethers.getContractFactory("DroppioSBT");
    sbt = await DroppioSBT.deploy(droppio.target, "ipfs://QmCID/");
    await sbt.waitForDeployment();

    // Transfer tokens to users
    const user1Amount = ethers.parseUnits("400000", 6);
    const user2Amount = ethers.parseUnits("400000", 6);
    
    await idrx.transfer(user1.address, user1Amount);
    await idrx.connect(user1).approve(droppio.target, user1Amount);
    await droppio.connect(user1).registerAsCreator();

    await idrx.transfer(user2.address, user2Amount);
    await idrx.connect(user2).approve(droppio.target, user2Amount);
    await droppio.connect(user2).tip(user1.address, user2Amount, "Gold tip");
  });

  it("should allow eligible user to mint bronze badge", async () => {
    await sbt.connect(user2).mintBadge("bronze");
    expect(await sbt.ownerOf(1)).to.equal(user2.address);
  });

  it("should allow minting only once per level", async () => {
    await sbt.connect(user2).mintBadge("bronze");
    await expect(sbt.connect(user2).mintBadge("bronze")).to.be.revertedWith("Already claimed");
  });

  it("should block mint if not eligible", async () => {
    await expect(sbt.connect(user1).mintBadge("gold")).to.be.revertedWith("Not eligible");
  });

  it("should not allow SBT to be transferred", async () => {
    await sbt.connect(user2).mintBadge("bronze");

    await expect(
      sbt.connect(user2).transferFrom(user2.address, user1.address, 1)
    ).to.be.revertedWith("Soulbound tokens cannot be transferred");
  });

  it("should allow owner to change base URI", async () => {
    await sbt.setBaseURI("ipfs://NewCID/");
    expect(await sbt.baseURI()).to.equal("ipfs://NewCID/");
  });
});
