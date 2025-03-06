import { CategoryDto } from "@/app/api/(services)/category-service";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema
const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddRecordDialog() {
  const params = useParams<{ month: string }>();
  const month = Number(params.month) as Month;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIcon } = useCategoryIcon();

  const { data: categories } = useQuery<CategoryDto[]>({
    queryKey: QueryKeys.categories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.categories());
      return response.json();
    },
  });

  const getDefaultCategoryId = () => {
    if (categories && categories.length > 0) {
      const foodCategory = categories.find(
        (category) => category.name === "Food"
      );
      return foodCategory ? foodCategory.id.toString() : "";
    }
    return "";
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      value: "",
      comment: "",
    },
  });

  // Set Food category as default when categories are loaded
  useEffect(() => {
    const defaultCategoryId = getDefaultCategoryId();
    if (defaultCategoryId) {
      form.setValue("categoryId", defaultCategoryId);
    }
  }, [categories, form]);

  const addRecordMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch(ApiRoutes.recordsByMonth(month), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: parseInt(values.categoryId),
          value: parseFloat(values.value),
          comment: values.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add record");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: QueryKeys.monthSummary(month),
      });
      // Invalidate the all-time summary query
      queryClient.invalidateQueries({
        queryKey: QueryKeys.allTimeSummary(),
      });
      // Close the dialog
      setIsDialogOpen(false);
      // Reset the form
      form.reset({
        categoryId: getDefaultCategoryId(),
        value: "",
        comment: "",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    addRecordMutation.mutate(values);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        // Reset form when dialog is closed
        if (!open) {
          form.reset({
            categoryId: getDefaultCategoryId(),
            value: "",
            comment: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="Add new record"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                const selectedCategory = categories?.find(
                  (cat) => cat.id.toString() === field.value
                );

                return (
                  <FormItem>
                    <FormLabel>
                      Category{" "}
                      {selectedCategory ? `(${selectedCategory.name})` : ""}
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        className="grid grid-cols-3 gap-2 mt-2"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {categories?.map((category) => {
                          const IconComponent = getCategoryIcon(category.icon);

                          return (
                            <ToggleGroupItem
                              key={category.id}
                              value={category.id.toString()}
                              className="flex items-center justify-center aspect-square h-20 w-20 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              title={category.name}
                            >
                              <IconComponent className="h-8 w-8" />
                            </ToggleGroupItem>
                          );
                        })}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end">
              <ActionButton
                variant="default"
                className="w-full"
                type="submit"
                disabled={addRecordMutation.isPending}
                isLoading={addRecordMutation.isPending}
              >
                Add
              </ActionButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
