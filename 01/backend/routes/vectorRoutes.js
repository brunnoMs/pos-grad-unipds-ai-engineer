import { Router } from 'express';
import client from '../db/chroma-client.js';

const router = Router();

router.post('/products', async (req, res) => {
    try {
        const vectors = req.body;

        // Remove a coleção antiga para evitar embeddings de dimensão
        // diferente ficarem presos de um treino anterior
        try {
            await client.deleteCollection({ name: 'product-vectors' });
        } catch (deleteError) {
            // Coleção pode não existir ainda, ok ignorar
        }

        let collection;
        try {
            collection = await client.createCollection({
                name: 'product-vectors'
            });
        } catch (createError) {
            // Duas requisições concorrentes podem colidir no delete+create;
            // tenta de novo uma vez após remover o que ficou para trás
            await client.deleteCollection({ name: 'product-vectors' });
            collection = await client.createCollection({
                name: 'product-vectors'
            });
        }

        await collection.add({
            ids: vectors.map(v => String(v.meta.id)),
            embeddings: vectors.map(v => v.vector),
            metadatas: vectors.map(v => ({
                name: v.name,
                category: v.meta.category,
                color: v.meta.color,
                price: v.meta.price
            }))
        });

        res.json({
            success: true,
            count: vectors.length
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});



router.post('/users', async (req, res) => {
    try {
        const userVector = req.body
        const collection = await client.getCollection({
            name: 'product-vectors'
        });
        const result = await collection.query({
            queryEmbeddings: [Array.from(userVector)],
            nResults: 200,
            include: ['metadatas', 'embeddings', 'distances']
        })
        res.json(result)
    } catch (error) {
        console.error('Error querying user vectors:', error);
        res.status(500).json({
            error: error.message,
            details: 'Failed to query user vectors from ChromaDB'
        })
    }
})

export default router;
