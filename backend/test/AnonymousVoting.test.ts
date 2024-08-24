import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AnonymousVoting, Verifier } from "../typechain-types";
import { generateProof } from "../scripts/generate-proof";

describe("AnonymousVoting", function () {
  let anonymousVoting: AnonymousVoting;
  let verifier: Verifier;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const Verifier = await ethers.getContractFactory("Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();

    const AnonymousVoting = await ethers.getContractFactory("AnonymousVoting");
    anonymousVoting = await AnonymousVoting.deploy(verifier.address);
    await anonymousVoting.deployed();
  });

  it("Should cast a vote", async function () {
    const { proof, publicSignals } = await generateProof(1, "123456", "mysecret");
    await expect(anonymousVoting.castVote(
      proof.pi_a,
      proof.pi_b,
      proof.pi_c,
      publicSignals
    )).to.emit(anonymousVoting, "VoteCast");
  });

  it("Should not allow double voting", async function () {
    const { proof, publicSignals } = await generateProof(1, "123456", "mysecret");
    await anonymousVoting.castVote(proof.pi_a, proof.pi_b, proof.pi_c, publicSignals);
    await expect(anonymousVoting.castVote(
      proof.pi_a,
      proof.pi_b,
      proof.pi_c,
      publicSignals
    )).to.be.revertedWith("Vote already cast");
  });

  it("Should tally votes correctly", async function () {
    const vote1 = await generateProof(1, "123456", "mysecret1");
    const vote2 = await generateProof(0, "234567", "mysecret2");

    await anonymousVoting.castVote(vote1.proof.pi_a, vote1.proof.pi_b, vote1.proof.pi_c, vote1.publicSignals);
    await anonymousVoting.castVote(vote2.proof.pi_a, vote2.proof.pi_b, vote2.proof.pi_c, vote2.publicSignals);

    await anonymousVoting.tallyVotes([vote1.publicSignals[1]], [vote2.publicSignals[1]]);

    expect(await anonymousVoting.yesVotes()).to.equal(1);
    expect(await anonymousVoting.noVotes()).to.equal(1);
  });
});