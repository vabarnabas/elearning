import React from "react"
import { MdClass, MdEdit } from "react-icons/md"

import { CourseClass } from "@/types/backend.types"

interface Props {
  classes: CourseClass[]
}

export default function ClassSelectionForm({ classes }: Props) {
  return (
    <form className="rounded-md bg-[#171a1d] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
            <MdClass />
          </span>
          <p className="text-lg font-semibold">Classes</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        {classes.map((courseClass) => (
          <div
            key={courseClass.id}
            className="flex items-center justify-between rounded-md px-2 py-1"
          >
            <p className="font-semibold">{courseClass.displayName}</p>
            <button className="flex items-center gap-x-2 rounded-md text-xs text-pink-500 hover:text-pink-600">
              <MdEdit />
              Edit
            </button>
          </div>
        ))}
      </div>
    </form>
  )
}
