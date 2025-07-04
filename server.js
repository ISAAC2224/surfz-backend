// server.js
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51RdP4J2MvrNawmXjU24bHXkhgHQJQrU4Y1Pq2sszf7gGravcbZJxN2jVe7XgTkuED9lPuBHA3f1eZbTuAzJ05C3x00BAxDmCcw");

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

const productData = {
  "Jordan 5 Metallic": { price: 27500, image: "jordan5_front.png" },
  "AF1 CPFM Fuchsia Dream": { price: 57500, image: "cpfm_fuchsia_1.png" },
  "AF1 CPFM White": { price: 55000, image: "cpfm_white_1.png" },
  "Multicolor Balenciaga runners": { price: 80000, image: "balenciaga_runner.png" },
  "Rick Owens Porterville": { price: 65000, image: "rickowens_1.png" },
  "Zoom Kobe 6 Protro Dodgers": { price: 28500, image: "ZK61.png" },
  "Bottega Veneta Orbit": { price: 95000, image: "BVO1.png" },
  "Lil Yachty x Air Force 1 Concrete Boys Lucky Green": { price: 23000, image: "LYXAF1.png" },
  "Union LA x Air Jordan 4 Retro Off Noir": { price: 38500, image: "UNION1.png" },
  "Travis Scott x AJ1 Low OG Black Phantom": { price: 58500, image: "TSAJ1.png" },
  "Jordan 14 Retro Ferrari": { price: 24500, image: "J141.png" },
  "Rick Owens Vintage Low Brown": { price: 59000, image: "ROVLB1.png" },
  "Supreme x Dunk Low SB Rammellzee": { price: 27500, image: "SXDL1.png" },
  "Rick Owens DRKSHDW Luxor Low Black Pearl": { price: 65000, image: "DRKSHDW1.png" },
  "Off White Slides black and yellow": { price: 18500, image: "OFFW1.png" },
  "Rick Owens Vintage suede-trimmed leather sneakers": { price: 60000, image: "leathersneakers1.png" },
  "Balenciaga Black Furry Slides": { price: 55000, image: "BBFS1.png" },
  "Silver Bottega Veneta Orbit sneakers": { price: 80000, image: "SBVOS1.png" },
  "Black Bottega Veneta Orbit sneakers": { price: 80000, image: "BBVOS1.png" },
  "Pink Bottega Veneta Orbit sneakers": { price: 80000, image: "PBVOS1.png" },
  "Ben & Jerrys x Dunk Low SB Chunky Dunky": { price: 95000, image: "B&J1.png" },
  "Marni Slippers (Multiple Colors)": { price: 50000, image: "pinkmarni.png" },
  "Powerpuff Girls Blossom Nike SB Dunks": { price: 52000, image: "PGB1.png" },
  "Off White Slides black and yellow": { price: 19500, image: "OFFW1.png" },
  "Chrome Hearts Spider Web Long Sleeve": { price: 45000, image: "CHSWLS1.png" },
  "Chrome Hearts Made In Hollywood LS": { price: 40000, image: "CHMBSWLS1.png" },
  "BAPE Color Camo Shark Zip Hoodie (Purple)": { price: 26000, image: "Purple1.png" },
  "BAPE Color Camo Shark Zip Hoodie (Red)": { price: 30000, image: "Red1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Blue)": { price: 27500, image: "Blue1.png" },
  "BAPE ABC Camo Shark Zip Hoodie (Pink)": { price: 27500, image: "Pink1.png" },
  "BAPE Multi Camo NYC Shark Zip Hoodie (Black)": { price: 60000, image: "BMCNYC1.png" },

  // Bags
  "Chanel Medium Denim Deauville Tote": { price: 240000, image: "CMDDT1.png" },
  "Prada Crochet Tote Bag": { price: 160000, image: "PCTB1.png" },
  "Louis Vuitton Messenger Bag": { price: 70000, image: "LVMB1.png" },
  "Mini Coach Bag": { price: 12500, image: "MCB1.png" },
  "Goyard Backpack": { price: 300000, image: "GB1.png" },
  "Goyard Duffle Bag": { price: 350000, image: "blue-bag.png" },

  // Accessories & Headphones
  "Louis Vuitton My Monogram Eclipse Hat": { price: 24500, image: "LVEH1.png" },
  "AirPods Max": { price: 40000, image: "airpods.png" }
};

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const lineItems = items.map((item) => {
      const product = productData[item.name];

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

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
      success_url: "https://www.surfzresell.com/success",
      cancel_url: "https://www.surfzresell.com/cancel",
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      custom_fields: [
        {
          key: "product_option",
          label: {
            type: "custom",
            custom: "Type Size or Color"
          },
          type: "text",
          optional: false
        }
      ]
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => console.log("Server running on port 4242"));
