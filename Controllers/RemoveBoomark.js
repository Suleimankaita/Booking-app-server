const UserBook=require("../model/UserBooks")
const asynchandler=require('express-async-handler');

const RemoveBookmark=asynchandler(async(req,res)=>{

    try {
    const { BookName, id } = req.body;

    const updatedBook = await UserBook.findOneAndUpdate(
      { BookName },
      {
        $pull: {
          BookMarks: { _id: id }
        }
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Bookmark deleted successfully",
      updatedBook
    });

  } catch (error) {
    return res.status(500).json({ message: "Error deleting bookmark", error });
  }
})

module.exports=RemoveBookmark