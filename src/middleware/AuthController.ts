import type { Request, Response} from "express";
import User from "../models/User";
import { hashPasword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

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

            // NOTE: Create token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // NOTE: Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token,
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.send("Account created successfully, check your email for the confirmation link");
        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error("Invalid token");
                res.status(401).json({ error: error.message });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send("Account confirmed successfully");

        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}