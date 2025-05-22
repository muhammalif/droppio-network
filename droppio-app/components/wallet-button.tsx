"use client"

import { ConnectButton } from "@xellar/kit";

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        isConnected,
        account,
        chain,
        openConnectModal,
        openProfileModal,
      }) => {
        // Not connected
        if (!account) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
            >
              Connect Wallet
            </button>
          );
        }

        // Connected (compact, no logout, no balance)
        return (
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 border border-gray-200 focus:outline-none"
            title="Wallet Info"
          >
            <span className="font-mono text-xs">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
            {chain?.name && (
              <span className="text-xs text-gray-400 ml-1">
                {chain.name}
              </span>
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}