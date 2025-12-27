import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from '@wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is missing. Add it to your .env file');
}

export function getConfig() {
  return createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    connectors: [
      coinbaseWallet({
        appName: 'Spectra Form',
        preference: { options: 'smartWalletOnly' },
      }),
      walletConnect({
        projectId,
        showQrModal: true,
      }),
    ],
  });
}