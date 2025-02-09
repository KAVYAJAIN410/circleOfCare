// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '../../../lib/dbConnect';
import  Users  from '../../../models/user.model';
import Journal from '../../../models/journal.model'; // Ensure correct import

// Define Zod validation schema


// POST method for /api/register
export async function POST(req) {
  try {

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
   
    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const formData = await req.json();

   console.log(token)
    const { journal } = formData;

    await dbConnect();

    const existingUser = await Users.findOne({ email:token });
    if (!existingUser) {
       console.log(token)
      return NextResponse.json({ message: 'User not found' }, { status: 409 });
    }

    // Create and save new journal entry
    const jou = new Journal({
      description: journal,
      createdAt: new Date(),
      userId: existingUser._id, // Assuming journal is linked to a user
    });

    await jou.save();

    return NextResponse.json({success:true, message: 'Journal entry saved successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
