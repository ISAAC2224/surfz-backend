// server.js
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RdP4J2MvrNawmXjU24bHXkhgHQJQrU4Y1Pq2sszf7gGravcbZJxN2jVe7XgTkuED9lPuBHA3f1eZbTuAzJ05C3x00BAxDmCcw");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images
app.use("/images", express.static("images"));

const productData = {
  "Chrome Hearts Spider Web Long Sleeve": { price: 45000 },
  "Chrome Hearts Made In Hollywood LS": { price: 40000 },
  "BAPE Color Camo Shark Zip Hoodie (Purple)": { price: 26000 },
  "BAPE Color Camo Shark Zip Hoodie (Red)": { price: 30000 },
  "BAPE ABC Camo Shark Zip Hoodie (Blue)": { price: 27500 },
  "BAPE ABC Camo Shark Zip Hoodie (Pink)": { price: 27500 },
  "BAPE Multi Camo NYC Shark Zip Hoodie (Black)": { price: 60000 },
  "Marni Slippers (Multiple Colors)": { price: 50000 },
  "Ben & Jerrys x Dunk Low SB Chunky Dunky": { price: 95000 },
  "Balenciaga Black Furry Slides": { price: 55000 },
  "Rick Owens Vintage suede-trimmed leather sneakers": { price: 60000 },
  "Off White Slides black and yellow": { price: 18500 },
  "Rick Owens DRKSHDW Luxor Low Black Pearl": { price: 65000 },
  "Supreme x Dunk Low SB Rammellzee": { price: 27500 },
  "Rick Owen Vintage Low Brown": { price: 59000 },
  "Jordan 14 Retro Ferrari": { price: 24500 },
  "Travis Scott x AJ1 Low OG Black Phantom": { price: 58500 },
  "Powerpuff Girls Blossom Nike SB Dunks": { price: 30000 },
  "Union LA x Air Jordan 4 Retro Off Noir": { price: 38500 },
  "Lil Yachty x Air Force 1 Concrete Boys Lucky Green": { price: 23000 },
  "Bottega Veneta Orbit": { price: 95000 },
  "Zoom Kobe 6 Protro Dodgers": { price: 28500 },
  "Rick Owens Porterville": { price: 65000 },
  "AF1 CPFM White": { price: 55000 },
  "Multicolor Balenciaga runners": { price: 80000 },
  "Jordan 5 Metallic": { price: 27500 },
  "AF1 CPFM Fuchsia Dream": { price: 57500 }
};

app.post("/create-checkout-session", async (req, res) => {
  const { productName, size } = req.body;
  const product = productData[productName];

  if (!product) {
    return res.status(400).json({ error: "Product not found." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              ...(size && { description: `Size: ${size}` })
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      success_url: "https://surfzresells.com/success.html",
      cancel_url: "https://surfzresells.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
