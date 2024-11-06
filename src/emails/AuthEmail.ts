import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <noreply@uptask.com>',
            to: user.email,
            subject: "UpTask - Confirm your account",
            html: `<p>Welcome to UpTask <b>${user.name}</b>! We are glad to have you on board.</p>
                <p>Please click the  below link to confirm your account:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm your account</a>
                <p>And enter the following token in the confirmation field: <b>${user.token}</b></p>
                <p>This link will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        });
        
    }
}