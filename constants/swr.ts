import pathBuilder from "@/services/path-builder"

export const CURRENT_USER_CACHE = "/auth/current"
export const COURSES_CACHE = "/course"
export const COURSE_BY_ID_CACHE = (id: string) =>
  pathBuilder("/course/course/:id", { id })
