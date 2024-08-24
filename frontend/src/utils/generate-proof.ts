import * as circomlibjs from "circomlibjs";
const snarkjs = require('snarkjs');


async function fetchFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return response.arrayBuffer();
}

export async function generateProof(vote: number, nullifier: string, secret: string) {
    try {
        console.log('Starting proof generation...');
        
        console.log('Building Poseidon...');
        const poseidon = await circomlibjs.buildPoseidon();
        
        console.log('Calculating hashes...');
        const nullifierBigInt = BigInt(nullifier);
        const secretBigInt = BigInt(secret);
        
        const nullifierHash = poseidon.F.toString(poseidon([nullifierBigInt, secretBigInt]));
        const voteHash = poseidon.F.toString(poseidon([BigInt(vote), secretBigInt]));
        
        const input = {
            nullifier: nullifierBigInt.toString(),
            vote: vote.toString(),
            secret: secretBigInt.toString()
        };
        
        console.log('Fetching WASM and zkey files...');
        const wasmBuffer = await fetchFile('/circuits/vote_js/vote.wasm');
        const zkeyBuffer = await fetchFile('/circuits/vote_0001.zkey');
        
        console.log('Generating full proof...');
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            new Uint8Array(wasmBuffer),
            new Uint8Array(zkeyBuffer)
        );
        
        console.log('Proof generation completed.');
        return { proof, publicSignals };
    } catch (error) {
        console.error('Error generating proof:', error);
        throw new Error('Failed to generate proof');
    }
}