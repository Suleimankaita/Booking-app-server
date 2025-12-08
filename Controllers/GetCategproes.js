const asyncHandler = require("express-async-handler");
const Category = require("../model/categories");

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().lean().exec();

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    const result = categories.map((cat) => cat.categories.map((c) => c)).flat();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = getAllCategories;
