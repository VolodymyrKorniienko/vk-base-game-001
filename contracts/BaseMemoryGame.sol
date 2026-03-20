// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BaseMemoryGame is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Session {
        bool active;
        uint256 moves;
        uint256 level;
        bool completed;
        bool rewardClaimed;
        bool participationRewardClaimed;
    }

    mapping(address => Session) public sessions;

    uint256 public constant MAX_MOVES_FOR_REWARD = 20;
    uint256 public constant LEVEL_1_REWARD_MOVES = 20;

    event SessionStarted(address indexed player, uint256 level);
    event GameFinished(address indexed player, uint256 moves, bool completed, uint256 level);
    event AchievementMinted(address indexed player, uint256 tokenId, string rewardType);
    event ParticipationNFTMinted(address indexed player, uint256 tokenId, uint256 level);

    constructor() ERC721("Base Memory Achievement", "BMEM") {}

    function startSession() external {
        require(!sessions[msg.sender].active, "Session already active");
        sessions[msg.sender] = Session(true, 0, 1, false, false, false);
        emit SessionStarted(msg.sender, 1);
    }

    function startSessionForLevel(uint256 level) external {
        require(!sessions[msg.sender].active, "Session already active");
        require(level > 0, "Invalid level");
        sessions[msg.sender] = Session(true, 0, level, false, false, false);
        emit SessionStarted(msg.sender, level);
    }

    /**
     * @dev Завершение игры с указанием результата (completed=true для победы, false для поражения)
     */
    function finishGame(uint256 totalMoves, bool completed) external {
        Session storage session = sessions[msg.sender];
        require(session.active, "No active session");
        require(totalMoves > 0, "Invalid moves");

        session.active = false;
        session.moves = totalMoves;
        session.completed = completed;

        emit GameFinished(msg.sender, totalMoves, completed, session.level);

        // Mint NFT для первого уровня при успешном завершении
        if (session.level == 1 && completed && !session.rewardClaimed) {
            _mintLevel1Achievement(msg.sender);
            session.rewardClaimed = true;
        }

        // Mint NFT за участие для 2+ уровня (даже при проигрыше)
        if (session.level >= 2 && !session.participationRewardClaimed) {
            _mintParticipationNFT(msg.sender, session.level);
            session.participationRewardClaimed = true;
        }

        // Mint NFT за отличное завершение игры (≤20 ходов)
        if (completed && totalMoves <= MAX_MOVES_FOR_REWARD && !session.rewardClaimed) {
            _mintAchievement(msg.sender);
            session.rewardClaimed = true;
        }
    }

    /**
     * @dev Упрощённая версия завершения игры (всегда считается completed=true)
     */
    function finishGameSimple(uint256 totalMoves) external {
        Session storage session = sessions[msg.sender];
        require(session.active, "No active session");
        require(totalMoves > 0, "Invalid moves");

        session.active = false;
        session.moves = totalMoves;
        session.completed = true;

        emit GameFinished(msg.sender, totalMoves, true, session.level);

        // Mint NFT для первого уровня при успешном завершении
        if (session.level == 1 && !session.rewardClaimed) {
            _mintLevel1Achievement(msg.sender);
            session.rewardClaimed = true;
        }

        // Mint NFT за участие для 2+ уровня
        if (session.level >= 2 && !session.participationRewardClaimed) {
            _mintParticipationNFT(msg.sender, session.level);
            session.participationRewardClaimed = true;
        }

        // Mint NFT за отличное завершение игры (≤20 ходов)
        if (totalMoves <= MAX_MOVES_FOR_REWARD && !session.rewardClaimed) {
            _mintAchievement(msg.sender);
            session.rewardClaimed = true;
        }
    }

    function _mintLevel1Achievement(address player) internal {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(player, tokenId);
        emit AchievementMinted(player, tokenId, "Level 1 Complete");
    }

    function _mintParticipationNFT(address player, uint256 level) internal {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(player, tokenId);
        emit ParticipationNFTMinted(player, tokenId, level);
    }

    function _mintAchievement(address player) internal {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(player, tokenId);
        emit AchievementMinted(player, tokenId, "Perfect Game");
    }

    function getSession() external view returns (Session memory) {
        return sessions[msg.sender];
    }

    function resetSession() external {
        Session storage session = sessions[msg.sender];
        session.active = false;
        session.moves = 0;
        session.level = 0;
        session.completed = false;
    }
}
