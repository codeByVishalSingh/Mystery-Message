import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(req:NextRequest){
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
    const userId = user?._id
    const {acceptMessages} = await req.json()
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAccept:acceptMessages},
            {new:true}
        )
        if(!updateUser){
                       return NextResponse.json({
            success:false,
            message:'Failed to Update User status to accept Message'
        },
    {
        status:401
    })
}
          return NextResponse.json({
            success:true,
            message:'Message Acceptance status updated Successfully',
            updateUser
        },
    {
        status:200
    })
        
        
    } catch (error) {
          console.error('Failed to Update User status to accept Message',error)
             return NextResponse.json({
            success:false,
            message:'Failed to Update User status to accept Message'
        },
    {
        status:500
    })
    }
}
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
    const userId = user?._id
  
    try {
        
        const foundUser = await UserModel.findById(userId)
            
        if(!foundUser){
                       return NextResponse.json({
            success:false,
            message:'User not Found'
        },
    {
        status:401
    })
}
          return NextResponse.json({
            success:true,
            isAccept:foundUser.isAccept
        },
    {
        status:200
    })
    } catch (error) {
              console.error('Failed to Update User status to accept Message',error)
             return NextResponse.json({
            success:false,
            message:'Failed to Update User status to accept Message'
        },
    {
        status:500
    })
    }
        
        
 
}