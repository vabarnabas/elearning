import clsx from "clsx"
import React from "react"
import useSWR from "swr"

import { CURRENT_USER_CACHE } from "@/constants/swr"
import { immutableOptions } from "@/constants/swr.options"
import { req } from "@/services/req"

import Spinner from "../spinner/spinner"

export enum AvatarSize {
  NORMAL = "h-8 w-8 text-sm",
  MEDIUM = "h-10 w-10 text-sm",
  LARGE = "h-11 w-11 text-base",
  EXTRA_LARGE = "h-20 w-20 text-3xl",
}

interface Props {
  noTooltip?: boolean
  disabled?: boolean
  size?: AvatarSize
  invert?: boolean
}

export default function Avatar({ invert, disabled, noTooltip, size }: Props) {
  const { data, isLoading } = useSWR(
    CURRENT_USER_CACHE,
    async () => {
      return await req.getCurrentUser()
    },
    { ...immutableOptions }
  )

  function getInitials(displayName: string) {
    const nameArray = displayName.split(" ")

    return `${nameArray[0].charAt(0)}${nameArray[1].charAt(0)}`
  }

  return (
    <div
      className={clsx(
        "group relative flex aspect-square items-center justify-center rounded-full font-semibold hover:z-10 hover:shadow",
        invert ? "text-soft-green-light" : "text-white",
        disabled
          ? invert
            ? "bg-background-tertiary"
            : "bg-background-tertiary"
          : invert
            ? "bg-white"
            : "bg-pink-500",
        size ? size : "h-8 w-8 text-sm",
        { "cursor-pointer": !noTooltip }
      )}
    >
      {!isLoading && data?.displayName ? (
        getInitials(data.displayName)
      ) : (
        <Spinner />
      )}
    </div>
  )
}
