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

  const { data: userData, isLoading: userIsLoading } = useSWR(
    CURRENT_USER_CACHE,
    async () => {
      return await req.getCurrentUser()
    },
    { ...immutableOptions }
  )

  const [selectedClass, setSelectedClass] = useState(data?.classes[0])

  useEffect(() => {
    if (id) {
      mutate(COURSE_CLASSES_BY_ID_CACHE(id))
    }
  }, [id])

  useEffect(() => {
    if (data) {
      setSelectedClass(data?.classes[0])
    }
  }, [data])

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
                    className="border border-[#2c2c2c] aspect-square w-10 flex justify-center items-center rounded-md bg-[#171a1d] z-10"
                  >
                    <Image
                      className="grayscale brightness-100 text-white"
                      src={icon}
                      height={26}
                      width={26}
                      alt={icon}
                    />
                  </div>
                ))}
                <p className="font-semibold text-3xl md:text-3xl z-10">
                  {data.displayName}
                </p>
              </div>
              <p className="font-light mt-4 opacity-80">{data.description}</p>
            </div>
            <div className="flex flex-col md:flex-row mt-6 gap-y-6 gap-x-2">
              <div className="relative flex flex-col gap-y-6 w-full md:w-52">
                <div className="absolute left-4 w-px bg-[#2c2c2c] min-h-full"></div>
                {data.classes.map((courseClass) => (
                  <>
                    <div className="flex items-center gap-x-3">
                      {userData &&
                      userData.completedClassIds.includes(courseClass.id) ? (
                        <div className="h-8 w-8 flex items-center justify-center aspect-square border border-[#2c2c2c] rounded-full bg-pink-500 z-10 ">
                          <FaCheck />
                        </div>
                      ) : (
                        <div className="h-8 w-8 border border-[#2c2c2c] rounded-full bg-[#171a1d] z-10 aspect-square" />
                      )}
                      <p
                        onClick={() => setSelectedClass(courseClass)}
                        className={clsx(
                          "hover:underline cursor-pointer",
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
                <div className="flex items-center justify-between mb-6 relative gap-x-4">
                  <p className="font-bold text-2xl md:text-3xl">
                    {selectedClass?.displayName}
                  </p>
                  <button
                    onClick={async () => {
                      if (
                        userData?.completedClassIds.includes(
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
                      "text-sm flex-shrink-0 px-3 py-1.5  rounded-md flex items-center gap-x-1",
                      userData?.completedClassIds.includes(
                        selectedClass?.id as string
                      )
                        ? "border border-[#2c2c2c]"
                        : "hover:bg-pink-600 bg-pink-500"
                    )}
                  >
                    {userData?.completedClassIds.includes(
                      selectedClass?.id as string
                    ) ? (
                      <FaX />
                    ) : (
                      <FaCheck />
                    )}
                    {userData?.completedClassIds.includes(
                      selectedClass?.id as string
                    )
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </button>
                </div>
                <iframe
                  className="w-full aspect-video"
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
