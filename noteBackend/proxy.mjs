import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.get('/pdf/:name', async (req, res) => {
    try {
        const name = req.params.name
        console.log(name)
        const response = await fetch(`https://dricandpeter.blob.core.windows.net/pdfblob/${encodeURIComponent(name)}`);
        const pdfBuffer = await response.buffer();
        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Error fetching PDF');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
