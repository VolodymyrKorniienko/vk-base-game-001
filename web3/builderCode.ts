import { Attribution } from 'ox/erc8021';
import { type Hex, concatHex } from 'viem';

/**
 * Builder Code for Base attribution (ERC-8021).
 * Register at base.dev -> Settings -> Builder Code.
 * Replace with your actual builder code after registration.
 */
const BUILDER_CODE = process.env.NEXT_PUBLIC_BUILDER_CODE || '';

let dataSuffix: Hex | null = null;

function getDataSuffix(): Hex | null {
  if (!BUILDER_CODE) return null;

  if (!dataSuffix) {
    dataSuffix = Attribution.toDataSuffix({
      codes: [BUILDER_CODE],
    }) as Hex;
  }

  return dataSuffix;
}

/**
 * Appends the ERC-8021 builder code attribution suffix to transaction calldata.
 * If no builder code is configured, returns the original data unchanged.
 */
export function appendBuilderAttribution(data: Hex): Hex {
  const suffix = getDataSuffix();
  if (!suffix) return data;
  return concatHex([data, suffix]);
}

export function isBuilderCodeConfigured(): boolean {
  return !!BUILDER_CODE;
}
