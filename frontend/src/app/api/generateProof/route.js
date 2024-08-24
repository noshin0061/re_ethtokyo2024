import { NextResponse } from 'next/server';
import { generateProof } from '../../../../backend/scripts/generate-proof';

export async function POST(request) {
  try {
    const { vote, nullifier, secret } = await request.json();
    const proofData = await generateProof(vote, nullifier, secret);
    return NextResponse.json(proofData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
