/**
 * 全局共享类型
 */

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  image?: string
  tag?: string
}

export interface Post extends PostMeta {
  content: string
}
