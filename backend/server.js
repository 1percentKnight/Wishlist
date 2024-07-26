const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

// Variable to store the current filename (if needed for debugging)
let currentFileName = "";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with a timestamp
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    currentFileName = uniqueFilename; // Store the filename for debugging
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to retrieve data
app.get('/api/items', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/items', upload.array('images', 12), (req, res) => {
  console.log('Request Body:', req.body); // Log the request body for debugging

  // Check if 'items' exists in req.body
  if (!req.body.items) {
    return res.status(400).json({ error: 'No items data found in the request' });
  }

  try {
    const items = JSON.parse(req.body.items); // Parse the items data

    // Create a map of filenames to URLs
    const imageMap = req.files.reduce((acc, file) => {
      acc[file.filename] = `http://localhost:3000/uploads/${file.filename}`;
      return acc;
    }, {});

    // Attach image URLs to the items
    items.forEach(item => {
      if (item.file) {
        const fileName = item.file.split('/').pop(); // Extract filename from URL
        item.image = imageMap[fileName] || item.image; // Update with new URL
      }
    });

    // Save items data
    fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(200).json({ message: 'Data saved successfully', updatedItems: items });
    });
  } catch (err) {
    // Handle JSON parsing errors
    res.status(400).json({ error: 'Failed to parse items data', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
