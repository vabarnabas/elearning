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
      className="relative border rounded-md border-[#2c2c2c] bg-[#171a1d] p-3 justify-between flex flex-col h-56 cursor-pointer"
    >
      <Image
        className="opacity-30 rounded-md"
        src={course.imageUrl}
        objectFit="cover"
        fill
        alt="asd"
      />
      <div className="w-full flex justify-between z-10">
        <div className="flex gap-x-1.5">
          {course.iconUrls.map((icon) => (
            <div
              key={icon}
              className="border border-[#2c2c2c] aspect-square w-8 flex justify-center items-center rounded-md bg-[#171a1d]"
            >
              <Image
                className="grayscale brightness-100 text-white"
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
              "px-4 py-0.5 text-xs h-max rounded-full",
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
              "px-4 py-0.5 text-xs h-max rounded-full bg-indigo-500"
            )}
          >
            Hamarosan Érkezik
          </div>
        )}
      </div>
      <div className="z-10">
        <p className="font-semibold text-xl">{course.displayName}</p>
        {course.description ? (
          <p className="text-sm font-light mt-2">{course.shortDescription}</p>
        ) : null}
      </div>
    </div>
  )
}
