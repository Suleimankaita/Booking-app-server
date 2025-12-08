const User = require('../model/User');
const asyncHandler = require('express-async-handler');

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const { Username, Fullname, email, password,Active } = req.body;
        const img = req.file;

        console.log(Username, img);

        const found = await User.findOne({ Username }).populate('NameId').exec();
        if (!found) return res.status(404).json({ message: "User not found" });

        // Update fields on populated NameId document
        if (email) found.NameId.email = email;
        if (Fullname) found.NameId.Fullname = Fullname;
        if (img) found.NameId.img = img.filename;
        if (Active) found.NameId.Active = Active;

        // Update password on main User doc
        if (password) {
            found.password = password; 
            // If you're using hashing:
            // found.password = await bcrypt.hash(password, 10);
        }

        // Save sub-document (NameId)
        await found.NameId.save();

        // Save main User model
        await found.save();

        console.log(found);
        res.status(200).json(found);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = updateProfile;
