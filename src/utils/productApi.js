import { API } from "@/utils/api";

export async function getSingleProduct(id) {
  const res = await fetch(`${API}/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
