export type TaxBreakdown = {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
};

export function calculateTaxBreakdown(amount: number, taxRate = 0.18): TaxBreakdown {
  if (amount < 0) {
    throw new Error("Amount must be positive");
  }

  const taxAmount = Number((amount * taxRate).toFixed(2));
  const totalAmount = Number((amount + taxAmount).toFixed(2));

  return {
    baseAmount: Number(amount.toFixed(2)),
    taxAmount,
    totalAmount,
  };
}
