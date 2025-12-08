const path = require("path");
const ebookConverter = require("node-ebook-converter");

convertPdfToEpub = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const inputPdf = req.file.path;
    const outputEpub = path.join("output", `${Date.now()}.epub`);

    console.log("Converting PDF:", inputPdf);

    // Convert PDF → EPUB
    await ebookConverter.convert({
      input: inputPdf,
      output: outputEpub,
      delete: false, // keep original PDF
    });

    console.log("EPUB created:", outputEpub);

    return res.status(200).json({
      message: "Conversion successful",
      epubPath: outputEpub,
    });

  } catch (error) {
    console.error("Conversion Failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports=convertPdfToEpub