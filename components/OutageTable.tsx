import type { Outage } from "lib/types"

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
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
              <th className="text-left py-2 px-4 align-middle">Service</th>
              <th className="text-left py-2 px-4 align-middle">Start Time</th>
              <th className="text-left py-2 px-4 align-middle">End Time</th>
              <th className="text-left py-2 px-4 align-middle">Duration</th>
              <th className="text-left py-2 px-4 align-middle">Status</th>
              <th className="text-left py-2 px-4 align-middle">Error Message</th>
            </tr>
          </thead>
          <tbody>
            {[...outages]
              .filter((outage) => outage.duration >= 15 * 60 * 1000) // Filter outages shorter than 15 minutes
              .sort((a, b) => b.start.getTime() - a.start.getTime())
              .map((outage, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <tr key={i} className="border-b">
                  <td className="py-2 px-4 align-middle">{outage.service}</td>
                  <td className="py-2 px-4 align-middle">{outage.start.toLocaleString()}</td>
                  <td className="py-2 px-4 align-middle">{outage.end.toLocaleString()}</td>
                  <td className="py-2 px-4 align-middle">{formatDuration(outage.duration)}</td>
                  <td className="py-2 px-4 align-middle">
                    <span
                      className={`px-2 py-1 rounded text-sm ${outage.isOngoing ? "bg-red-100 text-red-800" : "bg-gray-100"}`}
                    >
                      {outage.isOngoing ? "Ongoing" : "Resolved"}
                    </span>
                  </td>
                  <td className="py-2 px-4 align-middle text-sm text-red-600 max-w-xs break-words">
                    {outage.error || "Unknown error"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
