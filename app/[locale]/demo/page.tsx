import { redirect } from "next/navigation"

export default async function DemoPage() {
  // Redirect /en/demo or /zh/demo to the new main root page /en or /zh
  redirect("/")
}
