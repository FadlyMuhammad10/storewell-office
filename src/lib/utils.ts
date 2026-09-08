import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

type Discount = {
  type: string;
  value: number;
};

export function getDiscountedPrice(
  basePrice: number,
  discount?: Discount,
  finalPrice?: number,
) {
  if (!discount) {
    return {
      finalPrice: basePrice,
      discountLabel: null,
    };
  }

  const discountType = discount.type.toLowerCase();
  const discountValue = Math.max(0, Number(discount.value) || 0);
  const isPercentage =
    discountType === "%" || discountType.includes("percent");
  const discountAmount = isPercentage
    ? basePrice * (Math.min(discountValue, 100) / 100)
    : Math.min(discountValue, basePrice);

  return {
    finalPrice: finalPrice ?? Math.max(0, basePrice - discountAmount),
    discountLabel: isPercentage
      ? `-${discountValue}%`
      : `-${formatPrice(discountValue)}`,
  };
}

export function getPaginationRange(current: number, total: number, delta = 1) {
  const range: (number | "...")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push("...");

  if (total > 1) range.push(total);

  return range;
}
export function getDisplayStatus(
  status: string,
  processStatus?: string | null,
) {
  if (status === "pending") return "pending";
  if (status === "expired") return "expired";
  if (status === "cancelled") return "cancelled";

  // Sudah dibayar
  switch (processStatus) {
    case "new":
      return "success";

    case "process":
      return "process";

    case "shipped":
      return "shipped";

    case "delivered":
      return "completed";

    default:
      return "success";
  }
}
export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "success":
      return "bg-blue-100 text-blue-800";
    case "process":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-cyan-100 text-cyan-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-green-100 text-green-800";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "AWAITING PAYMENT";
    case "success":
      return "PAID";
    case "process":
      return "PROCESSING";
    case "shipped":
      return "SHIPPED";
    case "delivered":
      return "COMPLETED";
    case "expired":
      return "EXPIRED";
    default:
      return "COMPLETED";
  }
}
