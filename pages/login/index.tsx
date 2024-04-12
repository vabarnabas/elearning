import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import Layout from "@/components/layout/layout"
import { loginSchema } from "@/schemas/yup/login.schema"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"

type FormValues = {
  identifier: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const origin = router.query.origin as string | undefined

  const [, setIsLoading] = useState(false)

  const form = useForm<FormValues>({ resolver: yupResolver(loginSchema) })
  const { register, handleSubmit } = form

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    console.log(data)
    await errorHandler(
      async () => {
        const { access_token } = await req.login(data.identifier, data.password)
        await req.saveToken(access_token)

        await router.push(origin ? origin : "/")
      },
      {
        onEndStep: () => setIsLoading(false),
      }
    )
  })

  return (
    <Layout disableNavbar>
      <FormProvider {...form}>
        <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
          <form onSubmit={onSubmit} className="flex min-w-80 flex-col gap-y-4">
            <p className="text-2xl font-bold">
              <span className="text-pink-500">W</span>elcome
            </p>
            <div className="">
              <p className="mb-1 text-sm opacity-60">E-mail</p>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Your E-mail"
                className="flex w-full items-center justify-center rounded-md border border-[#2c2c2c] bg-transparent px-3 py-1.5 outline-none"
              />
            </div>
            <div className="">
              <p className="mb-1 text-sm opacity-60">Password</p>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="flex w-full items-center justify-center rounded-md border border-[#2c2c2c] bg-transparent px-3 py-1.5 outline-none"
              />
            </div>
            <button className="w-full rounded-md bg-pink-500 px-3 py-1.5 font-semibold text-white hover:bg-pink-600">
              Login
            </button>
            <button className="cursor-pointer text-center text-pink-500 hover:text-pink-600">
              Register
            </button>
          </form>
        </div>
      </FormProvider>
    </Layout>
  )
}
