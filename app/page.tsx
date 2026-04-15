import { redirect } from "next/navigation"

import { routing } from "@/i18n/routing"

/** GitHub Pages 静态托管不执行 middleware，根路径需显式跳到默认语言。 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
