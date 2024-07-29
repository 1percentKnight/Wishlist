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

    console.log("Received data:", data);
    // Array of items[]
    // {
    //     items: [
    //       { name: 'Solar Panel System', price: '400000'},
    //       { name: 'gjhg', price: 'yiuyi' }
    //     ]
    // }  

    fs.writeFile("data.json", JSON.stringify(data), function (err) {
        if (err)
            console.log("Error saving data", err);
    });

    res.status(200).send("Data received successfully");
});

app.get('/api/items', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, content) => {
        if (err) {
            console.log("Error reading file: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        const data = JSON.parse(content);
        return res.status(200).json(data);
        
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})