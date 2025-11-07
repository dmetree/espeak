interface Window {
  dappWallet?: any; // or a more specific type if you know the structure of dappWallet
  initCardanoDAppConnectorBridge?: (callback: (walletApi: any) => void) => void;
}
