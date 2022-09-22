import { defaultProvider } from "@lib/useProvider"
import getSelector from "./getSelector"

const multicall = async (
  to: string | string[],
  functionSignature: string,
  args: string[],
  nestedCalls = true
) => {
  const promises = []
  const selector = getSelector(functionSignature)

  args.forEach((arg, i) => {
    const data = selector + arg
    if (typeof to === "string") {
      promises.push(
        defaultProvider.call({
          to,
          data
        })
      )
    } else {
      if (nestedCalls) {
        to.forEach((callAddress) => {
          promises.push(
            defaultProvider.call({
              to: callAddress,
              data
            })
          )
        })
      } else {
        promises.push(
          defaultProvider.call({
            to: to[i],
            data
          })
        )
      }
    }
  })

  const results = await Promise.all(promises.map((p) => p.catch(() => "")))

  return results
}

export default multicall
