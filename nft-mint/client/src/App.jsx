import React, {useEffect, useState} from 'react';
import {ethers} from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import ABI from "./utils/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT = "0xB01827FD3b1c398Bf1E34b56b20bD10dC3fbBE47";

const App = () => {
  //states
  const [currentUser, setCurrentUser] = useState(null);
  
  //check the existance of wallet
  
  const checkIfWalletsConnected = async() => {
    const {ethereum} = window;
    if(!ethereum){
      console.log("please install/connect to metamask!");
      return;
    }
    console.log("metamask connected!");
    const accounts = await ethereum.request({method: "eth_accounts"});

    console.log("accounts:\n", accounts);
    if(accounts.length !== 0){
      setCurrentUser(accounts[0]);
      console.log("wallet connected!");
      console.log("wallet:\t", accounts[0]);
    }
  };
  
  //wallet connection

  const connectWallet = async () => {
    try{
      const {ethereum} = window;
      if(!ethereum){
        console.log("wallet doesn't exist!");
        return;
      }
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      const chainId = await ethereum.request({method: "eth_chainId"});
      console.log("chainId:",chainId);
      if(chainId !== "0x4"){
        console.log("please use rainkeby network!");
        return;
      }
      setCurrentUser(accounts[0]);
      console.log("account connected!\n", accounts[0]);
    }catch(err){
      console.log(err);
    }
  };

  //mint NFT

  const mintNFT = async() => {
    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT, ABI.abi, signer);
        let txn = await connectedContract.makeEpicNFT();
        console.log("minting...");
        await txn.wait();
        console.log("Mined, see transaction: https://rinkeby.etherscan.io/tx/"+txn.hash);
      }else{
        console.log("wallet doesn't exist!");
      }
    }catch(err){
      console.log(err);
    }
  };

  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );
  //mint button
  const mint = () => (<button onClick={mintNFT} className="cta-button connect-wallet-button">
        Mint NFT
      </button>);
  useEffect(()=>{
    checkIfWalletsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentUser ? mint() : renderNotConnectedContainer()}
        </div>
        {/*<div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>*/}
      </div>
    </div>
  );
};

export default App;