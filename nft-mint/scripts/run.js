
const main = async()=>{
    const NFTContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const NFTContract = await NFTContractFactory.deploy();
    await NFTContract.deployed();
    console.log(`Contract deployed! ${NFTContract.address}`);

    let txn = await NFTContract.makeEpicNFT();
    await txn.wait();
}

const runMain = async() => {
    try{
        await main();
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

runMain();