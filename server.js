const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RRkFnRwjCfTdExOFcMf6CBRbgndhY5JCzChD9PFFBM6TrU1KB8kxHcBrFvwNYk2bOALpzZF12LauRnRDFBJ8wBy00w5sj6qw1");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ Serve images from the 'images' folder
app.use('/images', express.static('images'));

// 🛍️ Product data
const productData = {
  // Shoes
  "af1 cpfm fuchsia dream": { price: 575, image: "cpfm_fuchsia_1.png" },
  "af1 cpfm white": { price: 550, image: "cpfm_white_1.png" },
  "jordan 5 metallic": { price: 275, image: "jordan5metallic_1.png" },
  "rick owens porterville": { price: 650, image: "rick_owens_porterville_1.png" },
  "balenciaga runner": { price: 800, image: "balenciaga_runner_1.png" },
  "supreme x dunk low sb 'rammellzee'": { price: 275, image: "rammellzee.png" },
  "jordan 14 retro 'ferrari'": { price: 245, image: "ferrari14.png" },
  "balenciaga black furry slides": { price: 550, image: "black_furry_slides.png" },
  "rick owen vintage low brown": { price: 620, image: "vintage_low_brown.png" },
  "gucci gg slide 'beige canvas'": { price: 300, image: "gg_slide_beige.png" },
  "rick owens drkshdw luxor low 'black pearl'": { price: 650, image: "drkshdw_blackpearl.png" },
  "lil yachty x air force 1 low 'concrete boys - lucky green'": { price: 650, image: "lucky_green.png" },
  "travis scott x air jordan 1 retro low og 'black phantom'": { price: 585, image: "black_phantom.png" },
  "zoom kobe 6 protro 'dodgers'": { price: 285, image: "kobe_dodgers.png" },
  "union la x air jordan 4 retro 'off noir'": { price: 385, image: "off_noir.png" },
  "rick owen's vintage suede trimmed leather": { price: 600, image: "rick_suede_trimmed.png" },
  "ben & jerry’s x dunk low sb ‘chunky dunky’": { price: 950, image: "chunky_dunky.png" },

  // Slides
  "off white slides": { price: 195, image: "off_white_slides.png" },
  "marni slippers (multiple colors)": { price: 500, image: "marni_slippers.png" },

  // Bags
  "goyard backpack burgundy": { price: 3000, image: "GB3.png" },
  "goyard backpack black": { price: 3000, image: "GB2.png" },
  "goyard backpack green": { price: 3000, image: "GB1.png" },
  "goyard duffle bag blue": { price: 3500, image: "blue-bag.png" },
  "goyard duffle bag green": { price: 3500, image: "green-bag.png" },
  "mini coach bag beige": { price: 125, image: "MC1.png" },
  "mini coach bag black gold": { price: 125, image: "MC2.png" },
  "mini coach bag black subtle": { price: 125, image: "MC3.png" },
  "chanel medium denim deauville tote": { price: 2400, image: "CMDDT1.png" },
  "prada crochet tote bag": { price: 1600, image: "PCTB1.png" },
  "louis vuitton messenger bag": { price: 700, image: "LVMB1.png" },

  // Tech
  "airpods max": { price: 400, image: "airpods.png" },

  // Clothing
  "chrome hearts made in hollywood ls (size s)": { price: 400, image: "CHMIHPCLS1.png" },
  "chrome hearts made in hollywood ls (size m)": { price: 400, image: "CHMIHPCLS1.png" },
  "chrome hearts made in hollywood ls (size l)": { price: 400, image: "CHMIHPCLS1.png" },
  "chrome hearts made in hollywood ls (size xl)": { price: 400, image: "CHMIHPCLS1.png" },

  "chrome hearts spider web long sleeve (size s)": { price: 450, image: "CHMBSWLS1.png" },
  "chrome hearts spider web long sleeve (size m)": { price: 450, image: "CHMBSWLS1.png" },
  "chrome hearts spider web long sleeve (size l)": { price: 450, image: "CHMBSWLS1.png" },
  "chrome hearts spider web long sleeve (size xl)": { price: 450, image: "CHMBSWLS1.png" },

  "bape multi camo nyc shark zip hoodie (black) (size s)": { price: 600, image: "BMCNYC1.png" },
  "bape multi camo nyc shark zip hoodie (black) (size m)": { price: 600, image: "BMCNYC1.png" },
  "bape multi camo nyc shark zip hoodie (black) (size l)": { price: 600, image: "BMCNYC1.png" },
  "bape multi camo nyc shark zip hoodie (black) (size xl)": { price: 600, image: "BMCNYC1.png" },

  "bape abc camo shark zip hoodie (pink) (size s)": { price: 275, image: "Pink1.png" },
  "bape abc camo shark zip hoodie (pink) (size m)": { price: 275, image: "Pink1.png" },
  "bape abc camo shark zip hoodie (pink) (size l)": { price: 275, image: "Pink1.png" },
  "bape abc camo shark zip hoodie (pink) (size xl)": { price: 275, image: "Pink1.png" },

  "bape abc camo shark zip hoodie (blue) (size s)": { price: 275, image: "Blue1.png" },
  "bape abc camo shark zip hoodie (blue) (size m)": { price: 275, image: "Blue1.png" },
  "bape abc camo shark zip hoodie (blue) (size l)": { price: 275, image: "Blue1.png" },
  "bape abc camo shark zip hoodie (blue) (size xl)": { price: 275, image: "Blue1.png" },

  "bape color camo shark zip hoodie (red) (size s)": { price: 300, image: "Red1.png" },
  "bape color camo shark zip hoodie (red) (size m)": { price: 300, image: "Red1.png" },
  "bape color camo shark zip hoodie (red) (size l)": { price: 300, image: "Red1.png" },
  "bape color camo shark zip hoodie (red) (size xl)": { price: 300, image: "Red1.png" },

  "bape color camo shark zip hoodie (purple) (size s)": { price: 260, image: "Purple1.png" },
  "bape color camo shark zip hoodie (purple) (size m)": { price: 260, image: "Purple1.png" },
  "bape color camo shark zip hoodie (purple) (size l)": { price: 260, image: "Purple1.png" },
  "bape color camo shark zip hoodie (purple) (size xl)": { price: 260, image: "Purple1.png" }
};

// 💳 Stripe Checkout Route
app.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.cart;
    console.log("📦 Incoming cart items:", items);

    const line_items = items.map(item => {
      const key = item.size ? `${item.name.trim().toLowerCase()} (size ${item.size.trim().toLowerCase()})` : item.name.trim().toLowerCase();
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

// 🚀 Launch the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
