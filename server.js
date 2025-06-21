const express = require("express");
const app = express(); // Moved up to fix order
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RRkFnRwjCfTdExOFcMf6CBRbgndhY5JCzChD9PFFBM6TrU1KB8kxHcBrFvwNYk2bOALpzZF12LauRnRDFBJ8wBy00w5sj6qw1");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ Serve images from the 'images' folder (NOT public/images anymore)
app.use('/images', express.static('images'));

const productData = {
  "af1 cpfm fuchsia dream": { price: 575, image: "cpfm_fuchsia_1.png" },
  "af1 cpfm white": { price: 550, image: "cpfm_white_1.png" },
  "jordan 5 metallic": { price: 275, image: "jordan5_front.png" },
  "balenciaga runner": { price: 800, image: "balenciaga_runner.png" },
  "rick owens porterville": { price: 650, image: "rickowens_1.png" },
  "zoom kobe 6 protro 'dodgers'": { price: 285, image: "ZK61.png" },
  "bottega veneta orbit": { price: 950, image: "BVO1.png" },
  "lil yachty x air force 1 'concrete boys - lucky green'": { price: 650, image: "LYXAF1.png" },
  "union la x air jordan 4 retro 'off noir'": { price: 385, image: "UNION1.png" },
  "powerpuff girls blossom nike sb dunks": { price: 525, image: "PGB1.png" },
  "travis scott x aj1 low og 'black phantom'": { price: 585, image: "TSAJ1.png" },
  "jordan 14 retro 'ferrari'": { price: 245, image: "J141.png" },
  "rick owens vintage low brown": { price: 590, image: "ROVLB1.png" },
  "supreme x dunk low sb 'rammellzee'": { price: 275, image: "SXDL1.png" },
  "marni slippers (multiple colors)": { price: 500, image: "pinkmarni.png" },
  "rick owens drkshdw luxor low 'black pearl'": { price: 650, image: "DRKSHDW1.png" },
  "off white slides": { price: 195, image: "OFFW1.png" },
  "rick owen's vintage suede trimmed leather": { price: 600, image: "leathersneakers1.png" },
  "balenciaga black furry slides": { price: 550, image: "BBFS1.png" },
  "ben & jerry’s x dunk low sb ‘chunky dunky’": { price: 950, image: "B&J1.png" },
  "bape color camo shark zip hoodie (purple)": { price: 260, image: "Purple1.png" },
  "bape color camo shark zip hoodie (red)": { price: 300, image: "Red1.png" },
  "bape abc camo shark zip hoodie (blue)": { price: 275, image: "Blue1.png" },
  "bape abc camo shark zip hoodie (pink)": { price: 275, image: "Pink1.png" },
  "bape multi camo nyc shark zip hoodie (black)": { price: 600, image: "BMCNYC1.png" },
  "chrome hearts made in hollywood ls": { price: 400, image: "CHMIHPCLS1.png" },
  "chrome hearts spider web long sleeve": { price: 450, image: "CHMBSWLS1.png" }
};

app.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.cart;
    console.log("📦 Incoming cart items:", items);

    const line_items = items.map(item => {
      const key = item.name.trim().toLowerCase();
      const product = productData[key];

      if (!product) {
        console.error("❌ Product not found in productData:", key);
        throw new Error(`Product not found: ${key}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`https://surfz-backend.onrender.com/images/${product.image}`],
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://surfzresell.com/success.html",
      cancel_url: "https://surfzresell.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("🔥 Stripe session creation error:", err);
    res.status(500).json({ error: "Checkout session failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
