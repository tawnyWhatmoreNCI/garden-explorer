import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  hardhat, sepolia
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import BadgesShowcase from '../components/BadgeShowcase';

const wagmiConfig = getDefaultConfig({
  appName: 'Garden Explorer',
  projectId: 'org.gardenEeplorer',
  chains: [
    hardhat, sepolia],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider theme={darkTheme({
      accentColor: '#6CE588',
      accentColorForeground: '#043222',
      borderRadius: 'large',
      fontStack: 'system',
      overlayBlur: 'small',
    })}>
          <main className={styles.main}>
            <Navbar />
            <BadgesShowcase/>
            <Component {...pageProps} />
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
