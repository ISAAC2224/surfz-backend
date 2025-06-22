const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RRkFnRwjCfTdExOFcMf6CBRbgndhY5JCzChD9PFFBM6TrU1KB8kxHcBrFvwNYk2bOALpzZF12LauRnRDFBJ8wBy00w5sj6qw1");

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

const productData = {
  "Lil Yachty x Air Force 1 'Concrete Boys - Lucky Green'": { price: 23000, image: "LYXAF1.png" },
  "Goyard Duffle Bag (Green)": { price: 350000, image: "green-bag.png" },
  "Goyard Duffle Bag (Blue)": { price: 350000, image: "blue-bag.png" },
  "Goyard Backpack (Burgundy)": { price: 300000, image: "GB3.png" },
  "Goyard Backpack (Black)": { price: 300000, image: "GB2.png" },
  "Goyard Backpack (Green)": { price: 300000, image: "GB1.png" },
  "Rick Owens DRKSHDW Luxor Low Black Pearl": { price: 65000, image: "DRKSHDW1.png" },
  "Rick Owens Vintage Suede Trimmed Leather": { price: 60000, image: "leathersneakers1.png" },
  "Rick Owen Vintage Low Brown": { price: 62000, image: "ROVLB1.png" },
  "Balenciaga Black Furry Slides": { price: 55000, image: "BBFS1.png" },
  "Jordan 14 Retro Ferrari": { price: 24500, image: "J141.png" },
  "Travis Scott x AJ1 Low OG Black Phantom": { price: 58500, image: "TSAJ1.png" },
  "Union LA x Air Jordan 4 Retro Off Noir": { price: 38500, image: "UNION1.png" },
  "Zoom Kobe 6 Protro Dodgers": { price: 28500, image: "ZK61.png" },
  "Ben & Jerry’s x Dunk Low SB Chunky Dunky": { price: 95000, image: "B&J1.png" },
  "Supreme x Dunk Low SB Rammellzee": { price: 27500, image: "SXDL1.png" },
  "Powerpuff Girls Blossom Nike SB Dunks": { price: 21000, image: "PGB1.png" },
  "Chrome Hearts Made In Hollywood Plus Cross Long-Sleeve": { price: 40000, image: "CHMIHPCLS1.png" },
  "Chrome Hearts Made In Hollywood LS": { price: 40000, image: "CHMBSWLS1.png" },
  "Chrome Hearts Spider Web Long Sleeve (Size M)": { price: 45000, image: "CHSWLS1.png" },
  "Chrome Hearts Spider Web Long Sleeve (Size S)": { price: 45000, image: "CHSWLS1.png" },
  "BAPE Color Camo Shark Zip Hoodie (Purple)": { price: 26000, image: "Purple1.png" },
  "BAPE Color Camo Shark Zip Hoodie (Red)": { price: 30000, image: "Red1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Blue)": { price: 27500, image: "Blue1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Pink)": { price: 27500, image: "Pink1.png" },
  "BAPE Multi Camo NYC Shark Zip Hoodie (Black)": { price: 60000, image: "BMCNYC1.png" },
  "Balenciaga Runner": { price: 80000, image: "balenciaga_runner.png" },
  "AF1 CPFM Fuchsia Dream": { price: 57500, image: "cpfm_fuchsia_1.png" },
  "AF1 CPFM White": { price: 55000, image: "cpfm_white_1.png" },
  "Jordan 5 Metallic": { price: 42000, image: "jordan5_front.png" },
  "Rick Owens Porterville": { price: 64000, image: "rickowens_1.png" },
  "AirPods Max": { price: 40000, image: "airpods.png" },
  "Mini Coach Bag (Beige)": { price: 12500, image: "MC1.png" },
  "Mini Coach Bag (Black Gold)": { price: 12500, image: "MC2.png" },
  "Mini Coach Bag (Black Subtle)": { price: 12500, image: "MC3.png" },
  "Prada Crochet Tote Bag": { price: 160000, image: "PCTB1.png" },
  "Chanel Medium Denim Deauville Tote": { price: 240000, image: "CMDDT1.png" },
  "Louis Vuitton Messenger Bag": { price: 70000, image: "LVMB1.png" },
  "Louis Vuitton My Monogram Eclipse Hat": { price: 24500, image: "LVEH1.png" },
  "Off White Slides": { price: 26000, image: "OFFW1.png" },
  "Gucci GG Slide Beige Canvas": { price: 30000, image: "GGSlides1.png" },
  "Bottega Veneta Orbit": { price: 95000, image: "BVO1.png" }
};

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  try {
    const lineItems = items.map(item => {
      const cleanName = item.name.split(' (')[0].trim();
      const product = productData[item.name] || productData[cleanName];
      if (!product) throw new Error(`Product not found: ${item.name}`);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`https://surfz-backend.onrender.com/images/${product.image}`],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://www.surfzresell.com/success.html",
      cancel_url: "https://www.surfzresell.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session not started:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
