import type { StatusCheck } from "lib/types"

function calculateUptime(checks: StatusCheck[], service: string): number {
  // Get all service checks, filtering out any undefined or missing checks
  const serviceChecks = checks.flatMap((check) =>
    check.checks.filter((c) => c.service === service && c.status !== undefined),
  )

  if (serviceChecks.length === 0) {
    return 0
  }

  const successfulChecks = serviceChecks.filter(
    (check) => check.status === "ok",
  )

  // Calculate percentage only based on periods where we have data
  return (successfulChecks.length / serviceChecks.length) * 100
}

export function StatusGrid({ checks }: { checks: StatusCheck[] }) {
  const latestCheck = checks[checks.length - 1]
  const services = latestCheck.checks.map((check) => check.service)

  return (
    <div>
      <div
        id="error-modal"
        className="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div
          id="modal-content"
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
        >
          <div className="flex items-center justify-between p-5 border-b">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 5.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z"
                />
              </svg>
              <h2
                id="modal-title"
                className="text-lg font-semibold text-red-600"
              >
                Error Details
              </h2>
            </div>
            <button
              className="close-modal text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-5">
            <p id="error-message" className="text-sm text-red-600"></p>
          </div>
          <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
            <button className="close-modal px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition">
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {services.map((service) => {
          const uptime = calculateUptime(checks, service)
          const latest = latestCheck.checks.find((c) => c.service === service)
          const latestError = latest?.status === "error" ? latest?.error : null

          return (
            <div key={service} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-2 justify-between">
                <h3 className="text-lg font-semibold">{service}</h3>
                {latestError && (
                  <button
                    className="ml-auto text-red-500 hover:text-red-600"
                    data-service={service}
                    data-error={latestError}
                    aria-label="View Error Details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-alert-icon lucide-circle-alert"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    latest?.status === "ok" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span>{latest?.status === "ok" ? "Operational" : "Error"}</span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {uptime.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Uptime (14 days)</div>
            </div>
          )
        })}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", () => {
              const modal = document.getElementById("error-modal")
              const modalContent = document.getElementById("modal-content")
              const modalTitle = document.getElementById("modal-title")
              const errorMessage = document.getElementById("error-message")

              document.querySelectorAll("button[data-service]").forEach((icon) => {
                icon.addEventListener("click", () => {
                  const error = icon.getAttribute("data-error")
                  const hasError = icon.querySelector(".bg-red-500") !== null

                  if (hasError) {
                    errorMessage.textContent = error
                    modalTitle.textContent = "Error Details"
                    errorMessage.className = "text-sm text-red-700"

                    modal.classList.remove("hidden");
                    modalContent.classList.remove("opacity-0", "scale-95");
                  }
                })
              })

              document.querySelectorAll(".close-modal").forEach((button) => {
                button.addEventListener("click", () => {
                  modal.classList.add("hidden");
                  modalContent.classList.add("opacity-0", "scale-95");
                });
              });
            })
          `,
        }}
      />
    </div>
  )
}
