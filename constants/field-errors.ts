export const FIELD_REQUIRED = "This field is required"
export const INVALID_EMAIL_FORMAT = "Invalid e-mail format"
export const FIELD_SHOULD_MATCH = (field: string) =>
  `This field should match the value of ${field}`
export const FIELD_SHOULD_REGEX = (regex: RegExp) =>
  `This field should match ${regex}`
