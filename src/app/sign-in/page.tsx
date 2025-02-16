"use client";

import { ActionButton } from "@/components/action-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useSignIn } from "./hooks/use-sign-in";

export default function SSOCallback() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { getErrorTitle } = useSignIn();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setIsLoading(true);
    signIn("password", formData)
      .then(() => {
        router.push(Routes.auctionsList(new Date().getFullYear()));
      })
      .catch((error) => {
        console.error(error);
        const errorTitle = getErrorTitle(error);
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <input name="flow" type="hidden" value={step} />
            <ActionButton
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {step === "signIn" ? "Sign In" : "Sign Up"}
            </ActionButton>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
