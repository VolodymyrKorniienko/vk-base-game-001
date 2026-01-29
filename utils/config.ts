export function getContractAddress(): string {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    throw new Error(
      'Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.'
    );
  }
  return address;
}

export function isContractConfigured(): boolean {
  try {
    getContractAddress();
    return true;
  } catch {
    return false;
  }
}
