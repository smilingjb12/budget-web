import { ActionButton } from "@/components/action-button";
import { FormFieldWithError } from "@/components/form-field-with-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const formSchema = z.object({
  lotNo: z
    .string({
      required_error: "Lot number is required",
    })
    .transform((val) => parseInt(val, 10)),
  description: z.string({ required_error: "Description is required" }).min(1),
  initialPrice: z
    .string({ required_error: "Initial price is required" })
    .transform((val) => parseFloat(val)),
  billedOn: z.string().optional(),
});

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auctionId: string;
}

export function AddItemDialog({
  open,
  onOpenChange,
  auctionId,
}: AddItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useMutationErrorHandler();
  const createItem = useMutation(api.items.createItem);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lotNo: 0,
      description: "",
      initialPrice: 0,
      billedOn: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    createItem({
      auctionId: auctionId as Id<"auctions">,
      lotNo: values.lotNo,
      description: values.description,
      initialPrice: values.initialPrice,
      billedOn: values.billedOn,
    })
      .then(() => {
        form.reset();
        onOpenChange(false);
        toast({
          title: "Item created",
          variant: "default",
        });
      })
      .catch(handleError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add an item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={void form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="lotNo"
              render={({ field }) => (
                <FormFieldWithError
                  label="Lot number"
                  error={form.formState.errors.lotNo}
                >
                  <Input {...field} prefix="#" type="number" />
                </FormFieldWithError>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormFieldWithError
                  label="Description"
                  error={form.formState.errors.description}
                >
                  <Textarea {...field} />
                </FormFieldWithError>
              )}
            />
            <FormField
              control={form.control}
              name="initialPrice"
              render={({ field }) => (
                <FormFieldWithError
                  label="Pricing"
                  error={form.formState.errors.initialPrice}
                >
                  <Input {...field} type="number" prefix="€" />
                </FormFieldWithError>
              )}
            />
            <FormField
              control={form.control}
              name="billedOn"
              render={({ field }) => (
                <FormFieldWithError
                  label="On bill"
                  error={form.formState.errors.billedOn}
                >
                  <Input {...field} />
                </FormFieldWithError>
              )}
            />
            <ActionButton
              type="submit"
              className="w-25 float-right"
              isLoading={isLoading}
            >
              Create
            </ActionButton>
            <Button
              className="w-25 float-right mr-2"
              onClick={(e) => {
                e.preventDefault();
                onOpenChange(false);
                form.reset();
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
