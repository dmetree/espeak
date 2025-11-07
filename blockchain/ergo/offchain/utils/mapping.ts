import { Box } from "@fleet-sdk/core";

export function mapExplorerBox(explorerBox: any): Box {
  return {
    ...explorerBox,
    additionalRegisters: {
      R4: explorerBox.additionalRegisters.R4?.serializedValue,
      R5: explorerBox.additionalRegisters.R5?.serializedValue,
      R6: explorerBox.additionalRegisters.R6?.serializedValue,
      R7: explorerBox.additionalRegisters.R7?.serializedValue,
      R8: explorerBox.additionalRegisters.R8?.serializedValue,
      R9: explorerBox.additionalRegisters.R9?.serializedValue,
    },
  } as Box;
}
