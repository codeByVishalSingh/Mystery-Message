import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(req:NextRequest){
    await connectDB()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user ){
        return NextResponse.json({
            success:false,
            message:'User not Authenticate'
        },
    {
        status:401
    })
    }
    const userId = new mongoose.Types.ObjectId(user?._id)
  
    try {

        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$meassages'},
            {$sort:{'messages.createdAt': -1}},
            {$group:{_id: '$_id',messages:{$push:'$messages'}}}
        ])
            if(!user || user.length === 0){
                           return NextResponse.json({
            success:false,
            message:'User not found'
        },
    {
        status:401
    })
            }
            return NextResponse.json({
            success:true,
            message:user[0].messages
        },
    {
        status:200
    })
    } catch (error) {
          console.error('Failed to Update User status to accept Message',error)
             return NextResponse.json({
            success:false,
            message:'Internal Server Error'
        },
    {
        status:500
    })
    }
}