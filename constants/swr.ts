import pathBuilder from "@/services/path-builder"

export const CURRENT_USER_CACHE = "/auth/current"
export const COURSES_CACHE = "/course"
export const COURSE_CLASSES_BY_ID_CACHE = (id: string) =>
  pathBuilder("/course/course-class/:id", { id })
