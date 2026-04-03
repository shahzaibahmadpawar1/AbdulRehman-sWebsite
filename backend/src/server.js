import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", productRoutes);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
