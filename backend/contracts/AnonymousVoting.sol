// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Groth16Verifier.sol";

contract AnonymousVoting {
    Groth16Verifier public verifier;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => bool) public votes;
    uint256 public yesVotes;
    uint256 public noVotes;

    event VoteCast(uint256 indexed nullifierHash, uint256 indexed voteHash);

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }

    function castVote(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory _pubSignals
    ) public {
        require(verifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid zero-knowledge proof");

        uint256 nullifierHash = _pubSignals[0];
        uint256 voteHash = _pubSignals[1];

        require(!nullifierHashes[nullifierHash], "Vote already cast");

        nullifierHashes[nullifierHash] = true;
        votes[voteHash] = true;

        emit VoteCast(nullifierHash, voteHash);
    }

    function tallyVotes(uint256[] memory _yesVotes, uint256[] memory _noVotes) public {
        for (uint i = 0; i < _yesVotes.length; i++) {
            if (votes[_yesVotes[i]]) {
                yesVotes++;
                votes[_yesVotes[i]] = false; // Prevent double counting
            }
        }

        for (uint i = 0; i < _noVotes.length; i++) {
            if (votes[_noVotes[i]]) {
                noVotes++;
                votes[_noVotes[i]] = false; // Prevent double counting
            }
        }
    }

    function getVoteResults() public view returns (uint256, uint256) {
        return (yesVotes, noVotes);
    }
}