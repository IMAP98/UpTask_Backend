import type { Request, Response} from "express";
import User from "../models/User";
import { hashPasword } from "../utils/auth";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            // NOTE: Check if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error("User already exists");
                res.status(409).json({ error: error.message });
                return;
            }

            // NOTE: Create new user
            const user = new User(req.body);

            // NOTE: Hashing password
            user.password = await hashPasword(password);
            await user.save();
            res.send("Account created successfully");
        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}