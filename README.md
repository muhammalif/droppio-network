# Droppio Network

This repository contains the code for the Droppio Network, a Web3 platform designed to support content creators.

**Portfolio Note:** This version of the project is a work in progress for portfolio purposes and uses dummy (mock) data and simulated functionalities in the frontend application. The smart contracts are developed but not fully integrated with the frontend in this dummy version.

## Repository Structure

- `droppio-app/`: Contains the Next.js frontend application.
- `smart-contract/`: Contains the Solidity smart contracts and Hardhat project for development, testing, and deployment.

## Droppio Application (Frontend)

This is the user-facing application built with Next.js. It provides the interface for users to interact with the Droppio Network. In this portfolio version, it primarily demonstrates the UI and user flow using dummy data.

### Features (Dummy Version)

- Homepage
- Creators List (displays dummy creator data)
- Dashboard Page:
  - User information summary (displays dummy user data)
  - Badge display (displays dummy badge data)
  - Quick links to other pages
  - Wallet address displayed using a dummy value if the hook hasn't loaded yet.
  - No actual wallet disconnect functionality.
- Settings Page (uses dummy data for profile and social media):
  - Edit profile (simulates saving changes)
  - Account information (displays dummy data)
  - Manage social media accounts (simulates verification)
- Support Creator Functionality (simulates the tipping process with dummy data and UI feedback)
- About Page (basic project information)

### Technologies Used (Frontend)

- Next.js (with App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI (for UI components)
- Headless UI (used for the dummy wallet connection hook)

### Backend (Planned/Partial):

- Node.js
- Express.js
- Prisma (used partially for dummy API structure, but not connected to a real DB in this version)
- (Note: Full blockchain interaction libraries like Ethers.js or Web3.js and complete backend logic for transactions/data persistence are not implemented in this dummy version)

## Droppio Network Smart Contracts

This directory contains the smart contracts for the Droppio Network, built using Hardhat.

### Contracts

- `Droppio.sol`: Handles core platform functionalities including creator registration, tipping, and tip withdrawals.
- `DroppioSBT.sol`: Manages the minting and ownership of Soulbound Tokens (SBTs) which represent supporter badges.

### Technologies Used (Smart Contracts)

- Solidity (for smart contract development)
- Hardhat (for development, testing, and deployment)
- Ethers.js (for interacting with the blockchain)
- OpenZeppelin Contracts (for secure and standard contract implementations, if applicable)

## How to Run Locally

To run both the frontend and smart contract development environment, follow these steps:

1.  Clone this repository:
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd droppio-network
    ```

2.  **Run Smart Contract Development Environment (Optional but Recommended):**
    Navigate to the `smart-contract` directory and start a Hardhat network:
    ```bash
    cd smart-contract
    npm install # or yarn install or pnpm install
    npx hardhat node
    ```
    Keep this terminal window open.

3.  **Run Frontend Application:**
    Open a new terminal window, navigate to the `droppio-app` directory:
    ```bash
    cd ../droppio-app
    pnpm install # or yarn install or pnpm install
    pnpm dev # or yarn dev or pnpm dev
    ```

4.  Open your browser and visit `http://localhost:3000`.

## Project Status

This project is under development for portfolio purposes. The frontend uses dummy data and simulated interactions, while the smart contracts are functional but not fully integrated into the frontend logic in this version.

## Contact

If you have any questions or would like to discuss this project further, please contact me at malif.1006@gmail.com. 
