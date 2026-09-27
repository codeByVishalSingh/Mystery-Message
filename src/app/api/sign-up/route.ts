import connectDB from "@/lib/connectDB";
import UserModel from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export const POST = async(req:NextRequest)=>{
    await connectDB()

    try {
    const {username,email,password} = await req.json()    
    const existVerifyUser =await UserModel.findOne({
        username,
        isVerified:true
    })
    if(existVerifyUser){
        
             return NextResponse.json({
            success:false,
            message:"Username already Exist please try Diffrent Username"
            
        },{status:400})
         
        
    }
    const existUserByEmail =await UserModel.findOne({
        email,
        isVerified:true
    })
    const verifyCode = Math.floor(100000+Math.random() *900000).toString()
        if(existUserByEmail){
                 if(existUserByEmail.isVerified){
             return NextResponse.json({
            success:false,
            message:"User already Exist please try Diffrent Email"
            
        },{status:400})
         }
         else{
            const hasedPassword = await bcrypt.hash(password,10)
            existUserByEmail.password = hasedPassword;
            existUserByEmail.verifycode = verifyCode;
            existUserByEmail.verifyExprireCode= new Date(Date.now()+3600000)
            await existUserByEmail.save()
            
         }
    
    }else{

      const hasedPassword = await bcrypt.hash(password,10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours()+1)
          const newUser =  new UserModel({
                username,
                email,
                password:hasedPassword,
                verifycode:verifyCode,
                verifyExprireCode:expiryDate,
                isVerified:false,
                isAccept: true,
                messages:[]
  
      })
        await newUser.save()
    }
    // --------------------------Send VerifyCode---------------------------------------------------------

    const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
    )
    if(!emailResponse.success){
             return NextResponse.json({
            success:false,
            message: emailResponse.message,
            
        },{status:500})
      
    }
         return NextResponse.json({
            success:true,
            message:"User Register Successfully please Verify the code",
            
        },{status:201})
    } catch (error) {
        console.error('Error to Register User',error)
        return NextResponse.json({
            success:false,
            message:'Error to Register User'
        })

    }
}