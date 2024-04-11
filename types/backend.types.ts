export type User = {
  id: string
  displayName: string
  userName: string
  email: string
  password: string
  isEducator: boolean
  isAdministrator: boolean
  ownedCourseIds: string[]
  completedClassIds: string[]
}

export type Course = {
  id: string
  slug: string
  creatorId: string
  displayName: string
  description: string
  shortDescription: string
  cost: number
  isAvailable: boolean
  imageUrl: string
  iconUrls: string[]
  classIds: string[]
}

export type CourseWithData = Course & {
  classes: CourseClass[]
  creator: User
}

export type CourseClass = {
  id: string
  slug: string
  displayName: string
  description?: string
  embedId: string
}
