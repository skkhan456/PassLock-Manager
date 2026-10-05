
// CiumKKy0qRKa71Hd
// KwrNAEbErBFs1FoF
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const Authrouters = require("./routers/Authrouters");
const connectDB = require("./models/db"); // mongoose connection
const PasswordModel = require("./models/password.js");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("./utils/encryption");

const app = express();
app.use(cors());
app.use(bodyparser.json());

const PORT = process.env.PORT || 4000;

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

app.get('/', (req, res) => {
    res.send("PassLock API is running");
});

app.use('/auth', Authrouters);

// Get all stored passwords for the authenticated user (decrypts passwords before returning)
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

// Save a new password for the authenticated user (encrypts password before storing in MongoDB)
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

// Delete a stored password by ID for the authenticated user
app.delete('/passwords/:id', authenticate, async (req, res) => {
    try {
        await PasswordModel.deleteOne({ _id: req.params.id, user: req.user._id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting password" });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

