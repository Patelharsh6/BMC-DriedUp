const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3021;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// --- UPDATED: userSchema ---
// The address field is now an object to store the full shipping details
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }, // This was the old field
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' }
  },
  purchase: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

// --- Order Schema (No Changes) ---
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    img: { type: String }
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.model('orders', orderSchema);


app.get('/', (req, res) => res.send('Hello from DripedUp Back-end!'));

// --- UPDATED: /api/signup ---
// Now saves the user's name and address string into the new address object
app.post('/api/signup', async (req, res) => {
  const { fullname, email, password, address } = req.body;

  if (!fullname || !email || !password || !address) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      email,
      password: passwordHash,
      // Save data into the new address object
      address: {
        name: fullname,
        address: address // Put the single-line address here
      },
      purchase: 0
    });

    await user.save();

    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        address: user.address // This will now send the object
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- UPDATED: /api/signin ---
// No code change, but now `user.address` which is returned is an object
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User does not exist' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        address: user.address // This is now an object!
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- /api/create-order (No Changes) ---
app.post('/api/create-order', async (req, res) => {
  const { userId, items, totalPrice, shippingAddress } = req.body;
  if (!userId || !items || items.length === 0 || !totalPrice || !shippingAddress) {
    return res.status(400).json({ message: 'Invalid order data' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const order = new Order({
      userId,
      items,
      totalPrice,
      shippingAddress,
      status: 'Pending'
    });
    const savedOrder = await order.save();
    return res.status(201).json({
      message: 'Order placed successfully!',
      order: savedOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- NEW: Get Order History Endpoint ---
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
                              .sort({ createdAt: -1 }); // Newest first

    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }
    return res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --- NEW: Update User Address Endpoint ---
app.put('/api/user/address', async (req, res) => {
  const { userId, address } = req.body;
  
  if (!userId || !address) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the address object
    user.address = address;
    await user.save();
    
    // Return the updated user (excluding password)
    return res.status(200).json({
      message: 'Address updated successfully!',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        address: user.address
      }
    });

  } catch (err) {
    console.error('Error updating address:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});