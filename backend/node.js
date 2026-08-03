
// CiumKKy0qRKa71Hd
// KwrNAEbErBFs1FoF
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const Authrouters = require("./routers/Authrouters");
const connectDB=require("./models/db"); // mongoose connection
const PasswordModel = require("./models/password.js");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyparser.json());

connectDB().then(() => {
  app.listen(4000, () => console.log('Server running on port 4000'));
});

const port = 4000;

// Middleware to protect routes
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "Token required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
app.get('/',(req,res)=>{
    res.send("hello world")
})
const { encrypt, decrypt } = require("./utils/encryption");

app.use('/auth', Authrouters);

app.get('/passwords', authenticate, async (req, res) => {
    try {
        const passwords = await PasswordModel.find({ user: req.user._id });
        const decryptedPasswords = passwords.map((item) => {
            const doc = item.toObject();
            doc.password = decrypt(doc.password);
            return doc;
        });
        res.json(decryptedPasswords);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch passwords" });
    }
});

app.post('/passwords', authenticate, async (req, res) => {
    try {
        const { site, username, password } = req.body;
        const encryptedPassword = encrypt(password);
        const newPass = await PasswordModel.create({
            user: req.user._id,
            site,
            username,
            password: encryptedPassword
        });
        const responseData = newPass.toObject();
        responseData.password = password;
        res.json({ success: true, data: responseData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving password" });
    }
});

app.delete('/passwords/:id', authenticate, async (req, res) => {
    await PasswordModel.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
