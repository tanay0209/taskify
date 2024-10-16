import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({
                message: "Email and password both are required"
            }, { status: 401 });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return Response.json({
                message: "Email is not registered"
            }, { status: 404 });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return Response.json({
                message: "Incorrect Password"
            }, { status: 403 });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '12h' });

        const response = Response.json({
            message: "Login Successful",
            user: { ...user.toObject(), password: undefined }
        });
        cookies().set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        })
        return response

    } catch (error) {
        console.log("Login error", error);

        return Response.json({
            message: "Something went wrong while logging in. Please try again!"
        }, { status: 500 });
    }
}