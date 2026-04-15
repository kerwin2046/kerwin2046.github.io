declare module "gray-matter" {
  interface GrayMatterResult {
    data: Record<string, unknown>
    content: string
    excerpt?: string
    orig: string
    language: string
    matter: string
    stringify: (options?: Record<string, unknown>) => string
  }

  function matter(input: string, options?: Record<string, unknown>): GrayMatterResult
  export = matter
}
