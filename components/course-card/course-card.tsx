import clsx from "clsx"
import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"

import { Course } from "@/types/backend.types"

interface Props {
  course: Course
}

export default function CourseCard({ course }: Props) {
  const router = useRouter()

  return (
    <div
      key={course.displayName}
      onClick={() => router.push(`courses/${course.id}`)}
      className="relative flex h-56 cursor-pointer flex-col justify-between rounded-md border border-[#2c2c2c] bg-[#171a1d] p-3"
    >
      <Image
        className="rounded-md opacity-30"
        src={course.imageUrl}
        objectFit="cover"
        fill
        alt="asd"
      />
      <div className="z-10 flex w-full justify-between">
        <div className="flex gap-x-1.5">
          {course.iconUrls.map((icon) => (
            <div
              key={icon}
              className="flex aspect-square w-8 items-center justify-center rounded-md border border-[#2c2c2c] bg-[#171a1d]"
            >
              <Image
                className="text-white brightness-100 grayscale"
                src={icon}
                height={20}
                width={20}
                alt={icon}
              />
            </div>
          ))}
        </div>
        {course.isAvailable ? (
          <div
            className={clsx(
              "h-max rounded-full px-4 py-0.5 text-xs",
              course.cost === 0 ? "bg-pink-500" : "bg-pink-500"
            )}
          >
            {course.cost === 0
              ? "Ingyenes"
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
      <div className="z-10">
        <p className="text-xl font-semibold">{course.displayName}</p>
        {course.description ? (
          <p className="mt-2 text-sm font-light">{course.shortDescription}</p>
        ) : null}
      </div>
    </div>
  )
}
