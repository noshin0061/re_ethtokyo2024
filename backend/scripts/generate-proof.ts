import { buildPoseidon } from "circomlibjs";
import { groth16 } from "snarkjs";

export async function generateProof(vote: number, nullifier: string, secret: string) {
    const poseidon = await buildPoseidon();

    const nullifierHash = poseidon.F.toString(poseidon([nullifier, secret]));
    const voteHash = poseidon.F.toString(poseidon([vote.toString(), secret]));

    const input = {
        nullifier: nullifier,
        vote: vote.toString(),
        secret: secret
    };

    const { proof, publicSignals } = await groth16.fullProve(
        input,
        "circuits/vote_js/vote.wasm",
        "circuits/vote_0001.zkey"
    );

    return { proof, publicSignals };
}

//export { generateProof };