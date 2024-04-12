import useSWR from "swr"

import { CURRENT_USER_CACHE } from "@/constants/swr"
import { req } from "@/services/req"

export default function UseCurrentUser() {
  const { data, isLoading, error } = useSWR(CURRENT_USER_CACHE, async () => {
    return await req.getCurrentUser()
  })

  return { currentUser: data, isLoading, error }
}
