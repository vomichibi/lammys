const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const OrderSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  items: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    category: String
  }],
  status: String,
  total: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Analytics Routes
app.get('/api/analytics/revenue', async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedRevenue = revenue.map(item => ({
      name: months[item._id.month - 1],
      total: item.total
    }));

    res.json(formattedRevenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/recent-orders', async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('userEmail items status total createdAt');

    const formattedOrders = recentOrders.map(order => ({
      id: order._id,
      customer: order.userEmail,
      service: order.items[0]?.name || 'Multiple Items',
      status: order.status,
      total: `$${order.total.toFixed(2)}`
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
