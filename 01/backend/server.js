import express from 'express';
import cors from 'cors';

import vectorRoutes from './routes/vectorRoutes.js';

const app = express();

app.use(cors());

app.use(express.json({ limit: '20mb' }));

app.use('/api/vectors', vectorRoutes);

app.get('/health', (req, res) => {
    console.log('HEALTH ROUTE HIT');

    res.json({
        status: 'OK'
    });
});


const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});


