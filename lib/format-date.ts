export function formatDateTime(
  value: Date | string,
  { timeZone = "UTC", hour12 }: { timeZone?: string; hour12?: boolean } = {},
) {
  const date = typeof value === "string" ? new Date(value) : value

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    ...(hour12 !== undefined ? { hour12 } : {}),
  }).format(date)
}
