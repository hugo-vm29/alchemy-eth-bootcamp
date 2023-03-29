const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    
    const faucet = await Faucet.deploy({
        value: ethers.utils.parseUnits("10", "ether"),
    });

    const [owner, addr1] = await ethers.getSigners();

    //onsole.log('Signer 1 address: ', owner.address);
    return { faucet, owner, addr1 };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above 1 ETH at a time', async function () {
    let withdrawAmount = ethers.utils.parseUnits("2", "ether");
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should complete a successful withdraw', async function () {
    
    let withdrawAmount = ethers.utils.parseUnits("1", "ether");
    const { faucet , addr1 } = await loadFixture(deployContractAndSetVariables);
    
    const beforeBalance = await ethers.provider.getBalance(addr1.address);
    
    await faucet.connect(addr1).withdraw(withdrawAmount);
    
    const afterBalance = await ethers.provider.getBalance(addr1.address);
    expect(afterBalance).to.be.greaterThan(beforeBalance);

  });

  it('should be called by owner only', async function () {
    
    let withdrawAmount = ethers.utils.parseUnits("1", "ether");
    const { faucet , addr1 } = await loadFixture(deployContractAndSetVariables); 
    await expect( faucet.connect(addr1).withdrawAll() ).to.be.revertedWith("Only owner allowed.");
  });

});