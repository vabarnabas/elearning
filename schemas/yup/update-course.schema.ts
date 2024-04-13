import * as yup from "yup"

import { FIELD_REQUIRED } from "@/constants/field-errors"

export const updateCourseSchema = yup.object().shape({
  displayName: yup.string().required(FIELD_REQUIRED),
  description: yup.string().required(FIELD_REQUIRED),
})
