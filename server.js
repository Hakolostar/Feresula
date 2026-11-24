const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.join(__dirname, "dist");

const business = {
  name: "Feresula Coffee",
  nameAmharic: "ፈረሱላ ቡና",
  address: "Saris, 10/18, Nifas Silk-Lafto, Addis Ababa, Ethiopia",
  landmark: "Near Gotera",
  phone: "+251 96 641 1151",
  hours: "Monday – Sunday, 8:00 AM – 6:00 PM",
  priceRange: "400–1,200 ETB"
};

const menuItems = [
  {name:"Espresso",category:"coffee",label:"Coffee & drinks",price:"80–150 ETB",description:"A bold and concentrated coffee shot with rich flavor.",image:"/espresso.jpg"},
  {name:"Latte",category:"coffee",label:"Coffee & drinks",price:"100–220 ETB",description:"Smooth espresso with steamed milk.",image:"/latte.jpg"},
  {name:"Cold Brew",category:"coffee",label:"Coffee & drinks",price:"150–250 ETB",description:"Chilled coffee with a smooth, refreshing taste.",image:"/cold-brew.jpg"},
  {name:"Traditional Coffee",category:"coffee",label:"Coffee & drinks",price:"80–140 ETB",description:"Classic Ethiopian coffee, perfectly balanced.",image:"/coffee.jpg"},
  {name:"Butter Croissant",category:"bakery",label:"Bakery & pastries",price:"120–220 ETB",description:"Golden, flaky layers, lovely beside your morning coffee.",image:"/morning-special.jpg"},
  {name:"Honey Cake",category:"bakery",label:"Bakery & pastries",price:"150–280 ETB",description:"A soft, sweet slice with honeyed warmth.",image:"/feature-latte.jpg"},
  {name:"Oats Bread",category:"bakery",label:"Bakery & pastries",price:"100–200 ETB",description:"A hearty bake for a slower breakfast or a midday bite.",image:"/morning-special.jpg"},
  {name:"Fresh Pastries & Cakes",category:"bakery",label:"Bakery & pastries",price:"120–300 ETB",description:"Take a look at the counter for today’s freshly baked selection.",image:"/coffee.jpg"},
  {name:"Wraps & Light Plates",category:"savory",label:"Savory bites",price:"350–650 ETB",description:"A satisfying, freshly prepared bite for lunch or an easy catch-up.",image:"/morning-special.jpg"},
  {name:"Pizza & Fries",category:"savory",label:"Savory bites",price:"450–850 ETB",description:"A relaxed favorite to share, or keep all to yourself.",image:"/coffee.jpg"},
  {name:"Breakfast & Lunch",category:"savory",label:"Savory bites",price:"400–1,200 ETB",description:"Comforting plates for starting the day or taking a proper pause.",image:"/feature-latte.jpg"}
];

const branches = [
  {
    name:"Bole",
    subtitle:"Nile Source Building — across from Tropical Mall",
    vibe:"Sun-drenched plaster walls, terracotta planters, a tall arched mirror and warm minimalist seating.",
    tags:["Sun-drenched plaster","Terracotta planters","Arched mirror","Minimal seating"],
    hours:"Daily, 7:30 AM – 10:00 PM",
    phoneLabel:"+251 98 038 8182",
    phoneHref:"tel:+251980388182",
    locationNote:"Nile Source Building, Bole",
    maps:"https://www.google.com/maps/search/?api=1&query=Feresula+Coffee+Bole+Nile+Source+Building+Addis+Ababa",
    photo:"/829246752_18118777216951014_4628572299528508963_n.jpg",
    slot:"Bole branch interior"
  },
  {
    name:"Saris",
    subtitle:"10/18 Area — Nifas Silk-Lafto",
    vibe:"Architectural timber ceiling slats over a deep forest-green gallery wall, patterned tile floors and outdoor seating with Wi-Fi and power for laptop work.",
    tags:["Timber ceiling","Green gallery wall","Tile floors","Wi-Fi & power"],
    hours:"Daily, 8:00 AM – 6:00 PM",
    phoneLabel:"+251 96 641 1151",
    phoneHref:"tel:+251966411151",
    locationNote:"Near Gotera, Saris",
    maps:"https://www.google.com/maps/search/?api=1&query=Feresula+Coffee+Saris+Addis+Ababa",
    photo:"/627858162_18357337234162482_4955013576536798887_n.jpg",
    slot:"Saris branch interior"
  },
  {
    name:"Ministry of Mines",
    subtitle:"2RFG+R6H, Yeka — near the Ministry of Mines",
    vibe:"A cozy, office-adjacent neighbourhood sanctuary: strong coffee, neat wood furnishing and quiet corners built for focused work.",
    tags:["Neighbourhood","Quiet corners","Wood furnishing"],
    hours:"Daily, 7:30 AM – 8:00 PM",
    phoneLabel:null,
    phoneHref:null,
    locationNote:"2RFG+R6H, Yeka",
    maps:"https://www.google.com/maps/search/?api=1&query=Feresula+Coffee+Ministry+of+Mines+Addis+Ababa",
    photo:"/628977354_18378859654088569_4435816659056669393_n.jpg",
    slot:"Ministry of Mines branch interior"
  }
];

app.disable("x-powered-by");
app.use(express.json({limit:"10kb",strict:true}));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api/menu", (req, res) => {
  res.json({business, items:menuItems});
});

app.get("/api/locations", (req, res) => {
  res.json({items:branches});
});

app.get("/api/info", (req, res) => {
  res.json(business);
});

app.post("/api/inquiry", (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({error:"Please submit a valid inquiry."});
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const guestsRaw = body.guests === undefined || body.guests === "" ? "1" : String(body.guests);
  const guests = Number(guestsRaw);

  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({error:"Please enter a name between 2 and 80 characters."});
  }
  if (phone.length < 7 || phone.length > 24 || !/^[+\d][\d\s().-]*$/.test(phone)) {
    return res.status(400).json({error:"Please enter a valid phone number."});
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
    return res.status(400).json({error:"Guest count must be between 1 and 6."});
  }
  if (note.length > 500) {
    return res.status(400).json({error:"Your note must be 500 characters or fewer."});
  }
  if (date) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) {
      return res.status(400).json({error:"Please enter a valid visit date."});
    }
    const parsedDate = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    if (parsedDate.toISOString().slice(0, 10) !== date) {
      return res.status(400).json({error:"Please enter a valid visit date."});
    }
  }

  console.info("Inquiry received", JSON.stringify({date:date || null, guests, hasNote:Boolean(note)}));
  return res.status(201).json({message:"Inquiry received.", inquiry:{date:date || null, guests}});
});

app.use("/api", (req, res) => {
  res.status(404).json({error:"API route not found."});
});
app.use(express.static(DIST_DIR));
app.get("*", (req, res) => {
  const indexFile = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(indexFile)) {
    return res.status(503).send("Frontend build is missing. Run npm run build first.");
  }
  return res.sendFile(indexFile);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({error:"Please submit valid JSON."});
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({error:"Your inquiry is too large."});
  }
  console.error("Request error:", err.message);
  return res.status(500).json({error:"An unexpected server error occurred."});
});

app.listen(PORT, () => {
  console.log(`Feresula Coffee site listening on http://localhost:${PORT}`);
});
