type TxListenerParams = {
  pollingInterval?: number;
  maxAttempts?: number;
  txId: string | any;
  onConfirmed?: (txData: any) => void;
  onError?: (error: any) => void;
};

export class TxConfirmationListener {
  private intervalId: NodeJS.Timeout | null = null;
  private attempts = 0;

  constructor(private params: TxListenerParams) {}

  public start() {
    const {
      pollingInterval = 30000,
      maxAttempts = 50,
      txId,
      onConfirmed,
      onError,
    } = this.params;

    const poll = async () => {
      try {
        const response = await fetch(
          `https://api.ergoplatform.com/api/v1/transactions/${txId}`
        );

        console.log('response', response)

        if (response.status === 404) {
          this.attempts++;
          if (this.attempts >= maxAttempts) {
            this.stop();
            console.warn(`❌ Transaction ${txId} not found after ${maxAttempts} attempts.`);
            onError?.(new Error("Transaction not found in time."));
          } else {
            console.log(`⏳ Attempt ${this.attempts}/${maxAttempts}: Transaction ${txId} not yet found (404).`);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data)

        if (typeof data.numConfirmations === "number" && data.numConfirmations > 0) {
          console.log(`✅ Transaction ${txId} confirmed with ${data.numConfirmations} confirmations.`);
          this.stop();
          onConfirmed(data);
        } else {
          this.attempts++;
          if (this.attempts >= maxAttempts) {
            this.stop();
            console.warn(`❌ Transaction ${txId} not confirmed after ${maxAttempts} attempts.`);
            onError?.(new Error("Transaction confirmation timeout."));
          } else {
            console.log(`⏳ Attempt ${this.attempts}/${maxAttempts}: Still waiting for confirmation...`);
          }
        }
      } catch (err) {
        this.attempts++;
        if (this.attempts >= maxAttempts) {
          this.stop();
          console.error(`❌ Transaction polling failed after ${maxAttempts} attempts.`);
          onError?.(err);
        } else {
          console.warn(`⚠️ Attempt ${this.attempts}/${maxAttempts}: Polling error, will retry.`);
        }
      }
    };

    // Delay the initial poll slightly to allow backend to index
    setTimeout(() => {
      poll();
      this.intervalId = setInterval(poll, pollingInterval);
    }, 3000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
