import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/prismadb";
import bcrypt from "bcrypt";

const signupSchema = z.object({
    username: z.string().min(6,"Username must be at least 6 characters long"),
    password: z.string().min(6,"password must be at least6 characters long"),
})

export async function POST (req:NextRequest, res:NextResponse) {
    try {
        const { username, password } = await req.json();
        
        const parsed = signupSchema.safeParse({ username, password});
        if(!parsed.success) {
            return NextResponse.json({ message: "Invalid input" },{status: 400})
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        })
        if(existingUser) {
            return NextResponse.json({ message: "Username already exists"},{status: 400})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username:username,
                password: hashedPassword,
            }
        })

        return NextResponse.json({ message: "user created successfully",user},{status: 200})
    } catch (error) {
        return NextResponse.json({ message: "Internal server error",error },{status:500})
    }
}