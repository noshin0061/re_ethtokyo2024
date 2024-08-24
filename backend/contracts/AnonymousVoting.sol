// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IGroth16Verifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) external view returns (bool);
}

contract AnonymousVoting {
    IGroth16Verifier public verifier;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => bool) public votes;
    uint256 public yesVotes;
    uint256 public noVotes;

    event VoteCast(uint256 indexed nullifierHash, uint256 indexed voteHash);

    constructor(address _verifier) {
        verifier = IGroth16Verifier(_verifier);
    }

    // ... 残りのコードは変更なし
}