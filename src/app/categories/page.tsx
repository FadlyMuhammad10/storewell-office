import type { Metadata } from "next";
import CategoriesPageContent from "./CategoriesPageContent";

export const metadata: Metadata = {
  title: "All Categories - Storewell",
  description:
    "Explore Storewell's curated departments and browse products by category.",
};

export default function CategoriesPage() {
  return <CategoriesPageContent />;
}
