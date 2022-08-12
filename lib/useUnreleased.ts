import { useEffect, useState } from "react"
import multicall from "@utils/multicall"
import formatCalldata from "@utils/formatCalldata"

const useUnreleased = (
  slicers: any[],
  address: string,
  currencies: string[]
) => {
  const [unreleased, setUnreleased] = useState([])
  let slicerAddresses = []

  const getOwnersUnreleased = async (args: string[]) => {
    const result = await multicall(
      slicerAddresses,
      "unreleased(address,address)",
      args
    )
    setUnreleased(result)
  }

  useEffect(() => {
    if (address && slicers) {
      slicers?.map((slicer) => {
        slicerAddresses.push(slicer.slicer.address)
      })
      const args = []
      currencies.forEach((currency) => {
        if (currency) {
          args.push(formatCalldata(address, currency))
        }
      })

      if (args.length != 0) {
        getOwnersUnreleased(args)
      }
    }
    return () => {}
  }, [slicers, address])

  return unreleased
}

export default useUnreleased

// TODO To fix
