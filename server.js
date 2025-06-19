
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// ✅ Serve static files
app.use(express.static('public'));

// ✅ Allow both frontend domains dynamically
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

app.use(express.json());

// ✅ Product Data
const productData = {
  "AF1 CPFM Fuchsia Dream": { price: 57500, image: "cpfm_fuchsia_1.png" },
  "AF1 CPFM White":         { price: 55000, image: "cpfm_white_1.png" },
  "Jordan 5 Metallic":      { price: 27500, image: "jordan5_front.png" },
  "Balenciaga Runner":      { price: 80000, image: "balenciaga_runner.png" },
  "Rick Owens Porterville": { price: 65000, image: "rickowens_1.png" },
  "Goyard Bag (green)":     { price: 375000, image: "green-bag.png" },
  "Goyard Bag (blue)":      { price: 350000, image: "blue-bag.png" },
  "AirPods Max":            { price: 40000, image: "airpods.png" },
  "Zoom Kobe 6 Protro 'Dodgers'": { price: 95000, image: "kobe6_dodgers.png" },
  "Travis Scott x AJ1 Low OG 'Black Phantom'": { price: 85000, image: "travis_blackphantom.png" },
  "Jordan 14 Retro 'Ferrari'": { price: 60000, image: "jordan14_ferrari.png" },
  "Union LA x Air Jordan 4 Retro 'Off Noir'": { price: 75000, image: "union4_offnoir.png" },
  "Lil Yachty x Air Force 1 'Concrete Boys - Lucky Green'": { price: 70000, image: "lilyachty_af1.png" },
  "Supreme x Dunk Low SB 'Rammellzee'": { price: 55000, image: "rammellzee_sb.png" },
  "Ben & Jerry’s x Dunk Low SB ‘Chunky Dunky’": { price: 90000, image: "chunky_dunky.png" },
  "Balenciaga Black Furry Slides": { price: 62000, image: "balenciaga_furry.png" },
  "Rick Owen’s Vintage Suede Trimmed Leather": { price: 88000, image: "rickvintage_suede.png" }
};

// ✅ Checkout endpoint
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
    console.error("Checkout error:", error.message);
    res.status(500).json({ error: error.message || 'Checkout failed.' });
  }
});

// ✅ Set correct port
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
