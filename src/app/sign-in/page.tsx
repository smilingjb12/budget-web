"use client";

import { ActionButton } from "@/components/action-button";
import { FormFieldWithError } from "@/components/form-field-with-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignIn } from "./hooks/use-sign-in";

type Flow = "signUp" | "signIn";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
  flow: z.enum(["signUp", "signIn"]),
});

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Flow>("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { getErrorTitle } = useSignIn();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      flow: step,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("flow", values.flow);

    signIn("password", formData)
      .then(() => {
        router.push(Routes.auctionsList(new Date().getFullYear()));
      })
      .catch((error) => {
        console.error(error);
        const errorTitle = getErrorTitle(error as { message: string });
        console.error(errorTitle);
        toast({
          title: "Invalid Email or Password",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="flex justify-center mb-10 h-[130px]">
        <Image
          src="/logo.png"
          alt="Veilinghuis Metropool"
          width={130}
          height={130}
          priority
          className="w-[140px]"
        />
      </div>
      <Card className="w-full max-w-md mx-auto shadow-[0px_7px_22px_-2px_rgba(0,_0,_0,_0.1)]">
        <CardHeader>
          <CardTitle>{step === "signIn" ? "Sign In" : "Sign Up"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldWithError
                label="Email"
                error={form.formState.errors.email}
              >
                <Input {...form.register("email")} type="email" />
              </FormFieldWithError>
              <FormFieldWithError
                label="Password"
                error={form.formState.errors.password}
              >
                <Input {...form.register("password")} type="password" />
              </FormFieldWithError>
              <input type="hidden" {...form.register("flow")} value={step} />
              <ActionButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                {step === "signIn" ? "Sign In" : "Sign Up"}
              </ActionButton>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => {
              setStep(step === "signIn" ? "signUp" : "signIn");
              form.setValue("flow", step === "signIn" ? "signUp" : "signIn");
            }}
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
