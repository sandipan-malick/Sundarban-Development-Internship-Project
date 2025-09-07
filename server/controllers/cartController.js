const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");

// -------------------------
// Add to Cart
// -------------------------
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0)
      return res.status(400).json({ error: "Invalid quantity" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.stock < qty)
      return res.status(400).json({ error: "Not enough stock" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();

    const populated = await cart.populate("items.productId", "name price image");

    res.json({
      items: populated.items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        productImage: item.productId.image,
      })),
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// -------------------------
// Get Cart
// -------------------------
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price image"
    );

    if (!cart) return res.json({ items: [] });

    res.json({
      items: cart.items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        productImage: item.productId.image,
      })),
    });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// -------------------------
// Remove single item
// -------------------------
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// -------------------------
// Clear all cart items
// -------------------------
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await Cart.deleteOne({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

// -------------------------
// Confirm Order
// -------------------------

exports.confirmOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentId, addressId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!addressId) return res.status(400).json({ error: "Address is required" });

    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price image"
    );

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "No items in cart" });

    // Map cart items to order items correctly
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image, // ✅ make sure field name matches schema
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      paymentId: paymentId || "AUTO_SUCCESS",
      address: {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
      },
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.json({ message: "✅ Order confirmed successfully!", order });
  } catch (err) {
    console.error("Confirm order error:", err);
    res.status(500).json({ error: "Failed to confirm order" });
  }
};

// -------------------------
// Get Product History
// -------------------------
exports.getProductHistory = async (req, res) => {
  try {
    const userId = req.user?.userId; 
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // lean for performance

    res.status(200).json(
      orders.map((order) => ({
        _id: order._id,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        address:order.address || null,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image, 
          subtotal: item.price * item.quantity, 
        })),
      }))
    );
  } catch (error) {
    console.error("Error fetching product history:", error); // ✅ fixed
    res.status(500).json({ message: "Failed to fetch product history" });
  }
};
// -------------------------
// Get all orders (Admin)
// -------------------------
exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email") // populate 'username', not 'name'
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(
      orders.map((order) => ({
        _id: order._id,
        user: order.userId
          ? { name: order.userId.username, email: order.userId.email }
          : null,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        paymentId: order.paymentId,
        address: order.address,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          subtotal: item.price * item.quantity,
        })),
      }))
    );
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
