import { OutputInfo, TransactionInfo } from "@/blockchain/ergo/explorerApi";

export async function getTotalBalance(
  explorerClient: any,
  address: string
): Promise<any[]> {
  if (
    !explorerClient ||
    typeof explorerClient.getApiV1AddressesP1BalanceConfirmed !== "function"
  ) {
    console.error(
      "Explorer client is not initialized or missing the required method."
    );
    return [];
  }

  const convertedResponse: any[] = [];
  try {
    const balance = (
      await explorerClient.getApiV1AddressesP1BalanceConfirmed(address)
    ).data;

    if (!balance) {
      console.warn(`No balance data available for address: ${address}`);
      return [];
    }

    const ergBalance = {
      tokenId: "ERG",
      balance: balance.nanoErgs?.toString() ?? "0",
    };

    convertedResponse.push(ergBalance);

    if (balance.tokens?.length > 0) {
      for (const token of balance.tokens) {
        try {
          const tokenIssuanceBox = await getTokenIssuanceBox(
            explorerClient,
            token.tokenId
          );
          if (isTokenAsset(tokenIssuanceBox)) {
            const tokenBalance = {
              tokenId: token.tokenId,
              balance: token.amount.toString(),
            };
            convertedResponse.push(tokenBalance);
          }
        } catch (error) {
          console.error(`Error processing token ${token.tokenId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(
      `Error fetching total balance for address ${address}:`,
      error
    );
  }

  return convertedResponse;
}

async function getTokenIssuanceBox(
  explorerClient: any,
  tokenId: string
): Promise<OutputInfo> {
  if (
    !explorerClient ||
    !explorerClient.getApiV1BoxesP1 ||
    !explorerClient.getApiV1TransactionsP1
  ) {
    console.error(
      "Explorer client is not initialized or missing required methods."
    );
    return {} as OutputInfo;
  }
  try {
    const tokenIssuerBox: OutputInfo = (
      await explorerClient.getApiV1BoxesP1(tokenId)
    ).data;
    if (!tokenIssuerBox || !tokenIssuerBox.spentTransactionId) {
      throw new Error(
        `Token issuer box or spent transaction ID not found for token: ${tokenId}`
      );
    }

    const spentTransactionId: string = tokenIssuerBox.spentTransactionId!;
    const mintTx: TransactionInfo = (
      await explorerClient.getApiV1TransactionsP1(spentTransactionId)
    ).data;

    return (
      mintTx.outputs!.find((o) =>
        o.assets?.find((a) => a.tokenId === tokenId)
      ) ?? ({} as OutputInfo)
    );
  } catch (error) {
    console.error(
      `Error fetching token issuance box for token ID ${tokenId}:`,
      error
    );
    return {} as OutputInfo;
  }
}

function isTokenAsset(issuanceBox: OutputInfo): boolean {
  return issuanceBox.additionalRegisters.R7 === undefined;
}
