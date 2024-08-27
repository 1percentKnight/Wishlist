const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/items', (req, res) => {
    const data = req.body;

    console.log("Adding data");

    const totalPrice = data.items.reduce((sum, item) => {
        return sum + parseFloat(item.price);
    }, 0);

    // Add total price to data
    data.totalPrice = totalPrice;

    fs.writeFile("data.json", JSON.stringify(data), function (err) {
        if (err)
            console.log("Error saving data", err);
    });

    res.status(200).json({ message: "Data saved successfully", totalPrice });
});

app.get('/api/items', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, content) => {
        if (err) {
            console.log("Error reading file: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!content) {
            return res.status(204).json({ message: "No content available" });
        }
        try {
            const data = JSON.parse(content);
            return res.status(200).json(data);
        } catch (parseErr) {
            console.log("Error parsing JSON: ", parseErr);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})