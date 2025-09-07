const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

// Load .env variables
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashed1 = await bcrypt.hash(process.env.ADMIN_PASS_1, 10);
    const hashed2 = await bcrypt.hash(process.env.ADMIN_PASS_2, 10);

    // Clear old admins
    await Admin.deleteMany();

    // Insert from .env
    await Admin.insertMany([
      { email: process.env.ADMIN_EMAIL_1, password: hashed1 },
      { email: process.env.ADMIN_EMAIL_2, password: hashed2 },
    ]);

    console.log("✅ Admins seeded:");
    console.log(`- ${process.env.ADMIN_EMAIL_1}`);
    console.log(`- ${process.env.ADMIN_EMAIL_2}`);
    process.exit();
  })
  .catch(err => console.error("❌ DB Connection Error:", err));
