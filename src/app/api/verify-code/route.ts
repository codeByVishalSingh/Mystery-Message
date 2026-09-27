import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifycode === code;

    const isCodeNotExpired =
      new Date(user.verifyExprireCode) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    }

    if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Your code has expired. Please request a new code.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Incorrect code. Please use the correct code.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("Error verifying user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}