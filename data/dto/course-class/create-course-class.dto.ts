export type CreateCourseClassDto = {
  slug: string
  displayName: string
  description?: string
  type?: string
  url: string
  categories: string[]
}
