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
        bool rewardClaimed;
    }

    mapping(address => Session) public sessions;

    uint256 public constant MAX_MOVES_FOR_REWARD = 20;

    event SessionStarted(address indexed player);
    event GameFinished(address indexed player, uint256 moves);
    event AchievementMinted(address indexed player, uint256 tokenId);

    constructor() ERC721("Base Memory Achievement", "BMEM") {}

    function startSession() external {
        require(!sessions[msg.sender].active, "Session already active");
        sessions[msg.sender] = Session(true, 0, false);
        emit SessionStarted(msg.sender);
    }

    function finishGame(uint256 totalMoves) external {
        Session storage session = sessions[msg.sender];
        require(session.active, "No active session");
        require(totalMoves > 0, "Invalid moves");

        session.active = false;
        session.moves = totalMoves;

        emit GameFinished(msg.sender, totalMoves);

        if (totalMoves <= MAX_MOVES_FOR_REWARD && !session.rewardClaimed) {
            _mintAchievement(msg.sender);
            session.rewardClaimed = true;
        }
    }

    function _mintAchievement(address player) internal {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(player, tokenId);
        emit AchievementMinted(player, tokenId);
    }
}
