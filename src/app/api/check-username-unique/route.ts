import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/connectDB";
import z, { success } from "zod";
import {usernameValidation } from "@/Schemas/signUpSchema"
import { NextRequest, NextResponse } from "next/server";


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(req:NextRequest){

    await connectDB()
    try {
        const {searchParams} = new URL(req.url)
        const queryParams ={
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [] 
            return NextResponse.json({
            success:false,
            message:'Inavild Query Parameters'
           },
        {
            status:400
        }) 
        }
        const {username} = result.data

        const exsitVerifyUser =await UserModel.findOne({
            username,isVerified:true
        })
        if(exsitVerifyUser){
                  return NextResponse.json({
            success:false,
            message:'Username is Already Exist Please try diffrent Username'
           },
        {
            status:400
        }) 
        }
             return NextResponse.json({
            success:true,
            message:'Username is Unique'
           },
        {
            status:400
        }) 
    } catch (error) {
           console.error('Error to checking Username',Error)
           return NextResponse.json({
            success:false,
            message:'Error to checking Username'
           },
        {
            status:500
        })       
    }
}