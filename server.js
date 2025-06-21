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
const baseProducts = {
  // Shoes (base keys, no sizes)
  "af1 cpfm fuchsia dream": { price: 575, image: "cpfm_fuchsia_1.png" },
  "af1 cpfm white": { price: 550, image: "cpfm_white_1.png" },
  "jordan 5 metallic": { price: 275, image: "jordan5_front.png" },
  "rick owens porterville": { price: 650, image: "rickowens_1.png" },
  "balenciaga runner": { price: 800, image: "balenciaga_runner.png" },
  "supreme x dunk low sb 'rammellzee'": { price: 275, image: "SXDL1.png" },
  "jordan 14 retro 'ferrari'": { price: 245, image: "J141.png" },
  "balenciaga black furry slides": { price: 550, image: "BBFS1.png" },
  "rick owen vintage low brown": { price: 620, image: "leathersneakers1.png" },
  "gucci gg slide 'beige canvas'": { price: 300, image: "GGSlides1.png" },
  "rick owens drkshdw luxor low 'black pearl'": { price: 650, image: "DRKSHDW1.png" },
  "lil yachty x air force 1 low 'concrete boys - lucky green'": { price: 650, image: "LYXAF1.png" },
  "travis scott x air jordan 1 retro low og 'black phantom'": { price: 585, image: "TSAJ1.png" },
  "zoom kobe 6 protro 'dodgers'": { price: 285, image: "ZK61.png" },
  "union la x air jordan 4 retro 'off noir'": { price: 385, image: "UNION1.png" },
  "rick owen's vintage suede trimmed leather": { price: 600, image: "leathersneakers1.png" },
  "ben & jerry’s x dunk low sb ‘chunky dunky’": { price: 950, image: "B&J1.png" },
  "powerpuff girls blossom nike sb dunks": { price: 300, image: "PGB1.png" },
  "bottega veneta orbit": { price: 720, image: "BVO1.png" },

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
  "airpods max": { price: 400, image: "airpods.png" }
};

const productData = {};
const sizes = ["5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14"];
Object.entries(baseProducts).forEach(([name, data]) => {
  if (name.includes("hoodie") || name.includes("long sleeve")) {
    return;
  }
  if (name.includes("bag")) {
    const color = name.split(" ").pop();
    productData[`${name} (color ${color})`] = data;
  }
  if (name.includes("backpack") || name.includes("duffle") || name.includes("slide") || name.includes("sneaker") || name.includes("dunk") || name.includes("jordan") || name.includes("air force") || name.includes("rick") || name.includes("balenciaga") || name.includes("kobe") || name.includes("bottega") || name.includes("gucci") || name.includes("off white") || name.includes("chunky") || name.includes("supreme")) {
    sizes.forEach(size => {
      productData[`${name} (size ${size})`] = data;
    });
  }
  productData[name] = data;
});

// 💳 Stripe Checkout Route
app.post("/create-checkout-session", async (req, res) => {
  try {
    const items = req.body.cart;
    console.log("📦 Incoming cart items:", items);

    const line_items = items.map(item => {
      let key;
      if (item.name.toLowerCase().includes("bag")) {
        key = `${item.name.trim().toLowerCase()} (color ${item.size.trim().toLowerCase()})`;
      } else {
        key = item.size ? `${item.name.trim().toLowerCase()} (size ${item.size.trim().toLowerCase()})` : item.name.trim().toLowerCase();
      }
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
