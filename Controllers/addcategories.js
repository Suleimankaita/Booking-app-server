const asynchandler = require("express-async-handler");
const Category = require("../model/categories");

const addCategory = asynchandler(async (req, res) => {
  try {
    const { name } = req.body;
    console.log("addCategory request body name:", name);
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    

    // Find the single category document (there should be only one document holding the array)
    let categoryDoc = await Category.findOne();

    // If we don't have a document yet, create an empty one so we can safely operate on the array
    if (!categoryDoc) {
      categoryDoc = new Category({ categories: [] });
    }

    // Check for duplicate (case-insensitive)
    const found = categoryDoc.categories.find(cat =>
      String(cat.name).toLowerCase() === String(name).toLowerCase()
    );
    if (found) return res.status(409).json({ message: `This category already exists` });

    // Push the new category into the array
    categoryDoc.categories.push({ name });

    // Save changes
    await categoryDoc.save();

    res.status(201).json({ message: `New category added: ${name}`, data: categoryDoc });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = addCategory;
