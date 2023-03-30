const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat')

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();


    // Search a valid address
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let wallet;

    do{

      const randomWallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await randomWallet.getAddress()

      if (address < threshold) {
        wallet = randomWallet;
      }

      // Load some eth on wallet for pay gas
      const signer = ethers.provider.getSigner(0);
      
      await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther('1') // 1 ether
      })

    }while(!wallet);
    
    return { game , wallet };
  }

  it('should be a winner', async function () {
    
    const { game , wallet} = await loadFixture(deployContractAndSetVariables);

    //console.log("wallet", wallet.address);
    await game.connect(wallet).win();
    await game.win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
