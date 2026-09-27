
'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

import { useEffect, useState } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { signInScehma } from "@/Schemas/signInSchema"

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
import { signIn } from "next-auth/react"


const SignInPage = ()=>{

    const [isSubmitting, setSubmitting] = useState(false)
  
    const router = useRouter()
    
    const form = useForm({
        resolver:zodResolver(signInScehma),
        defaultValues:{
            identifier:'',
            password:'',
        }
    })
 


    const onSubmit = async (data: z.infer<typeof signInScehma>)=>{
     const result = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
       if(result?.error){
        toast.error('Login Failed',{
            description:'Incorrect username or password'
        })
       }
       if(result?.url){
        router.replace('/dashboard')
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
            Sign In to start your anonymous adventure
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>

          

            {/* Email */}
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>

                  <FieldLabel htmlFor="email">
                    Email/Usernname
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter Email/Usernname"
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
                ? "Signing In..."
                : "Sign In"}
            </Button>

          </FieldGroup>
        </form>
<div className="text-center mt-4">
 <p>
   You Dont'have an Account{' '}
    <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-900">
    Sign Up
    </Link>
 </p>
</div>
      </div>
    </div>
  );
};
export default SignInPage