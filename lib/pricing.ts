import type { Product, ProductPriceTier } from "@/types/database";

export function getEffectivePrice(
  product: Product,
  quantity: number,
  tiers: ProductPriceTier[]
): number {
  const now = new Date();

  // Check promotion
  const isPromotionActive =
    product.promotion_price !== null &&
    product.promotion_start !== null &&
    product.promotion_end !== null &&
    new Date(product.promotion_start) <= now &&
    new Date(product.promotion_end) >= now;

  if (isPromotionActive) {
    return product.promotion_price!;
  }

  // Check quantity-based pricing
  for (const tier of tiers) {
    if (
      quantity >= tier.min_quantity &&
      (tier.max_quantity === null || quantity <= tier.max_quantity)
    ) {
      return tier.price;
    }
  }

  return product.price;
}
