const Address = require("../models/Address");

// Get all addresses for logged-in user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const addresses = await Address.find({ userId });
    res.json(addresses);
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const newAddress = new Address({ userId, ...req.body });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ error: "Failed to add address" });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    // Check if the address exists for this user
    const existingAddress = await Address.findOne({ _id: id, userId });
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found for this user" });
    }

    // Update address
    Object.assign(existingAddress, req.body);
    await existingAddress.save();

    res.json(existingAddress);
  } catch (err) {
    console.error("Update address error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid address ID" });
    }
    res.status(500).json({ error: "Failed to update address" });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });
    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found for this user" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete address error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid address ID" });
    }
    res.status(500).json({ error: "Failed to delete address" });
  }
};
