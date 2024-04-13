import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { FaUserSlash, FaUserTimes } from "react-icons/fa"
import useSWR, { mutate } from "swr"

import ClassSelectionForm from "@/components/forms/class-selection-form"
import DescriptionForm from "@/components/forms/description-form"
import TitleForm from "@/components/forms/title-form"
import Layout from "@/components/layout/layout"
import StateWrapper from "@/components/state-wrapper/state-wrapper"
import { COURSE_BY_ID_CACHE } from "@/constants/swr"
import { immutableOptions } from "@/constants/swr.options"
import useCurrentUser from "@/hooks/useCurrentUser"
import errorHandler from "@/services/error-handler"
import { req } from "@/services/req"

export default function CourseEditView() {
  const router = useRouter()
  const id = router.query.id as string

  const { isLoading: userIsLoading } = useCurrentUser()

  const { data, isValidating, error } = useSWR(
    COURSE_BY_ID_CACHE(id),
    async () => {
      return await errorHandler(() => req.getCourseById(id))
    },
    { ...immutableOptions, isPaused: () => !id }
  )

  useEffect(() => {
    if (router.isReady && id) {
      mutate(COURSE_BY_ID_CACHE(id))
    }
  }, [id, router.isReady])

  return (
    <Layout>
      <StateWrapper
        data={data}
        error={error}
        isValidating={!id || isValidating || userIsLoading}
        icons={{ error: <FaUserTimes />, empty: <FaUserSlash /> }}
        category="users"
      >
        {({ data }) => (
          <div className="grid gap-3">
            <TitleForm id={data.id} displayName={data.displayName} />
            <DescriptionForm id={data.id} description={data.description} />
            <ClassSelectionForm classes={data.classes} />
          </div>
        )}
      </StateWrapper>
    </Layout>
  )
}
