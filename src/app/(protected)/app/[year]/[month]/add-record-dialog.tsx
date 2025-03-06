import { CategoryDto } from "@/app/api/(services)/category-service";
import {
  CreateOrUpdateRecordRequest,
  RecordDto,
} from "@/app/api/(services)/record-service";
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
import { usePreviousMonth } from "@/lib/hooks/use-previous-month";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the form schema based on the API schema but with string values for form inputs
const formSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddRecordDialogProps {
  recordId?: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddRecordDialog({
  recordId,
  trigger,
  onSuccess,
}: AddRecordDialogProps) {
  const params = useParams<{ month: string; year: string }>();
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIcon } = useCategoryIcon();
  const { prevMonth, prevYear } = usePreviousMonth(month, year);
  const isEditMode = !!recordId;

  const { data: categories } = useQuery<CategoryDto[]>({
    queryKey: QueryKeys.categories(),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.categories());
      return response.json() as Promise<CategoryDto[]>;
    },
  });

  // Fetch record data if in edit mode
  const { data: recordData, isLoading: isLoadingRecord } = useQuery<RecordDto>({
    queryKey: QueryKeys.record(recordId!),
    queryFn: async () => {
      const response = await fetch(ApiRoutes.recordById(recordId!));
      if (!response.ok) {
        throw new Error("Failed to fetch record");
      }
      return response.json() as Promise<RecordDto>;
    },
    enabled: isEditMode && isDialogOpen, // Only fetch when in edit mode and dialog is open
    refetchOnMount: true, // Refetch when the component mounts or remounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const getDefaultCategoryId = useCallback(() => {
    if (categories && categories.length > 0) {
      const foodCategory = categories.find(
        (category) => category.name === "Food"
      );
      return foodCategory ? foodCategory.id.toString() : "";
    }
    return "";
  }, [categories]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      value: "",
      comment: "",
    },
  });

  // Set default values or populate form with record data when available
  useEffect(() => {
    if (isEditMode && recordData) {
      form.reset({
        categoryId: recordData.categoryId.toString(),
        value: recordData.value.toString(),
        comment: recordData.comment || "",
      });
    } else if (!isEditMode && categories) {
      const defaultCategoryId = getDefaultCategoryId();
      if (defaultCategoryId) {
        form.setValue("categoryId", defaultCategoryId);
      }
    }
  }, [categories, form, isEditMode, recordData, getDefaultCategoryId]);

  const recordMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Use the records/[id] endpoint for updates, or a new records endpoint for creation
      const url = isEditMode
        ? ApiRoutes.recordById(recordId)
        : ApiRoutes.records();

      // Date handling based on create/edit mode
      let dateUtc;

      if (isEditMode && recordData) {
        // When editing, use the existing date without modification
        dateUtc = recordData.dateUtc;
      } else {
        // When creating, use current date and time for the selected month/year
        const now = new Date(); // Get current date and time
        const date = new Date(year, month - 1); // Set year and month (0-indexed)

        // Copy the current time to our date
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        date.setMilliseconds(now.getMilliseconds());

        dateUtc = date.toISOString();
      }

      // Create a request body that matches our Zod schema
      const requestBody: CreateOrUpdateRecordRequest = {
        ...(isEditMode && recordId ? { id: recordId } : {}),
        categoryId: parseInt(values.categoryId),
        value: parseFloat(values.value),
        comment: values.comment,
        dateUtc: dateUtc,
      };

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "add"} record`);
      }

      return response.json() as Promise<RecordDto>;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthSummary(year, month),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthSummary(prevYear, prevMonth),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.allTimeSummary(),
      });

      await queryClient.invalidateQueries({
        queryKey: QueryKeys.monthRecords(year, month),
      });

      if (isEditMode) {
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.record(recordId),
        });
      }

      setIsDialogOpen(false);

      form.reset({
        categoryId: getDefaultCategoryId(),
        value: "",
        comment: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    recordMutation.mutate(values);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        // Reset form when dialog is closed, but only if not in edit mode
        if (!open && !isEditMode) {
          form.reset({
            categoryId: getDefaultCategoryId(),
            value: "",
            comment: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
            aria-label={isEditMode ? "Edit record" : "Add new record"}
          >
            {isEditMode ? (
              <PencilIcon className="h-6 w-6" />
            ) : (
              <PlusIcon className="h-6 w-6" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? recordData
                ? `Edit Record (${format(
                    parseISO(recordData.dateUtc),
                    "MMM d, yyyy"
                  )})`
                : "Edit Record"
              : "Add New Record"}
          </DialogTitle>
        </DialogHeader>
        {isEditMode && isLoadingRecord ? (
          <div className="py-4 text-center">Loading record data...</div>
        ) : (
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
                          className="grid grid-cols-3 gap-2 mt-2 mx-auto"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {categories?.map((category) => {
                            const IconComponent = getCategoryIcon(
                              category.icon
                            );

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
                  disabled={recordMutation.isPending}
                  isLoading={recordMutation.isPending}
                >
                  {isEditMode ? "Update" : "Add"}
                </ActionButton>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
