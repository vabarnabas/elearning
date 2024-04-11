import * as yup from "yup"

import { FIELD_REQUIRED } from "@/constants/field-errors"

export const loginSchema = yup.object().shape({
  identifier: yup.string().required(FIELD_REQUIRED),
  password: yup.string().required(FIELD_REQUIRED),
})
