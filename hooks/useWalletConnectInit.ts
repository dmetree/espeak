import { useEffect } from 'react';
import { init, WalletConnectConnector, cardanoMainnetWalletConnect } from '@dcspark/adalib';

export function useWalletConnectInit() {
  useEffect(() => {
    init(
      () => ({
        connectorName: WalletConnectConnector.connectorName(),
        connectors: [
          new WalletConnectConnector({
            relayerRegion: 'wss://relay.walletconnect.com',
            metadata: {
              description: 'MindHealer | Ergo | Cardano',
              name: 'MindHealer',
              icons: [''],
              url: process.env.NEXT_PUBLIC_APP_URL,
            },
            autoconnect: true,
            qrcode: true,
          }),
        ],
        chosenChain: cardanoMainnetWalletConnect(),
      }),
      '83e9907be3beb58b0c8e5468bb522e58'
    );
  }, []);
}
