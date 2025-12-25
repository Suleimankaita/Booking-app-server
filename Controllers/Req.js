const asynchandler = require('express-async-handler');
const User = require('../model/User');
const Name = require('../model/name');

const Registration = asynchandler(async (req, res) => {
    try {
        const { Birth, Username, firstname, lastname, password, email } = req.body;
        console.log(req.body)
        const img = req.file ? req.file.filename : "";
        if (!Username || !Birth || !firstname || !lastname || !password || !email)
            return res.status(400).json({ message: 'All fields are required' });

        const found = await User.findOne({ Username }).collation({strength:2,locale:'en'}).exec();

        if (found)
            return res.status(409).json({ message: 'This Username is already used by another user' });

        const nameDoc = await Name.create({
            firstname,
            lastname,
            email,
            img,
            Birth
        });

        await User.create({
            NameId: nameDoc._id,
            Username,
            password,
            email
        });

        res.status(201).json({
            message: `New user '${Username}' created successfully`,
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = Registration;
