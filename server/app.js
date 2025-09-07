const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const placeRoutes = require("./routes/placeRoute");
const userRoutes = require("./routes/userRoute");
const authMiddleware = require("./middleware/authMiddleware");
const bookingRoutes = require("./routes/bookingRoute");
const paymentRoutes = require("./routes/paymentRoute");
const addressRoutes = require("./routes/addressRoute");
const locationRoutes = require("./routes/locationRoute");
const adminRoutes = require("./routes/adminRoute");
const educationRoutes = require("./routes/educationRoute");
const newsRoutes = require("./routes/newsRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const adminAuth = require("./middleware/adminAuth");
dotenv.config();
connectDB();

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // VERY IMPORTANT for cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/places", placeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/cart", paymentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/education/news", newsRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
// Protected landing route
app.get("/", authMiddleware, (req, res) => {
  res.send("Welcome to landing page");
});
app.get("/all-product", authMiddleware, (req, res) => {
  res.send("Welcome to all product");
});
app.get("/product-cart", authMiddleware, (req, res) => {
  res.send("Welcome to product cart");
});
app.get("/product-history", authMiddleware, (req, res) => {
  res.send("Welcome to product history");
});
app.get("/education", authMiddleware, (req, res) => {
  res.send("Welcome to product education");
});
app.get("/all-data", authMiddleware, (req, res) => {
  res.send("Welcome to product all data");
});
app.get("/history", authMiddleware, (req, res) => {
  res.send("Welcome to product history");
});
app.get("/ecoTourism", authMiddleware, (req, res) => {
  res.send("Welcome to eco tourism");
});
app.get("/cart", authMiddleware, (req, res) => {
  res.send("Welcome to cart");
});
app.get("/admin-dashboard", adminAuth, (req, res) => {
  res.send("Welcome to admin dashboard");
});
app.get("/admin-booking", adminAuth, (req, res) => {
  res.send("Welcome to admin booking");
});
app.get("/dashboard-admin", adminAuth, (req, res) => {
  res.send("Welcome to dashboard admin");
});
app.get("/admin-education", adminAuth, (req, res) => {
  res.send("Welcome to admin education");
});
app.get("/admin-order", adminAuth, (req, res) => {
  res.send("Welcome to admin order");
});
app.get("/admin-product-dashboard", adminAuth, (req, res) => {
  res.send("Welcome to admin order");
});
const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
