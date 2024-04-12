import { FaUserSlash, FaUserTimes } from "react-icons/fa"
import useSWR from "swr"

import CourseCard from "@/components/course-card/course-card"
import Layout from "@/components/layout/layout"
import StateWrapper from "@/components/state-wrapper/state-wrapper"
import { COURSES_CACHE } from "@/constants/swr"
import { immutableOptions } from "@/constants/swr.options"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"

export default function Home() {
  const { data, isLoading, error } = useSWR(
    COURSES_CACHE,
    async () => {
      return await errorHandler(
        async () => {
          return await req.getAllCourses()
        }
        // { onError: () => createToast(BASIC_ERROR_TOAST) }
      )
    },
    { ...immutableOptions }
  )

  return (
    <Layout>
      <StateWrapper
        data={data}
        error={error}
        isValidating={isLoading}
        icons={{ error: <FaUserTimes />, empty: <FaUserSlash /> }}
        category="users"
      >
        {({ data }) => (
          <div className="grid h-full w-full gap-3 md:grid-cols-3">
            {data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </StateWrapper>
    </Layout>
  )
}
