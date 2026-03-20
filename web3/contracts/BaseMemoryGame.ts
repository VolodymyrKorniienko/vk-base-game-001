export const BASE_MEMORY_GAME_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
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
        name: 'level',
        type: 'uint256',
      },
    ],
    name: 'startSessionForLevel',
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
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
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
        internalType: 'uint256',
        name: 'totalMoves',
        type: 'uint256',
      },
    ],
    name: 'finishGameSimple',
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
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'rewardClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'participationRewardClaimed',
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
    inputs: [],
    name: 'LEVEL_1_REWARD_MOVES',
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
    inputs: [],
    name: 'resetSession',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSession',
    outputs: [
      {
        internalType: 'uint256',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'moves',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'rewardClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'participationRewardClaimed',
        type: 'bool',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
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
      {
        indexed: false,
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
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
      {
        indexed: false,
        internalType: 'string',
        name: 'rewardType',
        type: 'string',
      },
    ],
    name: 'AchievementMinted',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'level',
        type: 'uint256',
      },
    ],
    name: 'ParticipationNFTMinted',
    type: 'event',
  },
] as const;

export const BASE_MEMORY_GAME_ADDRESS =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) || '';

export function isContractConfigured(): boolean {
  return !!BASE_MEMORY_GAME_ADDRESS &&
         BASE_MEMORY_GAME_ADDRESS !== '0x0000000000000000000000000000000000000000';
}
