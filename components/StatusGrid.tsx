import type { StatusCheck } from "lib/types";

function calculateUptime(checks: StatusCheck[], service: string): number {
  // Get all service checks, filtering out any undefined or missing checks
  const serviceChecks = checks.flatMap((check) =>
    check.checks.filter((c) => c.service === service && c.status !== undefined)
  );

  if (serviceChecks.length === 0) {
    return 0;
  }

  const successfulChecks = serviceChecks.filter(
    (check) => check.status === "ok"
  );

  // Calculate percentage only based on periods where we have data
  return (successfulChecks.length / serviceChecks.length) * 100;
}

export function StatusGrid({ checks }: { checks: StatusCheck[] }) {
  const latestCheck = checks[checks.length - 1];
  const services = latestCheck.checks.map((check) => check.service);

  return (
    <div>
      <div
        id="error-modal"
        className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          id="modal-content"
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
        >
          <button
            className="close-modal absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
          <h4
            id="modal-title"
            className="text-lg font-semibold mb-4 text-gray-800"
          >
            Error Details
          </h4>
          <p id="error-message" className="text-sm text-gray-700"></p>
          <button className="close-modal mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Close
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {services.map((service) => {
          const uptime = calculateUptime(checks, service);
          const latest = latestCheck.checks.find((c) => c.service === service);
          const latestError =
            latest?.status === "error" ? latest?.error : null;

          return (
            <div
              key={service}
              className={`bg-white rounded-lg shadow-lg p-6 ${
                latestError ? "cursor-pointer" : ""
              }`}
              data-service={service}
              data-error={
                latestError || "No errors detected. The service is operational."
              }
            >
              <h3 className="text-lg font-semibold mb-2">{service}</h3>
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
          );
        })}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", () => {
              const modal = document.getElementById("error-modal");
              const modalContent = document.getElementById("modal-content");
              const modalTitle = document.getElementById("modal-title");
              const errorMessage = document.getElementById("error-message");

              document.querySelectorAll("[data-service]").forEach((card) => {
                card.addEventListener("click", () => {
                  const error = card.getAttribute("data-error");
                  const hasError = card.querySelector(".bg-red-500") !== null;

                  if (hasError) {
                    errorMessage.textContent = error;
                    modalTitle.textContent = "Error Details";

                    modalTitle.className =
                      "text-lg font-semibold mb-4 text-red-700";
                    errorMessage.className = "text-sm text-red-700";

                    modal.classList.remove("hidden");
                  }
                });
              });

              document.querySelectorAll(".close-modal").forEach((button) => {
                button.addEventListener("click", () => {
                  modal.classList.add("hidden");
                });
              });
            });
          `,
        }}
      />
    </div>
  );
}