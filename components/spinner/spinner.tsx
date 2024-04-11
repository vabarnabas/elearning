import clsx from "clsx"
import React from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface Props {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <div className="flex h-full min-h-[4rem] w-full items-center justify-center">
      <AiOutlineLoading3Quarters className={clsx("animate-spin", className)} />
    </div>
  )
}
