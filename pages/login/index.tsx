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
  const { register, handleSubmit, getValues } = form

  console.log(getValues())

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
        <div className="h-full w-full flex flex-col flex-grow items-center justify-center">
          <form onSubmit={onSubmit} className="flex flex-col gap-y-4 min-w-72">
            <p className="text-2xl font-bold">
              <span className="text-pink-500">W</span>elcome
            </p>
            <div className="">
              <p className="text-sm mb-1 font-semibold">E-mail</p>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Your E-mail"
                className="w-full px-3 py-1 border border-[#2c2c2c] flex justify-center items-center rounded-md bg-transparent"
              />
            </div>
            <div className="">
              <p className="text-sm mb-1 font-semibold">Password</p>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-3 py-1 border border-[#2c2c2c] flex justify-center items-center rounded-md bg-transparent"
              />
            </div>
            <button className="w-full px-3 py-1 bg-pink-500 hover:bg-pink-600 rounded-md text-white font-semibold">
              Login
            </button>
          </form>
        </div>
      </FormProvider>
    </Layout>
  )
}
