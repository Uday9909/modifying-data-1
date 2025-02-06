require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const MenuItem = require('./models/MenuItem');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// POST route to add a menu item
app.post('/menu', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const newItem = new MenuItem({ name, description, price });
        await newItem.save();
        res.status(201).json({ message: 'Menu item added successfully', item: newItem });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET route to fetch all menu items
app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json(menuItems);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
