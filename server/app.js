import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoConfig.js";
import sequelize from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import algorithimRoutes from "./routes/algorithmRoutes.js" 
import simulationRoutes from "./routes/simulationRoutes.js";
import setupAssociations from './models/associations.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
setupAssociations();

// Sync database
sequelize.sync();


app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Server is On");
});

app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/algorithm/',algorithimRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
