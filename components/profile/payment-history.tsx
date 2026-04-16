"use client";

import { CreditCard, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Payment } from "@/lib/types";
import { siteConfig } from "@/template/config";
import { formatPrice } from "@/lib/utils";

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const handleDownload = (payment: Payment) => {
    const tax = payment.amount * 0.18; // Reverse-engineer tax roughly
    const base = payment.amount - tax;
    
    const receiptContent = `
========================================
             ${siteConfig.brand.name.toUpperCase()} RECEIPT
========================================
Receipt ID:  ${payment.id || payment.transactionId || "N/A"}
Date:        ${new Date(payment.createdAt).toLocaleDateString()}

Vehicle:     ${payment.carName || "N/A"}
Method:      ${payment.paymentMethod.toUpperCase()}
Status:      ${payment.status.toUpperCase()}

----------------------------------------
Subtotal:    ${siteConfig.ui.currencySymbol}${base.toFixed(2)}
Taxes (18%): ${siteConfig.ui.currencySymbol}${tax.toFixed(2)}
========================================
TOTAL PAID:  ${siteConfig.ui.currencySymbol}${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
========================================
${siteConfig.brand.email} | ${siteConfig.brand.phone}
========================================
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${siteConfig.brand.name}_Receipt_${payment.id || "payment"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary/30">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Payment History
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Vehicle</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 align-middle">
                    {payment.carName || "Unknown Vehicle"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "completed"
                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                          : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button 
                      onClick={() => handleDownload(payment)}
                      className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No payment history yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
