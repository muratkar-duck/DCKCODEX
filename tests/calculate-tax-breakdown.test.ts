import { calculateTaxBreakdown } from "@/utils/calculate-tax-breakdown";

describe("calculateTaxBreakdown", () => {
  it("calculates tax correctly", () => {
    const result = calculateTaxBreakdown(1000, 0.2);
    expect(result).toEqual({ baseAmount: 1000, taxAmount: 200, totalAmount: 1200 });
  });

  it("throws when amount negative", () => {
    expect(() => calculateTaxBreakdown(-10)).toThrow("Amount must be positive");
  });
});
