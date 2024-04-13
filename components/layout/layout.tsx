import clsx from "clsx"
import { Inter } from "next/font/google"
import React from "react"

import Navbar from "../navbar/navbar"

const inter = Inter({ subsets: ["latin"] })

interface Props {
  children?: JSX.Element | JSX.Element[] | null
  disableNavbar?: boolean
}

export default function Layout({ children, disableNavbar }: Props) {
  return (
    <main
      className={`flex min-h-screen select-none flex-col items-center justify-between bg-[#0f0f0f] text-white ${inter.className}`}
    >
      {!disableNavbar ? <Navbar /> : null}
      <div
        className={clsx(
          "flex h-full w-full max-w-[1280px] flex-col px-6",
          !disableNavbar ? "pt-20" : "min-h-screen"
        )}
      >
        {children}
      </div>
    </main>
  )
}
