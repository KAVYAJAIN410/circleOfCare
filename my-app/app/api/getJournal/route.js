import { dbConnect } from "../../../lib/dbConnect";
import { getToken } from "next-auth/jwt";
import { getTokenDetails } from "../../../utils/getTokenDetails";
import  Users  from "../../../models/user.model";
import  journal  from "../../../models/journal.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Get token from NextAuth
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
   
    const token = authHeader.split(' ')[1]; // Extract token
    if (!token) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    const existingUser = await Users.findOne({ email:token });
    if (!existingUser) {
       console.log(token)
      return NextResponse.json({ message: 'User not found' }, { status: 409 });
    }

    // Fetch user from database
   

    // Fetch journal entries
    const Id=existingUser.userId;
    const userJournal = await journal.find({Id}); // Fixed findOne()
    if (!userJournal) {
      return NextResponse.json({ message: "Journal not found" }, { status: 404 });
    }
   console.log(userJournal);
    return NextResponse.json(
      { message: "success", journal: userJournal }, // Fixed response structure
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "error", error: err.message },
      { status: 500 }
    );
  }
}
