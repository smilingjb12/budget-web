import {
  CreateOrUpdateRecordRequest,
  RecordDto,
} from "@/app/api/(services)/record-service";
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { ComboboxInput } from "@/components/ui/combobox-input";
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
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { usePreviousMonth } from "@/lib/hooks/use-previous-month";
import {
  useCategoriesQuery,
  useExchangeRateQuery,
  useRecordCommentsQuery,
  useRecordQuery,
} from "@/lib/queries";
import { QueryKeys } from "@/lib/query-keys";
import { ApiRoutes, Month } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  isIncome?: boolean;
}

export function AddRecordDialog({
  recordId,
  trigger,
  onSuccess,
  isIncome = false,
}: AddRecordDialogProps) {
  const params = useParams<{ month: string; year: string }>();
  const month = Number(params.month) as Month;
  const year = Number(params.year);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { getCategoryIcon } = useCategoryIcon();
  const { prevMonth, prevYear } = usePreviousMonth(month, year);
  const isEditMode = !!recordId;

  // State for PLN and USD values
  const [plnValue, setPlnValue] = useState<string>("");
  const [usdValue, setUsdValue] = useState<string>("");
  const [, setIsUpdatingPln] = useState(false);
  const [, setIsUpdatingUsd] = useState(false);

  // Fetch exchange rate
  const {
    data: exchangeRate,
    isLoading: isLoadingExchangeRate,
    isError: isExchangeRateError,
  } = useExchangeRateQuery();

  const { data: allCategories } = useCategoriesQuery();
  const categories = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.filter((category) => category.isExpense !== isIncome);
  }, [allCategories, isIncome]);

  // Fetch record data if in edit mode
  const { data: recordData, isLoading: isLoadingRecord } = useRecordQuery(
    recordId,
    isEditMode && isDialogOpen
  );

  const getDefaultCategoryId = useCallback(() => {
    if (categories && categories.length > 0) {
      return categories[0].id.toString();
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

  // Convert PLN to USD
  const convertPlnToUsd = useCallback(
    (pln: string) => {
      if (!pln || !exchangeRate) return "";
      const plnAmount = parseFloat(pln);
      if (isNaN(plnAmount)) return "";
      return (plnAmount / exchangeRate).toFixed(2);
    },
    [exchangeRate]
  );

  // Convert USD to PLN
  const convertUsdToPln = useCallback(
    (usd: string) => {
      if (!usd || !exchangeRate) return "";
      const usdAmount = parseFloat(usd);
      if (isNaN(usdAmount)) return "";
      return (usdAmount * exchangeRate).toFixed(2);
    },
    [exchangeRate]
  );

  // Handle PLN input change
  const handlePlnChange = (value: string) => {
    setIsUpdatingPln(true);
    setPlnValue(value);
    form.setValue("value", value);

    // Convert to USD
    const newUsdValue = convertPlnToUsd(value);
    setUsdValue(newUsdValue);
    setIsUpdatingPln(false);
  };

  // Handle USD input change
  const handleUsdChange = (value: string) => {
    setIsUpdatingUsd(true);
    setUsdValue(value);

    // Convert to PLN and update form
    const newPlnValue = convertUsdToPln(value);
    setPlnValue(newPlnValue);
    form.setValue("value", newPlnValue);
    setIsUpdatingUsd(false);
  };

  // Set default values or populate form with record data when available
  useEffect(() => {
    if (isEditMode && recordData && exchangeRate) {
      // For edit mode, we get USD value from backend
      const usd = recordData.value.toString();
      setUsdValue(usd);

      // Convert USD to PLN
      const pln = convertUsdToPln(usd);
      setPlnValue(pln);

      form.reset({
        categoryId: recordData.categoryId.toString(),
        value: pln, // Store PLN value in the form
        comment: recordData.comment || "",
      });
    } else if (!isEditMode && categories) {
      const defaultCategoryId = getDefaultCategoryId();
      if (defaultCategoryId) {
        form.setValue("categoryId", defaultCategoryId);
      }
    }
  }, [
    categories,
    form,
    isEditMode,
    recordData,
    getDefaultCategoryId,
    exchangeRate,
    convertUsdToPln,
  ]);

  // Add state for comment input
  const [commentInput, setCommentInput] = useState("");

  // Debounce the comment input with a 200ms delay
  const debouncedCommentInput = useDebounce(commentInput, 200);

  // Fetch comment suggestions based on the debounced input
  const { data: commentSuggestions = [] } = useRecordCommentsQuery(
    debouncedCommentInput
  );

  // Update commentInput when form value changes
  const handleCommentInputChange = useCallback((value: string) => {
    setCommentInput(value);
  }, []);

  // Initialize commentInput with form value when in edit mode
  useEffect(() => {
    if (recordData && recordData.comment) {
      setCommentInput(recordData.comment);
    }
  }, [recordData]);

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

        // Set the current day
        date.setDate(now.getDate());

        // Copy the current time to our date
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
        date.setSeconds(now.getSeconds());
        date.setMilliseconds(now.getMilliseconds());

        dateUtc = date.toISOString();
      }

      // Use USD value directly
      const usdAmount = parseFloat(usdValue);
      if (isNaN(usdAmount)) {
        throw new Error("USD value is invalid");
      }

      // Create a request body that matches our Zod schema
      const requestBody: CreateOrUpdateRecordRequest = {
        ...(isEditMode && recordId ? { id: recordId } : {}),
        categoryId: parseInt(values.categoryId),
        value: usdAmount, // Send USD value
        comment: values.comment,
        dateUtc: dateUtc,
        isExpense: !isIncome,
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

      // Reset PLN and USD values
      setPlnValue("");
      setUsdValue("");

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
          setPlnValue("");
          setUsdValue("");
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
              : isIncome
              ? "Add Income"
              : "Add Expense"}
          </DialogTitle>
        </DialogHeader>
        {isEditMode && isLoadingRecord ? (
          <div className="py-4 text-center">Loading record data...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="PLN"
                      value={plnValue}
                      onChange={(e) => handlePlnChange(e.target.value)}
                      className="pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
                      zł
                    </span>
                  </div>
                </FormItem>
                <FormItem>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="USD"
                      value={usdValue}
                      onChange={(e) => handleUsdChange(e.target.value)}
                      className="pr-10"
                      disabled={isLoadingExchangeRate || isExchangeRateError}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-lg font-medium">
                      $
                    </span>
                  </div>
                </FormItem>
              </div>
              {isExchangeRateError && (
                <div className="text-sm text-destructive">
                  Exchange rate unavailable. Cannot save record.
                </div>
              )}

              {/* Hidden form field to store the value */}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboboxInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onInputChange={handleCommentInputChange}
                        suggestions={commentSuggestions}
                        placeholder="Note"
                      />
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
                        <div className="grid grid-cols-3 gap-1 mt-2 mx-auto w-fit">
                          {categories?.map((category) => {
                            const IconComponent = getCategoryIcon(
                              category.icon
                            );
                            const isSelected =
                              category.id.toString() === field.value;

                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                  field.onChange(category.id.toString())
                                }
                                className={`flex items-center justify-center aspect-square h-20 w-20 border border-input rounded-md transition-colors ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                                }`}
                                title={category.name}
                                disabled={isSelected} // Disable button if already selected to prevent untoggling
                              >
                                <IconComponent className="h-8 w-8" />
                              </button>
                            );
                          })}
                        </div>
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
                  disabled={
                    recordMutation.isPending ||
                    isExchangeRateError ||
                    isLoadingExchangeRate ||
                    !exchangeRate
                  }
                  isLoading={recordMutation.isPending}
                >
                  {isEditMode
                    ? `Update${usdValue ? ` ($${usdValue})` : ""}`
                    : `Add${usdValue ? ` ($${usdValue})` : ""}`}
                </ActionButton>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
