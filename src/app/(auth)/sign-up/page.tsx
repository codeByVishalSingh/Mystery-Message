
'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import {useDebounceValue,useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { signInScehma } from "@/Schemas/signInSchema"
import axios, { AxiosError } from "axios"
import { signUpSchema } from "@/Schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { log } from "console"
import MyForm from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"


const SignUnPage = ()=>{
    const [username,setUsername] = useState('');
    const [usernameMessage,setUsernameMessage] = useState('');
    const [isCheckingUsername,setIsCheckingUsername] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false)
    const debounced =useDebounceCallback(setUsername,500)
    const router = useRouter()
    
    const form = useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:'',
        }
    })
    useEffect(()=>{  
        const checkUsernameIsUnique = async ()=>{
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                   const response = await axios.get(`api/check-username-unique?username=${username}`)
                   const message = response.data.Message
                    setUsernameMessage(message)
                     

                } catch (error) {
                     console.log(error)

                } finally{
                    setIsCheckingUsername(false)
                }
            }
        }
            checkUsernameIsUnique()
    },[username])


    const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
     setSubmitting(true)
     try {
         const response = await axios.post<ApiResponse>('api/sign-up',data)
         

        toast.success("Success", {
  description: response.data.message,
});
         router .replace(`/verify/${username}`)
         setSubmitting(false)
     } catch (error) {
        console.error('Error in Signup od User',error);

toast.error("Sign Up Failed", {
  description: "Unable to create your account.",
})
        setSubmitting(false)
     }
    }
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>

          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>

            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>

                  <FieldLabel htmlFor="username">
                    Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="username"
                    placeholder="Enter username"
                    aria-invalid={fieldState.invalid}
                    onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                    }}
                  />

                  {!fieldState.invalid && (
                    <FieldDescription>
                      This is your public display name.
                    </FieldDescription>
                  )}

                  {isCheckingUsername && (
                    <p className="text-sm text-gray-500">
                      Checking username...
                    </p>
                  )}

                  {usernameMessage && (
                    <p className="text-sm text-gray-600">
                      {usernameMessage}
                    </p>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                </Field>
              )}
            />
            {isCheckingUsername && <Loader2
            className="animate-spin"/>}

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>

                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>

                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              
            >
              {form.formState.isSubmitting
                ? "Signing Up..."
                : "Sign Up"}
            </Button>

          </FieldGroup>
        </form>
<div className="text-center mt-4">
 <p>
    Already a Member?{' '}
    <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-900">
    Sign in
    </Link>
 </p>
</div>
      </div>
    </div>
  );
};
export default SignUnPage