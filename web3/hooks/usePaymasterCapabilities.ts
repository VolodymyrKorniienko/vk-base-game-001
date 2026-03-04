'use client';

import { useCapabilities } from 'wagmi';
import { useAccount } from 'wagmi';
import { base } from 'wagmi/chains';

const PAYMASTER_PROXY_URL = process.env.NEXT_PUBLIC_URL
  ? `${process.env.NEXT_PUBLIC_URL}/api/paymaster`
  : null;

interface PaymasterCapabilities {
  isPaymasterAvailable: boolean;
  paymasterUrl: string | null;
}

export function usePaymasterCapabilities(): PaymasterCapabilities {
  const { isConnected } = useAccount();

  const { data: capabilities } = useCapabilities({
    query: {
      enabled: isConnected && !!PAYMASTER_PROXY_URL,
    },
  });

  const chainCapabilities = capabilities?.[base.id] as
    | Record<string, { supported?: boolean }>
    | undefined;
  const walletSupportsPaymaster = !!chainCapabilities?.paymasterService?.supported;

  const isPaymasterAvailable = walletSupportsPaymaster && !!PAYMASTER_PROXY_URL;

  return {
    isPaymasterAvailable,
    paymasterUrl: isPaymasterAvailable ? PAYMASTER_PROXY_URL : null,
  };
}
