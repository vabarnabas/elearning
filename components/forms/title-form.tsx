import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { FaSave } from "react-icons/fa"
import { IoText } from "react-icons/io5"
import { MdEdit } from "react-icons/md"
import { mutate } from "swr"
import * as yup from "yup"

import { FIELD_REQUIRED } from "@/constants/field-errors"
import { COURSE_BY_ID_CACHE } from "@/constants/swr"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"

interface Props {
  id: string
  displayName: string
}

export default function TitleForm({ id, displayName }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    defaultValues: { displayName },
    resolver: yupResolver(
      yup.object().shape({
        displayName: yup.string().required(FIELD_REQUIRED),
      })
    ),
  })

  const { register, handleSubmit } = form

  const onSubmit = handleSubmit(async (data) => {
    await errorHandler(
      async () => {
        await req.updateCourse(id, { displayName: data.displayName })
        await mutate(COURSE_BY_ID_CACHE(id))
      },
      { onEndStep: () => setIsEditing(false) }
    )
  })

  return (
    <FormProvider {...form}>
      <form className="rounded-md bg-[#171a1d] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
              <IoText />
            </span>
            <p className="text-lg font-semibold">Course Title</p>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onSubmit()
                }}
                className="flex items-center gap-x-2 rounded-md text-xs text-pink-500 hover:text-pink-600"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(false)
                }}
                className="flex items-center gap-x-2 rounded-md text-xs text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsEditing(true)
              }}
              className="flex items-center gap-x-2 rounded-md text-xs text-pink-500 hover:text-pink-600"
            >
              <MdEdit /> Edit
            </button>
          )}
        </div>
        <div className="mt-4 text-sm">
          {isEditing ? (
            <input
              {...register("displayName")}
              type="text"
              placeholder="Course Title"
              className="flex w-full items-center justify-center rounded-md border border-[#2c2c2c] bg-transparent px-3 py-1.5 outline-none"
            />
          ) : (
            <p className="">{displayName}</p>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
