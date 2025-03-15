"use client";

import { RegularPaymentDto } from "@/app/api/regular-payments/route";
import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useRegularPaymentsQuery,
  useUpdateRegularPaymentsMutation,
} from "@/lib/queries";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function RegularPaymentsList() {
  const { data: regularPayments, isLoading, error } = useRegularPaymentsQuery();
  const updateMutation = useUpdateRegularPaymentsMutation();

  const [payments, setPayments] = useState<RegularPaymentDto[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalPayments, setOriginalPayments] = useState<RegularPaymentDto[]>(
    []
  );

  useEffect(() => {
    if (regularPayments) {
      // Sort payments by amount in descending order
      const sortedPayments = [...regularPayments].sort(
        (a, b) => b.amount - a.amount
      );
      setPayments(sortedPayments);
      setOriginalPayments(sortedPayments.map((payment) => ({ ...payment })));
      calculateTotal(sortedPayments);
    }
  }, [regularPayments]);

  const calculateTotal = (items: RegularPaymentDto[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  };

  const getTextColor = (value: number, data: RegularPaymentDto[]) => {
    if (!data || data.length === 0) return "hsl(var(--primary))";

    const values = data.map((item) => item.amount);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Normalize the value to a 0-1 scale
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;

    // Define color stops for the gradient
    const colorStops = [
      { point: 0, color: { h: 142, s: 76, l: 36 } }, // Green (low)
      { point: 0.5, color: { h: 35, s: 92, l: 58 } }, // Yellow/Orange (middle)
      { point: 1, color: { h: 0, s: 84, l: 60 } }, // Red (high)
    ];

    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (
        normalizedValue >= colorStops[i].point &&
        normalizedValue <= colorStops[i + 1].point
      ) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // Calculate how far between the two stops the value is (0 to 1)
    const stopRange = upperStop.point - lowerStop.point;
    const stopFraction =
      stopRange === 0 ? 0 : (normalizedValue - lowerStop.point) / stopRange;

    // Interpolate between the two colors
    const h = Math.round(
      lowerStop.color.h + stopFraction * (upperStop.color.h - lowerStop.color.h)
    );
    const s = Math.round(
      lowerStop.color.s + stopFraction * (upperStop.color.s - lowerStop.color.s)
    );
    const l = Math.round(
      lowerStop.color.l + stopFraction * (upperStop.color.l - lowerStop.color.l)
    );

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const handleAddPayment = () => {
    const newPayment: RegularPaymentDto = {
      name: "",
      amount: 0,
      date: new Date().toISOString(),
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    calculateTotal(updatedPayments);
  };

  const handleRemovePayment = (index: number) => {
    const updatedPayments = [...payments];
    updatedPayments.splice(index, 1);
    setPayments(updatedPayments);
    calculateTotal(updatedPayments);
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedPayments = [...payments];
    updatedPayments[index].name = value;
    setPayments(updatedPayments);
  };

  const handleAmountChange = (index: number, value: string) => {
    const updatedPayments = [...payments];
    updatedPayments[index].amount = parseFloat(value) || 0;
    setPayments(updatedPayments);
    calculateTotal(updatedPayments);
  };

  const handleSave = () => {
    updateMutation.mutate(payments, {
      onSuccess: () => {
        setIsEditMode(false);
        setOriginalPayments(payments.map((payment) => ({ ...payment })));
      },
    });
  };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setPayments(originalPayments.map((payment) => ({ ...payment })));
    calculateTotal(originalPayments);
    setIsEditMode(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error loading regular payments</div>;
  }

  return (
    <>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={index} className="flex items-start space-x-2">
              {isEditMode ? (
                <>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Name"
                      value={payment.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={payment.amount}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        className="pl-7 w-full"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePayment(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className="flex-1 font-medium pl-3"
                    style={{
                      borderLeft: `4px solid ${getTextColor(
                        payment.amount,
                        payments
                      )}`,
                    }}
                  >
                    {payment.name}
                  </div>
                  <div className="w-32 text-right font-medium">
                    ${payment.amount.toFixed(2)}
                  </div>
                </>
              )}
            </div>
          ))}

          {isEditMode && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddPayment}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Payment
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {isEditMode ? (
          <>
            <div></div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : <>Save Changes</>}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div></div>
            <div className="flex flex-row justify-between items-center w-full">
              <Button variant="outline" onClick={handleEnterEditMode}>
                <Edit className="h-4 w-4 mr-2" /> Edit Payments
              </Button>
              <div className="font-semibold text-right">
                Total: ${totalAmount.toFixed(2)}
              </div>
            </div>
          </>
        )}
      </CardFooter>
    </>
  );
}
