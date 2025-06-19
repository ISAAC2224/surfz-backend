require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.static('public'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const productData = {
  "Rick Owens DRKSHDW Luxor Low 'Black Pearl'": { price: 65000, image: "DRKSHDW1.png" },
  "Gucci GG Slide 'Beige Canvas'": { price: 30000, image: "GGSlides1.png" },
  "Rick Owens Vintage Low Brown": { price: 62000, image: "leathersneakers3.png" },
  "BAPE Color Camo Shark Zip Hoodie (Purple)": { price: 26000, image: "Purple1.png" },
  "BAPE Color Camo Shark Zip Hoodie (Red)": { price: 30000, image: "Red1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Blue)": { price: 27500, image: "Blue1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Pink)": { price: 27500, image: "Pink1.png" },
  "BAPE Multi Camo NYC Shark Zip Hoodie (Black)": { price: 60000, image: "BMCNYC1.png" },
  "Rick Owen’s Vintage Suede Trimmed Leather": { price: 60000, image: "rickowens_1.png" },
  "Balenciaga Black Furry Slides": { price: 55000, image: "balenciaga_runner.png" },
  "Ben & Jerry’s x Dunk Low SB ‘Chunky Dunky’": { price: 95000, image: "B&J1.png" },
  "Supreme x Dunk Low SB ‘Rammellzee’": { price: 27500, image: "BBF1.png" },
  "Lil Yachty x Air Force 1 ‘Concrete Boys - Lucky Green’": { price: 23000, image: "LYXAF1.png" },
  "Union LA x Air Jordan 4 Retro ‘Off Noir’": { price: 38500, image: "UNION1.png" },
  "Jordan 14 Retro ‘Ferrari’": { price: 24500, image: "J141.png" },
  "Travis Scott x AJ1 Low OG ‘Black Phantom’": { price: 58500, image: "TSAJ1.png" },
  "Zoom Kobe 6 Protro ‘Dodgers’": { price: 28500, image: "ZK61.png" },
  "AF1 CPFM White": { price: 55000, image: "cpfm_white_1.png" },
  "AF1 CPFM Fuchsia Dream": { price: 57500, image: "cpfm_fuchsia_1.png" },
  "AirPods Max": { price: 40000, image: "airpods.png" },
  "Goyard Bag (green)": { price: 350000, image: "green-bag.png" },
  "Goyard Bag (blue)": { price: 350000, image: "blue-bag.png" }
};

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart } = req.body;
    console.log("🛒 Received cart:", cart);

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    const line_items = cart.map(item => {
      const nameFromCart = item.name.toLowerCase().trim();
      const matchedKey = Object.keys(productData).find(
        key => key.toLowerCase().trim() === nameFromCart
      );

      if (!matchedKey) {
        console.error("❌ Product not found:", item.name);
        throw new Error(`Unknown product: ${item.name}`);
      }

      const product = productData[matchedKey];
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: matchedKey,
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

    console.log("✅ Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("🔥 Checkout error:", error.message);
    res.status(500).json({ error: error.message || 'Checkout failed.' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
