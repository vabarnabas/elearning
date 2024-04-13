import clsx from "clsx"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { MdClass } from "react-icons/md"

import UseCurrentUser from "@/hooks/useCurrentUser"
import { Course } from "@/types/backend.types"

interface Props {
  course: Course
}

export default function CourseCard({ course }: Props) {
  const router = useRouter()
  const { currentUser } = UseCurrentUser()

  const courseCompletion = useMemo(() => {
    return (
      (course.classIds.filter((classId) =>
        currentUser?.completedClassIds.includes(classId)
      ).length /
        course.classIds.length) *
      100
    )
  }, [course, currentUser])

  return (
    <div className="rounded-md border border-[#2c2c2c] bg-[#171a1d]">
      <div
        key={course.id}
        onClick={() => router.push(`courses/${course.id}`)}
        className="relative flex h-48 cursor-pointer flex-col justify-between rounded-t-md border-[#2c2c2c] p-3"
      >
        <Image
          className="rounded-md opacity-30"
          src={course.imageUrl}
          objectFit="cover"
          fill
          alt="asd"
        />
        <div className="z-10 flex w-full items-center justify-between">
          <div className="font-semibold">{course.displayName}</div>
          {course.isAvailable ? (
            <div
              className={clsx(
                "h-max rounded-md px-4 py-0.5 text-xs",
                course.cost === 0 ? "bg-pink-500" : "bg-pink-500"
              )}
            >
              {course.cost === 0
                ? "Free"
                : new Intl.NumberFormat("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                  }).format(course.cost)}
            </div>
          ) : (
            <div
              className={clsx(
                "h-max rounded-full bg-indigo-500 px-4 py-0.5 text-xs"
              )}
            >
              Hamarosan Érkezik
            </div>
          )}
        </div>
        <div className="z-10 flex items-center justify-between">
          <div className="">
            {currentUser && currentUser.ownedCourseIds.includes(course.id) ? (
              <div className="">
                <div className="relative flex w-56 items-center justify-center rounded-md bg-pink-500/10 py-1 text-xs">
                  <div
                    className="absolute h-full rounded-md bg-pink-500"
                    style={{
                      width: `${courseCompletion}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs">
                  {`${courseCompletion}% Completed`}
                </div>
              </div>
            ) : (
              <p className="text-xs">Not Started</p>
            )}
          </div>
          <p className="flex w-max items-center gap-x-1 rounded-md bg-pink-500/10 px-2 py-0.5 text-xs text-pink-500">
            <MdClass />
            {`${course.classIds.length} ${course.classIds.length > 1 ? "Classes" : "Class"}`}
          </p>
        </div>
      </div>
    </div>
  )
}
