import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.SECRET,
        { expiresIn: "4h" }
    );
};

const User = mongoose.model("User", userSchema);

// 4. Simple validation function
// You pass the object you want to validate (like req.body) to this function and it returns the result of the validation.
function validateUser(input) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });

    // This checks the input against the schema
    return schema.validate(input);
}

export default User;
export { validateUser };
