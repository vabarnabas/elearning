import { useRouter } from "next/router"
import React from "react"
import { MdSchool } from "react-icons/md"

import Avatar from "../avatar/avatar"

export default function Navbar() {
  const router = useRouter()

  return (
    <div className="fixed h-16 inset-x-0 flex justify-center">
      <div className="w-full flex justify-between items-center h-full max-w-[1280px] px-6">
        <div className="flex items-center gap-x-4 cursor-pointer">
          <p
            onClick={() => router.push("/")}
            className="font-bold text-xl flex items-center gap-x-1.5"
          >
            <MdSchool className="text-2xl text-pink-500" />
            Coursel <span className="text-pink-500 text-xs">ALPHA</span>
          </p>
        </div>
        <Avatar />
      </div>
    </div>
  )
}
