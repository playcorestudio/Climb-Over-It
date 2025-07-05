const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000 || process.env.PORT;

const FILE = './scores.json';

app.use(express.json());

// Helper: Load scores
function loadScores() {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

// Helper: Save scores
function saveScores(scores) {
    fs.writeFileSync(FILE, JSON.stringify(scores, null, 2));
}

// Route: Add or update score
app.post('/score', (req, res) => {
    const { id, score } = req.body;
    if (!id || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const scores = loadScores();
    scores[id] = score;
    saveScores(scores);

    res.json({ success: true, id, score });
});

// Route: Get score by ID
app.get('/score', (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Missing id' });
    }

    const scores = loadScores();
    if (scores[id] !== undefined) {
        res.json({ id, score: scores[id] });
    } else {
        res.status(404).json({ error: 'ID not found' });
    }
});

// Route: Get all scores
app.get('/scores', (req, res) => {
    const scores = loadScores();
    res.json(scores);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
