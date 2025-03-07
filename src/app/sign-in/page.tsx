"use client";

import { ActionButton } from "@/components/action-button";
import { FormFieldWithError } from "@/components/form-field-with-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Month, Routes } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Call the server-side authentication API
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: values.password }),
      });

      const data = (await response.json()) as { error: string };

      if (response.ok) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1) as Month;

        // Redirect to the app
        router.push(Routes.monthlyExpensesSummary(year, month));
      } else {
        toast({
          title: "Authentication failed",
          description: data.error || "Incorrect password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-10 h-[130px]"></div>
      <Card className="w-full max-w-md mx-auto shadow-[0px_7px_22px_-2px_rgba(0,_0,_0,_0.1)]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldWithError
                label="Password"
                error={form.formState.errors.password}
              >
                <Input {...form.register("password")} type="password" />
              </FormFieldWithError>
              <ActionButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </ActionButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
