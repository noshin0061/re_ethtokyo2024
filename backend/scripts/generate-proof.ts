import { buildPoseidon } from "circomlibjs";
import { groth16 } from "snarkjs";
import fs from 'fs/promises';
import path from 'path';

export async function generateProof(vote: number, nullifier: string, secret: string) {
    try {
        console.log('Starting proof generation...');
        
        console.log('Building Poseidon...');
        const poseidon = await buildPoseidon();
        
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
        
        console.log('Reading WASM and zkey files...');
        const wasmPath = path.join(process.cwd(), 'public', 'circuits', 'vote_js', 'vote.wasm');
        const zkeyPath = path.join(process.cwd(), 'public', 'circuits', 'vote_0001.zkey');
        
        const wasmBuffer = await fs.readFile(wasmPath);
        const zkeyBuffer = await fs.readFile(zkeyPath);
        
        console.log('Generating full proof...');
        const { proof, publicSignals } = await groth16.fullProve(
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