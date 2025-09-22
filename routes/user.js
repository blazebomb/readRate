import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { validateUser } from "../models/user.js";

const router = Router();

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
        return res.status(400).send({ message: "User already registered." });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    });

    await user.save();
    res.status(201).send({ message: "User created successfully", user });
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(400).send({ message: "Invalid email or password." });

    const token = user.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, secure:process.env.NODE_ENV === 'production' ,maxAge: 4 * 60 * 60 * 1000 }); 

    res.status(200).send({
        message: "Logged in successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});

// ======================= LOGOUT =======================
// for testing purpose only , no to be included in the assignment requirements
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.send({ message: "Logged out successfully" });
});

export default router;
