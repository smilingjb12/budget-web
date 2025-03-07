import { db } from "@/db";
import { regularPayments } from "@/db/schema/schema";

export interface RegularPaymentDto {
  id?: number;
  name: string;
  amount: number;
  date: string;
}

export const RegularPaymentService = {
  async getAllRegularPayments(): Promise<RegularPaymentDto[]> {
    const result = await db
      .select({
        id: regularPayments.id,
        name: regularPayments.name,
        amount: regularPayments.amount,
        date: regularPayments.date,
      })
      .from(regularPayments)
      .orderBy(regularPayments.name);

    return result.map((payment) => ({
      id: payment.id,
      name: payment.name,
      amount: Number(payment.amount),
      date: payment.date.toISOString(),
    }));
  },

  async saveRegularPayments(payments: RegularPaymentDto[]): Promise<void> {
    // Use a transaction to ensure both operations complete or fail together
    await db.transaction(async (tx) => {
      // Delete all existing payments
      await tx.delete(regularPayments);

      // Insert new payments if there are any
      if (payments.length > 0) {
        await tx.insert(regularPayments).values(
          payments.map((payment) => ({
            name: payment.name,
            amount: payment.amount.toString(),
            date: new Date(payment.date),
          }))
        );
      }
    });
  },
};
