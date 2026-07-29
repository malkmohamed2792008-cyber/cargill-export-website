import { Metadata } from "next"
import CategoryForm from "../[id]/edit/page"

export const metadata: Metadata = {
  title: "New Category | CARGILL Admin",
  description: "Create a new category",
}

export default function NewCategoryPage() {
  return <CategoryForm />
}
