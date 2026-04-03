import { Router } from "express";
import { products } from "../data/products.js";

const router = Router();

router.get("/products", (_, res) => {
  res.json(products);
});

router.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

export default router;
