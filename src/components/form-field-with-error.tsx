import { cn } from "@/lib/utils";
import React from "react";
import { FormControl, FormItem, FormLabel } from "./ui/form";

interface FormFieldWithErrorProps {
  label: string;
  error?: { message?: string };
  children: React.ReactElement<{ className?: string }>;
}

const getErrorClassName = (error?: { message?: string }) =>
  error?.message &&
  "border-destructive ring-destructive focus-visible:ring-destructive";

export function FormFieldWithError({
  label,
  error,
  children,
}: FormFieldWithErrorProps) {
  const childWithError = React.cloneElement(children, {
    className: cn(children.props.className, getErrorClassName(error)),
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{childWithError}</FormControl>
      {error?.message && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </FormItem>
  );
}
