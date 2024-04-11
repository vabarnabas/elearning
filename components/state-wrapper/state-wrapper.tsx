import clsx from "clsx"
import React from "react"
import { BsDatabaseFillExclamation } from "react-icons/bs"
import { MdError } from "react-icons/md"

import Spinner from "../spinner/spinner"

interface Props<T> {
  data: void | T | undefined
  isValidating: boolean
  error: boolean
  children: (data: { data: T }) => React.ReactNode
  icons?: { empty?: JSX.Element; error?: JSX.Element }
  category: string
  showNull?: boolean
  className?: string
}

export default function StateWrapper<T>({
  icons,
  children,
  data,
  error,
  className,
  showNull,
  category,
  isValidating: isLoading,
}: Props<T>) {
  if (isLoading) {
    return (
      <div>
        <Spinner className="text-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={clsx(
          className,
          "flex w-full flex-1 flex-col items-center justify-center py-2"
        )}
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-soft-green-light/10 text-5xl text-soft-green-light">
          {icons?.error || <MdError />}
        </span>
        <p className="mt-3 text-xl font-bold">Something Went Wrong</p>

        <p className="mt-0.5 max-w-xs text-center text-sm text-foreground-placeholder">
          {`It seems like we've encountered some error with loading the ${category}.`}
        </p>
      </div>
    )
  }

  if (!data || (Array.isArray(data) && !data.length)) {
    if (showNull) return null

    return (
      <div
        className={clsx(
          className,
          "flex w-full flex-1 flex-col items-center justify-center py-2"
        )}
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-soft-green-light/10 text-5xl text-soft-green-light">
          {icons?.empty || <BsDatabaseFillExclamation />}
        </span>
        <p className="mt-3 text-xl font-bold">No Data</p>
        <p className="mt-0.5 max-w-xs text-center text-sm text-foreground-placeholder">
          {`It seems like currently we don't have ${category} to load.`}
        </p>
      </div>
    )
  }

  // Render the children by passing data as an argument to the function
  return <>{children({ data })}</>
}
