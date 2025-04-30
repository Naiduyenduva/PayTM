import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";


export async function POST(req: NextRequest, res:NextResponse) {
    try {
        const {userId, contactNumber, ContactName } = await req.json();

        const userContacts = await prisma.contacts.create({
            data: {
                contactNumber,
                ContactName,
                userId
            }
        })
        console.log(userContacts)
        return NextResponse.json({ message: "Contact added successfully", status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error adding contacts", status: 500})
    }
}