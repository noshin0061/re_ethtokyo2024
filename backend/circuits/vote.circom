pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Vote() {
    signal input nullifier;
    signal input vote;
    signal input secret;

    signal output nullifierHash;
    signal output voteHash;

    component poseidonNullifier = Poseidon(2);
    poseidonNullifier.inputs[0] <== nullifier;
    poseidonNullifier.inputs[1] <== secret;
    nullifierHash <== poseidonNullifier.out;

    component poseidonVote = Poseidon(2);
    poseidonVote.inputs[0] <== vote;
    poseidonVote.inputs[1] <== secret;
    voteHash <== poseidonVote.out;
}

component main = Vote();