import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";

import { Message } from "../../models/user.model"
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    await connectDB()
    const {username,content} = await req.json()

    try {
        const user = await UserModel.findOne({username})
         if(!user){
                      return NextResponse.json({
                        success:false,
                        message:'User not found'
                    },
                {
                    status:404
                })
         }
               if(!user.isAccept){
                      return NextResponse.json({
                        success:false,
                        message:'User is not accepting the messages'
                    },
                {
                    status:403
                })
         }
         const newMessage = {content,createdAt: new Date()}
         user.messages.push(newMessage as Message)
          await user.save()
                       return NextResponse.json({
                        success:true,
                        message:'Message sent Successfully '
                    },
                {
                    status:200
                })
        
    } catch (error) {
                     return NextResponse.json({
                        success:false,
                        message:'Error to send Messages'
                    },
                {
                    status:403
                })
    }
}