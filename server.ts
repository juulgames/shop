import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    products: [],
    filaments: [],
    settings: null,
    orders: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// API Routes
app.get("/api/store", (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: "Failed to read store data" });
  }
});

app.post("/api/store", (req, res) => {
  try {
    const { products, filaments, settings, orders } = req.body;
    const current = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    
    const updated = {
      products: products !== undefined ? products : current.products,
      filaments: filaments !== undefined ? filaments : current.filaments,
      settings: settings !== undefined ? settings : current.settings,
      orders: orders !== undefined ? orders : current.orders
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to save store data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
