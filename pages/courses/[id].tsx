import clsx from "clsx"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FaCheck, FaUserSlash, FaUserTimes } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import useSWR, { mutate } from "swr"

import Layout from "@/components/layout/layout"
import StateWrapper from "@/components/state-wrapper/state-wrapper"
import { COURSE_CLASSES_BY_ID_CACHE, CURRENT_USER_CACHE } from "@/constants/swr"
import { immutableOptions } from "@/constants/swr.options"
import UseCurrentUser from "@/hooks/useCurrentUser"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"

export default function CourseView() {
  const router = useRouter()
  const id = router.query.id as string

  const { data, isValidating, error } = useSWR(
    COURSE_CLASSES_BY_ID_CACHE(id),
    async () => {
      return await errorHandler(
        async () => {
          return await req.getCourseById(id)
        }
        // { onError: () => createToast(BASIC_ERROR_TOAST) }
      )
    },
    { ...immutableOptions, isPaused: () => !id }
  )

  const { currentUser, isLoading: userIsLoading } = UseCurrentUser()

  const [selectedClass, setSelectedClass] = useState(data?.classes[0])

  useEffect(() => {
    if (id) {
      mutate(COURSE_CLASSES_BY_ID_CACHE(id))
    }
  }, [id])

  useEffect(() => {
    if (data && currentUser) {
      setSelectedClass(
        data.classes.filter(
          (courseClass) =>
            !currentUser.completedClassIds.includes(courseClass.id)
        )[0] || data.classes[0]
      )
    }
  }, [data, currentUser])

  console.log(selectedClass)

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
              <div className="relative flex items-center justify-start gap-x-4">
                {data.iconUrls.map((icon) => (
                  <div
                    key={icon}
                    className="z-10 flex aspect-square w-10 items-center justify-center rounded-md border border-[#2c2c2c] bg-[#171a1d]"
                  >
                    <Image
                      className="text-white brightness-100 grayscale"
                      src={icon}
                      height={26}
                      width={26}
                      alt={icon}
                    />
                  </div>
                ))}
                <p className="z-10 text-3xl font-semibold md:text-3xl">
                  {data.displayName}
                </p>
              </div>
              <p className="mt-4 font-light opacity-80">{data.description}</p>
            </div>
            <div className="mt-6 flex flex-col gap-x-2 gap-y-6 md:flex-row">
              <div className="relative flex w-full flex-col gap-y-6 md:w-52">
                <div className="absolute left-4 min-h-full w-px bg-[#2c2c2c]"></div>
                {data.classes.map((courseClass) => (
                  <>
                    <div className="flex items-center gap-x-3">
                      {currentUser ? (
                        currentUser.completedClassIds.includes(
                          courseClass.id
                        ) ? (
                          <div className="z-10 flex aspect-square h-8 w-8 items-center justify-center rounded-full border border-[#2c2c2c] bg-pink-500 ">
                            <FaCheck />
                          </div>
                        ) : (
                          <div className="z-10 aspect-square h-8 w-8 rounded-full border border-[#2c2c2c] bg-[#171a1d]" />
                        )
                      ) : null}
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
                  </>
                ))}
              </div>
              <div className="w-full">
                <div className="relative mb-6 flex items-center justify-between gap-x-4">
                  <p className="text-2xl font-bold md:text-3xl">
                    {selectedClass?.displayName}
                  </p>
                  <button
                    onClick={async () => {
                      if (
                        currentUser?.completedClassIds.includes(
                          selectedClass?.id as string
                        )
                      ) {
                        await req.incompleteCourseClass(
                          selectedClass?.id as string
                        )
                      } else {
                        await req.completeCourseClass(
                          selectedClass?.id as string
                        )
                      }
                      await mutate(CURRENT_USER_CACHE)
                    }}
                    className={clsx(
                      "flex flex-shrink-0 items-center gap-x-1  rounded-md px-3 py-1.5 text-sm",
                      currentUser?.completedClassIds.includes(
                        selectedClass?.id as string
                      )
                        ? "border border-[#2c2c2c]"
                        : "bg-pink-500 hover:bg-pink-600"
                    )}
                  >
                    {currentUser?.completedClassIds.includes(
                      selectedClass?.id as string
                    ) ? (
                      <FaX />
                    ) : (
                      <FaCheck />
                    )}
                    {currentUser?.completedClassIds.includes(
                      selectedClass?.id as string
                    )
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </button>
                </div>
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${selectedClass?.embedId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="mt-6">{selectedClass?.description}</div>
              </div>
            </div>
          </>
        )}
      </StateWrapper>
    </Layout>
  )
}
