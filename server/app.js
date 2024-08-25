import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoConfig.js";
import sequelize from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
sequelize.sync();

// Serve the uploads directory statically
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Server is On");
});

app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
