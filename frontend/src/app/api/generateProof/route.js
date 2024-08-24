import { generateProof } from '@backend/scripts/generate-proof';

export async function POST(request) {
  try {
    const { vote, nullifier, secret } = await request.json();
    const result = await generateProof(vote, nullifier, secret);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proof generation error:', error);
    return new Response(JSON.stringify({ error: 'Proof generation failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
