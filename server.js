require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const productData = {
  "AF1 CPFM Fuchsia Dream": {
    price: 57500,
    image: "https://imgur.com/WLeSvBf.png"
  },
  "AF1 CPFM White": {
    price: 55000,
    image: "https://imgur.com/eQzhue0.png"
  },
  "Jordan 5 Metallic": {
    price: 27500,
    image: "https://imgur.com/M4sYUqP.png"
  },
  "Balenciaga Runner": {
    price: 80000,
    image: "https://imgur.com/UoPTHP4.png"
  },
  "Rick Owens Porterville": {
    price: 65000,
    image: "https://imgur.com/J9zQ80U.png"
  },
  "Goyard Bag (green)": {
    price: 375000,
    image: "https://imgur.com/1738313_z-removebg-preview.png"
  },
  "Goyard Bag (blue)": {
    price: 350000,
    image: "https://imgur.com/1666903034971-removebg-preview.png"
  },
  "AirPods Max": {
    price: 40000,
    image: "https://imgur.com/IMG_1013-removebg-preview.png"
  }
};

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart } = req.body;

    const line_items = cart.map(item => {
      const product = productData[item.name];
      if (!product) throw new Error(`Unknown product: ${item.name}`);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [product.image]
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

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: 'Checkout failed.' });
  }
});

app.listen(4242, () => console.log('Server is running on port 4242'));
