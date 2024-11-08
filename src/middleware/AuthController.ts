import type { Request, Response } from "express";
import { AuthEmail } from "../emails/AuthEmail";
import Token from "../models/Token";
import User from "../models/User";
import { checkPassword, hashPasword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import { generateToken } from "../utils/token";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            // NOTE: Check if user already exists
            const userExists = await User.findOne({ email });

            if (userExists) {
                const error = new Error("User already exists");
                res.status(404).json({ error: error.message });
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
                name: user.name,
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
                res.status(404).json({ error: error.message });
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

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error("User not found");
                res.status(404).json({ error: error.message });
                return;
            }

            if (!user.confirmed) {

                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });

                const error = new Error("Your account is not confirmed yet, we sent you an email with the confirmation link");
                res.status(401).json({ error: error.message });
                return;
            }
            
            // NOTE: Check password
            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                const error = new Error("Incorrect password");
                res.status(401).json({ error: error.message });
                return;
            }

            const token = generateJWT({id: user._id});
            
            res.send(token);

        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // NOTE: Check if user already exists
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error("The user does not exist");
                res.status(404).json({ error: error.message });
                return;
            }

            // NOTE: Check if user is confirmed already
            if (user.confirmed) {
                const error = new Error("The user is already confirmed");
                res.status(403).json({ error: error.message });
                return;
            }

            // NOTE: Create token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // NOTE: Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });

            await Promise.allSettled([user.save(), token.save()]);

            res.send("New confirmation code sent");
        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // NOTE: Check if user already exists
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error("The user does not exist");
                res.status(404).json({ error: error.message });
                return;
            }

            // NOTE: Create token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // NOTE: Send email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token,
            });

            res.send("Check your email, and follow the instructions to reset your password");
            
        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error("Invalid token");
                res.status(404).json({ error: error.message });
                return;
            }

            res.send("Valid token, define a new password");

        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error("Invalid token");
                res.status(404).json({ error: error.message });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.password = await hashPasword(password);

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            res.send("Password updated successfully");

        } catch (error) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
        return;
    }
}