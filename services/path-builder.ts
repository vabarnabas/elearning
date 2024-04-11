export default function pathBuilder(
  path: string,
  params?: Record<string, unknown>
) {
  let localPath: string = path

  if (!params) return localPath

  Object.keys(params).forEach((key) => {
    const param = String(params[key])

    if (typeof param === "string" && localPath.includes(`:${key}`)) {
      localPath = localPath.replace(`:${key}`, param)
    }
  })

  return localPath
}
