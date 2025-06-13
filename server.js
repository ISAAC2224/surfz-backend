require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ Serve static files
app.use(express.static('public'));

// ✅ Allow both frontend origins
const allowedOrigins = [
  'https://surfz-frontend.onrender.com',
  'https://surfzresell.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.options('*', cors());
app.use(express.json());

// ✅ Product data
const productData = {
  "AF1 CPFM Fuchsia Dream": {
    price: 57500,
    image: "cpfm_fuchsia_1.png"
  },
  "AF1 CPFM White": {
    price: 55000,
    image: "cpfm_white_1.png"
  },
  "Jordan 5 Metallic": {
    price: 27500,
    image: "jordan5_front.png"
  },
  "Balenciaga Runner": {
    price: 80000,
    image: "balenciaga_runner.png"
  },
  "Rick Owens Porterville": {
    price: 65000,
    image: "rickowens_1.png"
  },
  "Goyard Bag (green)": {
    price: 375000,
    image: "green-bag.png"
  },
  "Goyard Bag (blue)": {
    price: 350000,
    image: "blue-bag.png"
  },
  "AirPods Max": {
    price: 40000,
    image: "airpods.png"
  }
};

// ✅ Checkout route
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart } = req.body;
    console.log("Received cart:", cart);

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    const line_items = cart.map(item => {
      const product = productData[item.name];
      if (!product) throw new Error(`Unknown product: ${item.name}`);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [`https://surfz-backend.onrender.com/${product.image}`]
          },
          unit_amount: product.price,
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://surfzresell.com/success.html',
      cancel_url: 'https://surfzresell.com/cart.html',
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    res.status(500).json({ error: error.message || 'Checkout failed.' });
  }
});

// ✅ Render-compatible port
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
