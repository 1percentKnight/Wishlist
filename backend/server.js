const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

// Helper function to clean up unused images
const cleanUpUnusedImages = (existingItems) => {
  const currentImageNames = existingItems.map(item => path.basename(item.imageUrl)).filter(Boolean);
  const allFiles = fs.readdirSync(UPLOADS_DIR);

  allFiles.forEach(file => {
    if (!currentImageNames.includes(file)) {
      fs.unlinkSync(path.join(UPLOADS_DIR, file));
    }
  });
};

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(UPLOADS_DIR));

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
  console.log('Request Files:', req.files); // Log the request files for debugging

  if (!req.body.items) {
    return res.status(400).json({ error: 'No items data found in the request' });
  }

  try {
    const newItems = JSON.parse(req.body.items);

    // Map filenames to URLs
    const imageMap = req.files.reduce((acc, file) => {
      acc[file.originalname] = `http://localhost:3000/uploads/${file.filename}`;
      return acc;
    }, {});

    // Read the existing data from the file
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read existing data' });
      }

      let existingItems = [];
      if (data) {
        existingItems = JSON.parse(data);
      }

      // Process the new items
      newItems.forEach(item => {
        if (item.image && imageMap[item.image]) {
          item.imageUrl = imageMap[item.image];
        }
      });

      // Save only the new or updated items
      const updatedItems = newItems.map(item => {
        // If item exists, update it, otherwise add it
        const existingItem = existingItems.find(e => e.name === item.name);
        return existingItem ? { ...existingItem, ...item } : item;
      });

      cleanUpUnusedImages(updatedItems);

      // Write the updated data to the file
      fs.writeFile(DATA_FILE, JSON.stringify(updatedItems, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save data' });
        }
        res.status(200).json({ message: 'Data saved successfully', updatedItems });
      });
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to parse items data', details: err.message });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
