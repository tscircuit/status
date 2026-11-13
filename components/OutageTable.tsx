import { formatDuration } from "lib/format-duration"
import type { Outage } from "lib/types"

export { formatDuration }

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
                    {outage.start.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {outage.end.toLocaleString()}
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
