import z, { email } from "zod"


export const usernameValidation = z.string().min(4,"username must be atleat 4 characters")
.max(15,"username must no more then  15 characters")


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'invaild email address'}),
    password:z.string().min(6,{message:'password must be at least 6 characters'})
})