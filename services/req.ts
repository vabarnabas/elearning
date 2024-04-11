import { CreateCourseDto } from "@/data/dto/course/create-course.dto"
import { UpdateCourseDto } from "@/data/dto/course/update-course.dto.ts"
import { CreateCourseClassDto } from "@/data/dto/course-class/create-course-class.dto"
import { UpdateCourseClassDto } from "@/data/dto/course-class/update-course-class.dto copy"
import { Token } from "@/types/auth.types"
import {
  Course,
  CourseClass,
  CourseWithData,
  User,
} from "@/types/backend.types"

import pathBuilder from "./path-builder"
import { request } from "./request"
import TokenService from "./token-service"

const BASE_PATH = process.env.NEXT_PUBLIC_API_URL as string

async function get(
  path: string,
  options?: {
    params?: Record<string, unknown>
    body?: Record<string, unknown>
  }
) {
  try {
    return await request("GET", {
      baseUrl: BASE_PATH,
      path: pathBuilder(path, options?.params),
      body: JSON.stringify(options?.body),
      token: await new TokenService("elearning-token").getToken(),
    })
  } catch (e) {
    throw new Error("Something went wrong. " + e)
  }
}

async function post(
  path: string,
  options?: {
    params?: Record<string, unknown>
    body?: Record<string, unknown>
  }
) {
  try {
    return await request("POST", {
      baseUrl: BASE_PATH,
      path: pathBuilder(path, options?.params),
      body: JSON.stringify(options?.body),
      token: await new TokenService("elearning-token").getToken(),
    })
  } catch (e) {
    console.error(e)
    throw new Error("Something went wrong. " + e)
  }
}

async function patch(
  path: string,
  options?: {
    params?: Record<string, unknown>
    body?: Record<string, unknown>
  }
) {
  try {
    return await request("PATCH", {
      baseUrl: BASE_PATH,
      path: pathBuilder(path, options?.params),
      body: JSON.stringify(options?.body),
      token: await new TokenService("elearning-token").getToken(),
    })
  } catch (e) {
    throw new Error("Something went wrong. " + e)
  }
}

async function del(
  path: string,
  options?: {
    params?: Record<string, unknown>
    body?: Record<string, unknown>
  }
) {
  try {
    return await request("DELETE", {
      baseUrl: BASE_PATH,
      path: pathBuilder(path, options?.params),
      body: JSON.stringify(options?.body),
      token: await new TokenService("elearning-token").getToken(),
    })
  } catch (e) {
    throw new Error("Something went wrong. " + e)
  }
}

export const req = {
  // General
  async saveToken(token: string): Promise<void> {
    const tokenService = new TokenService("elearning-token")

    await tokenService.saveToken(token)
  },
  async getToken(): Promise<string> {
    const tokenService = new TokenService("elearning-token")

    return await tokenService.getToken()
  },
  async deleteToken() {
    const tokenService = new TokenService("elearning-token")

    await tokenService.deleteToken()
  },

  // Auth
  async getCurrentUser(): Promise<User> {
    const user = await get("/auth/current")

    return user
  },
  async login(identifier: string, password: string): Promise<Token> {
    return await post("/auth/login", { body: { identifier, password } })
  },
  async register(dto: {
    displayName: string
    userName: string
    email: string
    password: string
    isAdmin: boolean
  }): Promise<Token> {
    return await post("/auth/register", {
      body: {
        displayName: dto.displayName,
        userName: dto.userName,
        email: dto.email,
        password: dto.password,
        isAdmin: dto.isAdmin,
      },
    })
  },

  // Users
  async getAllUsers(): Promise<User[]> {
    return await get("/user")
  },
  async getUserById(id: string): Promise<User> {
    return await get("/user/:id", { params: { id } })
  },
  async deleteUser(id: string): Promise<User> {
    return await del("/user/:id", { params: { id } })
  },

  // Course
  async getAllCourses(): Promise<Course[]> {
    return await get("/course")
  },
  async getCourseById(id: string): Promise<CourseWithData> {
    return await get("/course/:id", { params: { id } })
  },
  async createCourse(dto: CreateCourseDto) {
    return await post("/course", { body: dto })
  },
  async updateCourse(id: string, dto: UpdateCourseDto) {
    return await patch("/course/:id", { params: { id }, body: dto })
  },
  async deleteCourse(id: string) {
    return await del("/course/:id", { params: { id } })
  },

  // Course Class
  async getAllCourseClasses(): Promise<CourseClass[]> {
    return await get("/course-class")
  },
  async getCourseClassById(id: string): Promise<CourseClass> {
    return await get("/course-class/:id", { params: { id } })
  },
  async createCourseClass(dto: CreateCourseClassDto) {
    return await post("/course-class", { body: dto })
  },
  async completeCourseClass(id: string) {
    return await post("/course-class/complete/:id", { params: { id } })
  },
  async incompleteCourseClass(id: string) {
    return await post("/course-class/incomplete/:id", { params: { id } })
  },
  async updateCourseClass(id: string, dto: UpdateCourseClassDto) {
    return await patch("/course-class/:id", { params: { id }, body: dto })
  },
  async deleteCourseClass(id: string) {
    return await del("/course-class/:id", { params: { id } })
  },
}
