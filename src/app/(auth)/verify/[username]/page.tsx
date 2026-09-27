"use client";

import { verifyScehma } from "@/Schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const VerifyAcc = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm({
    resolver: zodResolver(verifyScehma),
  });

  const onSubmit = async (data: z.infer<typeof verifyScehma>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success("Successfully verified", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying user:", error);

      toast.error("Verification Failed", {
        description: "Unable to verify your account.",
      });
    }
  };

  const handleSkip = () => {
    router.replace("/sign-in");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight">
            Verify Your Account
          </h1>

          <p className="mb-4 text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code">
                    Verification Code
                  </FieldLabel>

                  <Input
                    {...field}
                    id="code"
                    type="text"
                    placeholder="Enter 6 digit code"
                    maxLength={6}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full">
              Verify Account
            </Button>

            {/* Skip Verification */}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default VerifyAcc;