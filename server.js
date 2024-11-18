const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Log-writing endpoint
app.post('/write-log', (req, res) => {
    const { functionName, errorMessage } = req.body;

    if (!functionName || !errorMessage) {
        return res.status(400).json({ error: 'functionName and errorMessage are required' });
    }

    const now = new Date();
    const timestamp = `${String(now.getMilliseconds()).padStart(3, '0')}-${String(now.getSeconds()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
    const logMessage = `${timestamp} ${functionName} ${errorMessage}\n`;

    const logFilePath = path.join(__dirname, 'logs.txt');

    // Append log to file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Failed to write log' });
        }
        console.log('Log written:', logMessage);
        res.status(200).json({ message: 'Log written successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});