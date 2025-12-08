const asynchandler = require("express-async-handler");
const Category = require("../model/categories");

const deleteCategory = asynchandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Category ID not provided" });
    }

    // Find the main document
    const doc = await Category.findOne({});
    if (!doc) {
      return res.status(404).json({ message: "No category document found" });
    }

    // Find the index of the category inside the categories array
    const index = doc.categories.findIndex(cat => cat._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove that category
    doc.categories.splice(index, 1);

    // Save the document to apply the deletion
    await doc.save();

    res.status(200).json({ message: "Category deleted successfully", data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = deleteCategory;
