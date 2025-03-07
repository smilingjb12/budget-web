"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RegularPaymentsList } from "./regular-payments-list";

export default function SettingsPage() {
  return (
    <div className="py-1 space-y-4">
      <h1 className="text-xl font-bold mb-6 px-4">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Regular Payments</CardTitle>
        </CardHeader>
        <RegularPaymentsList />
      </Card>
    </div>
  );
}
