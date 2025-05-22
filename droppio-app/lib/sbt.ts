import { ethers } from 'ethers';
import DroppioSBTABI from '../contracts/DroppioSBT.json';

export const DROPPIO_SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DROPPIO_SBT_CONTRACT_ADDRESS;

export const getSBTContract = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask to use this feature');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    DROPPIO_SBT_CONTRACT_ADDRESS!,
    DroppioSBTABI.abi,
    signer
  );
};

export const mintBadge = async (level: 'bronze' | 'silver' | 'gold') => {
  const contract = await getSBTContract();
  const tx = await contract.mintBadge(level);
  return await tx.wait();
};

export const hasMinted = async (address: string, level: 'bronze' | 'silver' | 'gold') => {
  const contract = await getSBTContract();
  return await contract.hasMinted(address, level);
}; 