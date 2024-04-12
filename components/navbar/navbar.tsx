import { useRouter } from "next/router"
import React from "react"
import { MdSchool } from "react-icons/md"

import { req } from "@/services/req"

import Avatar from "../avatar/avatar"

export default function Navbar() {
  const router = useRouter()

  return (
    <div className="fixed inset-x-0 flex h-16 justify-center">
      <div className="flex h-full w-full max-w-[1280px] items-center justify-between px-6">
        <div className="flex cursor-pointer items-center gap-x-4">
          <p
            onClick={() => router.push("/")}
            className="flex items-center gap-x-1.5 text-xl font-bold"
          >
            <MdSchool className="text-2xl text-pink-500" />
            Coursel <span className="text-xs text-pink-500">ALPHA</span>
          </p>
        </div>
        <div
          onClick={async () => {
            await req.deleteToken()
            await router.push("/login")
          }}
        >
          <Avatar />
        </div>
      </div>
    </div>
  )
}
