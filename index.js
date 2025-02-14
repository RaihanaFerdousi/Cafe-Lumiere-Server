const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cafe-lumiere.fo9wx.mongodb.net/?retryWrites=true&w=majority&appName=cafe-lumiere`;

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB once at startup
async function connectToDB() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
connectToDB();

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Menu endpoint: fetch menu data from MongoDB
app.get("/menu", async (req, res) => {
  try {
    const menuCollection = client.db("Cafe-lumiere").collection("menu");
    const menuItems = await menuCollection.find().toArray();
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu data:", error);
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
