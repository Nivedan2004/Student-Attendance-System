import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Assessment from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "183764526C34c86218AE53BD34234b1C5aeB160e";
  const atmABI = Assessment.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };

  const handleAccount = async () => {
    if (ethWallet) {
      const accounts = await ethWallet.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await handleAccount();
    getATMContract();
  };

  const getATMContract = () => {
    if (ethWallet) {
      const signer = ethWallet.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
      setATM(atmContract);
    }
  }

  const getString = async () => {
    if (atm) {
      const balance = await atm.getString();
      setBalance(balance);
    }
  }

  const addItem = async () => {
    const _item = prompt("Enter the student name");
    const _id = prompt("Enter the student ID");
    if (atm) {
      const tx = await atm.addItem(_item, _id);
      await tx.wait();
      getString();
    }
  }

  const removeItem = async () => {
    const _id = prompt("Enter the student ID you want to remove");
    if (atm) {
      const tx = await atm.removeItem(_id);
      await tx.wait();
      getString();
    }
  }

  const returnItem = async () => {
    if (atm) {
      const items = await atm.getItemNames();
      setBalance(items.join(", "));
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use.</p>
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getString();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Message: {balance}</p>
        <button onClick={addItem}>Add Student</button>
        <button onClick={removeItem}>Remove Student</button>
        <button onClick={returnItem}>Display Students</button>
      </div>
    )
  }

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>STUDENT FEES MANAGEMENT</h1>
      <p>Info About the Students Who Have Not Paid Fees</p></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color:Lightblue;
          background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,2,8));
          height: 100vh;
          padding:2px;
          font-family: 'Arial', sans-serif;
        }
        .connect-btn, .action-btn {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .connect-btn:hover, .action-btn:hover {
          background-color: #0056b3;
      `}
      </style>
    </main>
  )
}
