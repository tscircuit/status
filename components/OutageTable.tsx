import { formatDateTime } from "lib/format-date"
import type { Outage } from "lib/types"

function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.round(milliseconds / 1000 / 60)
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}hr ${minutes.toString().padStart(2, "0")}min`
  } else {
    return `${totalMinutes}min`
  }
}

export const OutageTable = ({
  outages,
}: {
  outages: Array<Outage>
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4">Recent Outages</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 whitespace-nowrap">Service</th>
              <th className="text-left py-2 px-4 whitespace-nowrap">
                Start Time
              </th>
              <th className="text-left py-2 px-4 whitespace-nowrap">
                End Time
              </th>
              <th className="text-left py-2 px-4 whitespace-nowrap">
                Duration
              </th>
              <th className="text-left py-2 px-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...outages]
              .filter((outage) => outage.duration >= 15 * 60 * 1000) // Filter outages shorter than 15 minutes
              .sort((a, b) => b.start.getTime() - a.start.getTime())
              .map((outage, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <tr key={i} className="border-b">
                  <td className="py-2 px-4 whitespace-nowrap">
                    {outage.service}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span
                      className="timestamp"
                      data-format="datetime"
                      data-timestamp={outage.start.toISOString()}
                    >
                      {formatDateTime(outage.start, {
                        timeZone: "UTC",
                        hour12: false,
                      })}
                    </span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span
                      className="timestamp"
                      data-format="datetime"
                      data-timestamp={outage.end.toISOString()}
                    >
                      {formatDateTime(outage.end, {
                        timeZone: "UTC",
                        hour12: false,
                      })}
                    </span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {formatDuration(outage.duration)}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-sm ${outage.isOngoing ? "bg-red-100 text-red-800" : "bg-gray-100"}`}
                    >
                      {outage.isOngoing ? "Ongoing" : "Resolved"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
