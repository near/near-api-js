const { validateExecutionProof } = require('../src/index');

async function testProof(merkleRoot, proofPath) {
    let proof = require(proofPath);
    const root = Uint8Array.from(Buffer.from(merkleRoot.substring(2), 'hex'));
    validateExecutionProof({ proof, blockMerkleRoot: root });
}

test('Proof test vectors', async () => {
    await testProof('0x22f00dd154366d758cd3e4fe81c1caed8e0db6227fe4b2b52a8e5a468aa0a723', './proofs/proof2.json');
    await testProof('0x0d0776820a9a81481a559c36fd5d69c33718fb7d7fd3be7564a446e043e2cb35', './proofs/proof3.json');
    await testProof('0x1f7129496c461c058fb3daf258d89bf7dacb4efad5742351f66098a00bb6fa53', './proofs/proof4.json');
    await testProof('0xa9cd8eb4dd92ba5f2fef47d68e1d73ac8c57047959f6f8a2dcc664419e74e4b8', './proofs/proof5.json');
    await testProof('0xcc3954a51b7c1a86861df8809f79c2bf839741e3e380e28360b8b3970a5d90bd', './proofs/proof6.json');
    await testProof('0x8298c9cd1048df03e9ccefac4b022636a30a2f7e6a8c33cc4104901b92e08dfd', './proofs/proof7.json');
});
