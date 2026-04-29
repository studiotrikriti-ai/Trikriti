const Product = require("../models/Product");

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const { isCustom, inStock } = req.query;
    const filter = {};
    if (isCustom !== undefined) filter.isCustom = isCustom === "true";
    if (inStock !== undefined) filter.inStock = inStock === "true";

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
