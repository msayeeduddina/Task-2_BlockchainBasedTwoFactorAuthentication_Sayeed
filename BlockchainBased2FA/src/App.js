import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { WagmiProvider } from "wagmi";
import {
  mainnet, polygon, fantom, avalanche, arbitrum, optimism,
  cronos, base, linea, mantle, blast, degen,
  pulsechain, coreDao, evmos, goerli, polygonMumbai,
  fantomTestnet, avalancheFuji, baseSepolia
} from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import Dashboard from "./Component/Dashboard";

// Setup queryClient
const queryClient = new QueryClient();

// Project ID from WalletConnect
const projectId = "58a22d2bc1c793fc31c117ad9ceba8d9";

// Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [
  mainnet, polygon, fantom, avalanche, arbitrum, optimism,
  cronos, base, linea, mantle, blast, degen,
  pulsechain, coreDao, evmos, goerli, polygonMumbai,
  fantomTestnet, avalancheFuji, baseSepolia
];

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
});

export default function App() {
  return (
    <div>
      <WagmiProvider config={config}>
        <w3m-button balance="show" />
      </WagmiProvider>
      <Dashboard />
    </div>
  );
}