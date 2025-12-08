const asynchandler = require("express-async-handler");
const Category = require("../model/categories");

const addCategory = asynchandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    

    // Find the single category document
    let categoryDoc = await Category.findOne();

    const found=categoryDoc.categories.find(res=>res.name.toLowerCase()===name.toLowerCase())
    if(found)return res.status(409).json({'message':`this category is already exist`})
    // If it doesn't exist, create it once
    if (!categoryDoc) {
      categoryDoc = new Category({ categories: [{ name }] });
    } else {
      // Otherwise, just push the new category into the array
      categoryDoc.categories.push({ name });
    }

    // Save changes
    await categoryDoc.save();

    res.status(201).json({ message: `New category added: ${name}`, data: categoryDoc });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = addCategory;
