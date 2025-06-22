// server.js
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RRkFnRwjCfTdExOFcMf6CBRbgndhY5JCzChD9PFFBM6TrU1KB8kxHcBrFvwNYk2bOALpzZF12LauRnRDFBJ8wBy00w5sj6qw1");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

const productData = {
  "Balenciaga Runner": { price: 925, image: "balenciaga_runner.png" },
  "AF1 CPFM Fuchsia Dream": { price: 575, image: "cpfm_fuchsia_1.png" },
  "AF1 CPFM White": { price: 550, image: "cpfm_white_1.png" },
  "Jordan 5 Metallic": { price: 420, image: "jordan5_front.png" },
  "Rick Owens Porterville": { price: 640, image: "rickowens_1.png" },
  "AirPods Max": { price: 400, image: "airpods.png" },
  "Goyard Duffle Bag Blue": { price: 1100, image: "blue-bag.png" },
  "Goyard Duffle Bag Green": { price: 1100, image: "green-bag.png" },
  "Goyard Backpack Burgundy": { price: 1450, image: "GB3.png" },
  "Goyard Backpack Black": { price: 1450, image: "GB2.png" },
  "Goyard Backpack Green": { price: 1450, image: "GB1.png" },
  "Supreme x Dunk Low SB Rammellzee": { price: 275, image: "SXDL1.png" },
  "Jordan 14 Retro Ferrari": { price: 245, image: "J141.png" },
  "Travis Scott x AJ1 Low OG Black Phantom": { price: 585, image: "TSAJ1.png" },
  "Powerpuff Girls Blossom Nike SB Dunks (5.5)": { price: 210, image: "PGB1.png" },
  "Union LA x Air Jordan 4 Retro Off Noir": { price: 385, image: "UNION1.png" },
  "Lil Yachty x Air Force 1 Low Concrete Boys - Lucky Green": { price: 230, image: "LYXAF1.png" },
  "Bottega Veneta Orbit": { price: 800, image: "BVO1.png" },
  "Off White Slides": { price: 260, image: "OFFW1.png" },
  "Louis Vuitton My Monogram Eclipse Hat": { price: 390, image: "LVEH1.png" },
  "Gucci GG Slide Beige Canvas": { price: 300, image: "GGSlides1.png" },
  "Rick Owen Vintage Low Brown": { price: 620, image: "ROVLB1.png" },
  "Chrome Hearts Made In Hollywood Plus Cross Long-Sleeve": { price: 340, image: "CHMIHPCLS1.png" },
  "Prada Crochet Tote Bag": { price: 590, image: "PCTB1.png" },
  "Louis Vuitton Messenger Bag": { price: 875, image: "LVMB1.png" },
  "Mini Coach Bag Light Brown": { price: 120, image: "MC1.png" },
  "Mini Coach Bag Black": { price: 120, image: "MC2.png" },
  "Mini Coach Bag Dark Brown": { price: 120, image: "MC3.png" },
  "BAPE Color Camo Shark Zip Hoodie Purple": { price: 450, image: "Purple1.png" },
  "BAPE Color Camo Shark Zip Hoodie Red": { price: 450, image: "Red1.png" },
  "BAPE ABC Camo Shark Zip Hoodie Blue": { price: 450, image: "Blue1.png" },
  "BAPE ABC Camo Shark Zip Hoodie Pink": { price: 450, image: "Pink1.png" },
  "BAPE Multi Camo NYC Shark Zip Hoodie Black": { price: 450, image: "BMCNYC1.png" },
  "Ben & Jerry’s x Dunk Low SB Chunky Dunky (Side)": { price: 695, image: "B&J1.png" },
  "Ben & Jerry’s x Dunk Low SB Chunky Dunky (Sole)": { price: 695, image: "B&J2.png" },
  "Balenciaga Black Furry Slides": { price: 550, image: "BBFS1.png" },
  "Rick Owens DRKSHDW Luxor Low Black Pearl": { price: 650, image: "DRKSHDW1.png" },
  "Rick Owens Vintage Suede Trimmed Leather": { price: 600, image: "leathersneakers1.png" },
  "Chrome Hearts Made In Hollywood LS": { price: 330, image: "CHMBSWLS1.png" },
  "Zoom Kobe 6 Protro Dodgers": { price: 285, image: "ZK61.png" },
  "Chanel Medium Denim Deauville Tote": { price: 1150, image: "CMDDT1.png" }
};

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items || [];

  console.log("Received cart items:", items);

  try {
    const lineItems = items.map((item) => {
      const product = productData[item.name];
      if (!product) throw new Error(`Product not found: ${item.name}`);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`https://surfz-backend.onrender.com/images/${product.image}`],
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity || 1,
      };
    });

    // ✅ This line must be inside the async function
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "https://www.surfzresell.com/success.html",
      cancel_url: "https://www.surfzresell.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "https://www.surfzresell.com/success.html",
      cancel_url: "https://www.surfzresell.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "https://www.surfzresell.com/success.html",
      cancel_url: "https://www.surfzresell.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
