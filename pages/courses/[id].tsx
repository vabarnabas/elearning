import clsx from "clsx"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { FaCheck, FaUserSlash, FaUserTimes } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { LuConstruction } from "react-icons/lu"
import { MdClass, MdEdit } from "react-icons/md"
import ReactPlayer from "react-player"
import useSWR, { mutate } from "swr"

import Layout from "@/components/layout/layout"
import StateWrapper from "@/components/state-wrapper/state-wrapper"
import { COURSE_CLASSES_BY_ID_CACHE, CURRENT_USER_CACHE } from "@/constants/swr"
import { immutableOptions } from "@/constants/swr.options"
import useCurrentUser from "@/hooks/useCurrentUser"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"
import { CourseClass } from "@/types/backend.types"

export default function CourseView() {
  const router = useRouter()
  const id = router.query.id as string

  const { data, isValidating, error } = useSWR(
    COURSE_CLASSES_BY_ID_CACHE(id),
    async () => {
      return await errorHandler(() => req.getCourseById(id))
    },
    { ...immutableOptions, isPaused: () => !id }
  )

  const { currentUser, isLoading: userIsLoading } = useCurrentUser()

  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null)

  useEffect(() => {
    if (router.isReady && id) {
      mutate(COURSE_CLASSES_BY_ID_CACHE(id))
    }
  }, [id, router.isReady])

  useEffect(() => {
    if (id && data) {
      setSelectedClass(
        data.classes.find(
          (courseClass) =>
            !currentUser?.completedClassIds.includes(courseClass.id)
        ) || data.classes[0]
      )
    }
  }, [id, data, currentUser])

  const handleCompleteClass = async (classId: string) => {
    await req.completeCourseClass(classId)
    await mutate(CURRENT_USER_CACHE)
  }

  const handleIncompleteClass = async (classId: string) => {
    await req.incompleteCourseClass(classId)
    await mutate(CURRENT_USER_CACHE)
  }

  const isCourseCompleted = useMemo(() => {
    return currentUser?.completedClassIds.includes(selectedClass?.id as string)
  }, [currentUser, selectedClass])

  const renderClasses = useMemo(() => {
    return data?.classes.map((courseClass) => (
      <div key={courseClass.id} className="flex items-center gap-x-3">
        {currentUser && isCourseCompleted ? (
          <div className="z-10 flex aspect-square h-8 w-8 items-center justify-center rounded-full border border-[#2c2c2c] bg-pink-500 ">
            <FaCheck />
          </div>
        ) : (
          <div className="z-10 aspect-square h-8 w-8 rounded-full border border-[#2c2c2c] bg-[#171a1d]" />
        )}
        <p
          onClick={() => setSelectedClass(courseClass)}
          className={clsx(
            "cursor-pointer hover:underline",
            selectedClass?.id === courseClass.id && "font-bold"
          )}
        >
          {courseClass.displayName}
        </p>
      </div>
    ))
  }, [data, currentUser, selectedClass, isCourseCompleted])

  return (
    <Layout>
      <StateWrapper
        data={data}
        error={error}
        isValidating={!id || isValidating || userIsLoading}
        icons={{ error: <FaUserTimes />, empty: <FaUserSlash /> }}
        category="users"
      >
        {({ data }) => (
          <>
            <div className="">
              <div className="flex justify-between">
                <div className="relative flex items-center justify-start gap-x-4">
                  <p className="z-10 flex w-full items-center text-3xl font-semibold md:text-3xl">
                    {data.displayName}
                  </p>
                  <p className="flex w-max flex-shrink-0 items-center gap-x-1 rounded-md bg-pink-500/10 px-2 py-0.5 text-xs text-pink-500">
                    <MdClass />
                    {`${data.classIds.length} ${data.classIds.length > 1 ? "Classes" : "Class"}`}
                  </p>
                </div>
                <div className="">
                  {currentUser?.isAdministrator && (
                    <button className="rounded-md bg-pink-500 px-3 py-1.5 text-sm text-white hover:bg-pink-600">
                      <MdEdit />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 font-light opacity-80">{data.description}</p>
            </div>
            {selectedClass !== undefined && selectedClass !== null ? (
              <div className="mt-6 flex flex-col gap-x-2 gap-y-6 md:flex-row">
                <div className="relative flex w-full flex-col gap-y-6 md:w-56">
                  <div className="absolute left-4 min-h-full w-px bg-[#2c2c2c]"></div>
                  {renderClasses}
                </div>
                <div className="w-full">
                  <ReactPlayer
                    style={{ aspectRatio: "16/9 auto" }}
                    width="100%"
                    height="auto"
                    controls
                    url={selectedClass?.url}
                    onProgress={async (progress) => {
                      if (progress.played >= 0.99) {
                        await handleCompleteClass(selectedClass?.id as string)
                      }
                    }}
                  />
                  <div className="mt-6 rounded-md border border-[#2c2c2c] p-5 ">
                    <div className="relative  flex items-center justify-between gap-x-4">
                      <p className="text-xl font-semibold md:text-2xl">
                        {selectedClass?.displayName}
                      </p>
                      <button
                        onClick={async () => {
                          if (isCourseCompleted) {
                            await handleIncompleteClass(
                              selectedClass?.id as string
                            )
                          } else {
                            await handleCompleteClass(
                              selectedClass?.id as string
                            )
                          }
                        }}
                        className={clsx(
                          "flex flex-shrink-0 items-center gap-x-1 rounded-md px-3 py-1.5 text-sm",
                          isCourseCompleted
                            ? "border border-[#2c2c2c]"
                            : "bg-pink-500 hover:bg-pink-600"
                        )}
                      >
                        {isCourseCompleted ? <FaX /> : <FaCheck />}
                        {isCourseCompleted
                          ? "Mark as Incomplete"
                          : "Mark as Complete"}
                      </button>
                    </div>
                    <div className="mt-4 text-sm opacity-80">
                      {selectedClass?.description}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex h-full flex-grow items-center justify-center">
                <div
                  className={clsx(
                    "flex w-full flex-1 flex-col items-center justify-center py-2"
                  )}
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/10 text-5xl text-pink-500">
                    <LuConstruction />
                  </span>
                  <p className="mt-3 text-xl font-bold">Under Construction</p>
                  <p className="text-foreground-placeholder mt-0.5 max-w-xs text-center text-sm">
                    It seems like this course is still under construction
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </StateWrapper>
    </Layout>
  )
}
