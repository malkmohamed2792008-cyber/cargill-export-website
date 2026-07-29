import { Metadata } from "next"
import SubcategoryForm from "../[id]/edit/page"

export const metadata: Metadata = {
  title: "New Subcategory | CARGILL Admin",
  description: "Create a new subcategory",
}

export default function NewSubcategoryPage() {
  return <SubcategoryForm />
}
