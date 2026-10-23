import express from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import cors from 'cors';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const basePath = path.join(__dirname, "produits");

app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "API Lakehouse - accueil" });
});

// GET toutes les versions v1 v2 v3
app.get("/versions", (__req, res) => {
  res.json(fs.readdirSync(basePath));
});

// GET une version
app.get("/versions/:v", (req, res) => {
  const v = req.params.v;
  const results = [];
  const csvPath = path.join(basePath, v, "data.csv");
  const infoPath = path.join(basePath, v, "info.json");

  if (!fs.existsSync(csvPath)) {
    return res.status(404).json({ erreur: `${v} introuvable` });
  }

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
      res.json({ info, data: results, total: results.length });
    });
});

app.listen(8000, () => console.log("API Lakehouse sur 8000"));