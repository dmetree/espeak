import { Box } from '@fleet-sdk/core';
import { ErgoToken } from '../models/transaction.types';

export async function getInputBoxes(
    ergo: any,
    inputAddress: string,
    targetNanoErgs: bigint,
    tokens?: ErgoToken[],
  ): Promise<Box[]> {
    const limit = 100;
    const inputs: Box[] = [];
    const addedBoxIds: Set<string> = new Set();

    const tokenRequirements: Record<string, bigint> = {};
    let needsTokens = false;

    if (tokens && tokens.length > 0) {
      for (const t of tokens) {
        tokenRequirements[t.tokenId] = BigInt(t.amount.toString());
      }
      needsTokens = true;
    }

    let cumulativeErgValue = BigInt(0);
    let offset = 0;

    while (true) {
      const boxes = await ergo.get_utxos();
      if (!boxes) throw new Error('Issue getting boxes');

      for (const box of boxes) {
        let usedForTokens = false;

        // If we still need tokens, try to fulfill token requirements from this box
        if (needsTokens) {
          for (const asset of box.assets) {
            const required = tokenRequirements[asset.tokenId];
            if (required !== undefined && required > BigInt(0)) {
              const assetAmount = BigInt(asset.amount);
              // Reduce the token requirement by the asset amount
              tokenRequirements[asset.tokenId] =
                required > assetAmount ? required - assetAmount : BigInt(0);
              usedForTokens = true;
            }
          }
        }

        // If this box contributes either to tokens or we need ERGs, consider it for ERGs
        // Only add if not already added
        if (usedForTokens || cumulativeErgValue < targetNanoErgs) {
          if (!addedBoxIds.has(box.boxId)) {
            inputs.push(box);
            addedBoxIds.add(box.boxId);
            cumulativeErgValue += BigInt(box.value);
          }
        }
      }

      // Check if all token requirements are met (if any)
      const allTokensMet =
        !needsTokens ||
        Object.values(tokenRequirements).every((v) => v === BigInt(0));

      // If we meet both the token and ERG requirements, return
      if (allTokensMet && cumulativeErgValue >= targetNanoErgs) {
        return inputs;
      }

      offset += limit;

      // If we got fewer boxes than limit, no more boxes to fetch
      if (boxes.length < limit) {
        break;
      }
    }

    // If we reach here, we ran out of boxes before meeting requirements
    throw new Error(
      'Insufficient inputs to meet the required tokens and/or ERGs',
    );
  }
