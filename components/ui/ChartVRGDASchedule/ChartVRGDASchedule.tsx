import formatNumber from "@utils/formatNumber"

type Props = {
  rate: "Linear" | "Logistic"
  units: number
  timeFactor: number
}

const ChartVRGDASchedule = ({ rate, units, timeFactor }: Props) => {
  const isDataFilled = units != 0 && timeFactor != 0

  return (
    <>
      <h3 className="pt-8">Sale schedule</h3>
      <div className="py-4">
        <div className="relative h-64 pl-2 text-gray-400 xs:pl-6">
          <div className="relative h-full overflow-hidden text-gray-400 border-b border-l border-gray-300">
            {rate == "Linear" ? (
              <svg
                viewBox="0 0 944 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full pt-6 pr-4"
              >
                <line
                  x1="943"
                  y1="56"
                  x2="943"
                  y2="512"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="6 6"
                />
                <line
                  x1="942"
                  y1="57"
                  x2="3"
                  y2="57"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="6 6"
                />
                <path
                  d="M-0.336914 511.63L944 57"
                  stroke="#2563EB"
                  stroke-width="3"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 944 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full pt-6"
              >
                <line
                  x1="107.001"
                  y1="302.004"
                  x2="107.001"
                  y2="512.004"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="6 6"
                />
                <line
                  x1="108"
                  y1="301"
                  x2="1"
                  y2="301"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="6 6"
                />
                <line
                  x1="939.001"
                  y1="57.0037"
                  x2="0.000732422"
                  y2="57.0037"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="6 6"
                />
                <path
                  d="M1.10878 512.612C129.5 220.003 206 149.502 314 103.502C422 57.5016 589.5 57.5035 944 57.5035"
                  stroke="#2563EB"
                  stroke-width="3"
                />
              </svg>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-full -ml-12 -mr-12 border-b border-gray-300" />
          <div className="absolute bottom-0 h-full -mb-8 border-l border-gray-300" />
          <p className="absolute top-0 left-0 ml-5 text-sm xs:mt-1 xs:-ml-6">
            Sales
          </p>
          <p
            className={`absolute top-0 left-0 mt-7 text-sm text-black min-w-[40px] ml-5 text-left xs:text-right xs:-ml-7 xs:mt-10`}
          >
            {formatNumber(Number(units))}
          </p>
          {rate == "Linear" ? (
            <>
              <p
                className={`absolute bottom-0 right-0 mr-2 text-sm ${
                  isDataFilled ? "text-black" : ""
                } -mb-7`}
              >
                {isDataFilled
                  ? `${formatNumber(
                      Math.floor((units / timeFactor) * 100) / 100
                    )} days`
                  : "Sellout time"}
              </p>
            </>
          ) : (
            <>
              <p className="absolute bottom-0 right-0 mr-2 text-sm -mb-7">
                Time
              </p>

              <p
                className={`absolute top-0 left-0 mt-[138px] text-sm text-black min-w-[40px] ml-5 text-left xs:text-right xs:-ml-7 xs:mt-[148px]`}
              >
                {formatNumber(Math.floor(units * 46) / 100)}
              </p>
              {isDataFilled && (
                <p className="absolute bottom-0 left-0 w-32 -ml-1 text-sm text-center text-black xs:ml-4 -mb-7">
                  {formatNumber(Number(timeFactor))} days
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ChartVRGDASchedule
