const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // 👈 allow null for Google users
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
});

// Hash password only if present
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password only for local users
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false; // 👈 Google users have no password
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
