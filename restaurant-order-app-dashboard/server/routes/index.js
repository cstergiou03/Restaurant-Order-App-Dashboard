import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { ObjectId } from 'mongodb';
dotenv.config({ path: '../config.env' });

const app = express();
const upload = multer({
    dest: 'uploads/',
    limits: {
      fileSize: 1024 * 1024 * 20, 
    },
  });
const uri = process.env.ATLAS_URI;

app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(upload.single('foodImage'));

async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('Restaurant');
    const ordersCollection = db.collection('OrdersDone');
    const ordersUndoneCollection = db.collection('OrdersUndone');
    const foodsCollection = db.collection('Foods');
    return { ordersCollection, foodsCollection, ordersUndoneCollection };
}

app.get('/api/orders', async (req, res) => {
    try {
        const { ordersCollection } = await connectToDatabase();
        const orders = await ordersCollection.find({}).toArray();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/undoneOrders', async (req, res) => {
    try {
        const { ordersUndoneCollection } = await connectToDatabase();
        const ordersUndone = await ordersUndoneCollection.find({}).toArray();
        res.json(ordersUndone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/foods', async (req, res) => {
    try {
        const { foodsCollection } = await connectToDatabase();
        const foods = await foodsCollection.find({}).toArray();
        res.json(foods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/foods', async (req, res) => {
    try {
        const { foodsCollection } = await connectToDatabase();
        const { name, price, photo } = req.body;

        await foodsCollection.insertOne({ name, price, photo });

        res.status(201).json({ message: 'Food created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { ordersCollection } = await connectToDatabase();
        const { items, total_price, address, order_date } = req.body;

        await ordersCollection.insertOne({ items, total_price, address, order_date });

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/undoneOrders', async (req, res) => {
    try {
        const { ordersUndoneCollection } = await connectToDatabase();
        const { items, total_price, address, order_date } = req.body;

        await ordersUndoneCollection.insertOne({ items, total_price, address, order_date });

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/undoneOrders/:id', async (req, res) => {
    try {
        const { ordersUndoneCollection } = await connectToDatabase();
        const orderId = new ObjectId(req.params.id);

        const result = await ordersUndoneCollection.deleteOne({ _id: orderId });
        
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
