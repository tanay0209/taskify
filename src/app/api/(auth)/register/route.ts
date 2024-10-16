import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            return Response.json({
                message: "Email already registered"
            }, { status: 400 })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword
            });
            await newUser.save();
            return Response.json(
                {
                    success: true,
                    message: 'User registered successfully.',
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('Error registering user ', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            {
                status: 500,
            }
        );
    }
}
