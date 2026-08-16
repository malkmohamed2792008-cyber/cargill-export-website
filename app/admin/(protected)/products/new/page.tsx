import { Metadata } from "next"
import ProductForm from "../[id]/edit/page"

export const metadata: Metadata = {
  title: "New Product | CARGILL Admin",
  description: "Create a new product",
}

export default function NewProductPage() {
  return <ProductForm />
}
