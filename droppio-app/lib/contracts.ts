import { ethers } from 'ethers';
import DroppioABI from '../contracts/Droppio.json';

export const DROPPIO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DROPPIO_CONTRACT_ADDRESS;
export const IDRX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS;

export const getContract = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask to use this feature');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new ethers.Contract(
    DROPPIO_CONTRACT_ADDRESS!,
    DroppioABI.abi,
    signer
  );
};

export const registerAsCreator = async () => {
  const contract = await getContract();
  const tx = await contract.registerAsCreator();
  return await tx.wait();
};

export const tipCreator = async (creatorAddress: string, amount: string, message: string) => {
  const contract = await getContract();
  const tx = await contract.tip(creatorAddress, ethers.parseEther(amount), message);
  return await tx.wait();
};

export const withdrawTips = async () => {
  const contract = await getContract();
  const tx = await contract.withdraw();
  return await tx.wait();
};

export const getCreatorBalance = async (creatorAddress: string) => {
  const contract = await getContract();
  const balance = await contract.getBalance(creatorAddress);
  return ethers.formatEther(balance);
};

export const getEligibilityLevel = async (userAddress: string) => {
  const contract = await getContract();
  return await contract.getEligibilityLevel(userAddress);
}; 