import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/dbConnect';
import  Users  from '@/models/user.model';

// Define Zod validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.preprocess((val) => Number(val), z.number().positive('Age must be a positive number')),
  number: z.string().regex(/^\d{10}$/, 'Invalid phone number format'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender selection is required',
  }),
});

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const formData = await req.json();

    // Parse and validate data
    const parsedData = registerSchema.parse(formData);
    const { name, gender, number, age } = parsedData;

    await dbConnect();

    // Debugging check
    console.log("Checking Users model:", Users);

    if (!Users) {
      return NextResponse.json({ message: 'Database model is undefined' }, { status: 500 });
    }

    // Check if the user exists
    const existingUser = await Users.findOne({ email: token });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 409 });
    }

    if (existingUser.hasFilledDetails) {
      return NextResponse.json({ message: 'Form already filled' }, { status: 410 });
    }

    // Update user details
    existingUser.name = name;
    existingUser.age = Number(age); // Convert to number
    existingUser.mobNo = number;
    existingUser.gender = gender;
    existingUser.hasFilledDetails = true;

    await existingUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }
    console.error("Server Error:", error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
