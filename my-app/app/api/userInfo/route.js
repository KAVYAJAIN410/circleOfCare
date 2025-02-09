import { dbConnect } from "../../../lib/dbConnect";
import { getToken } from "next-auth/jwt";
import { getTokenDetails } from "../../../utils/getTokenDetails";
import Users from "../../../models/user.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();


    const token = await getToken({ req });
    
   
    const auth = token && typeof token.accessTokenFromBackend === "string"
      ? token.accessTokenFromBackend
      : req.headers.get("Authorization")?.split(" ")[1] ?? null;

    if (!auth) {
      return NextResponse.json(
        { message: "Authorization token missing" },
        { status: 401 }
      );
    }


    const userId = await getTokenDetails(auth);


    const user = await Users.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "success", user },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);


    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      { message: "error", error: errorMessage },
      { status: 500 }
    );
  }
}
