"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      <div className="flex justify-center mb-10 h-[130px]"></div>
      <Card className="w-full max-w-md mx-auto shadow-[0px_7px_22px_-2px_rgba(0,_0,_0,_0.1)]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <SignInButton />
        </CardContent>
      </Card>
    </>
  );
}
