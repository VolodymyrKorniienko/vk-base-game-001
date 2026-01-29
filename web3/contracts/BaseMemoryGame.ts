export const BASE_MEMORY_GAME_ABI = [
  {
    inputs: [],
    name: 'startSession',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'totalMoves',
        type: 'uint256',
      },
    ],
    name: 'finishGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'sessions',
    outputs: [
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'moves',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'rewardClaimed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_MOVES_FOR_REWARD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'SessionStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'moves',
        type: 'uint256',
      },
    ],
    name: 'GameFinished',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'AchievementMinted',
    type: 'event',
  },
] as const;

export const BASE_MEMORY_GAME_ADDRESS = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) || '';

export function isContractConfigured(): boolean {
  return !!BASE_MEMORY_GAME_ADDRESS && 
         BASE_MEMORY_GAME_ADDRESS !== '0x0000000000000000000000000000000000000000';
}
