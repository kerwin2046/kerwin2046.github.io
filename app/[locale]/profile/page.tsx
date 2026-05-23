import { redirect } from "next/navigation"

export default async function ProfilePage() {
  // Redirect /en/profile or /zh/profile to the new main root page /en or /zh
  redirect("/")
}
