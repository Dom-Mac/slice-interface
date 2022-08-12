import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ethImg from "public/eth.svg"
import fetcher from "./fetcher"

// TODO: Save tokens metadata into a db/json file anche call alchemy api just in case the metadata is not available
export default function useTokenMetadata(currency: string) {
  const [metadata, setMetadata] = useState({
    decimals: null,
    logo: null,
    name: "",
    symbol: ""
  })

  const getTokenMetadata = async () => {
    try {
      const alchemyUrl = process.env.NEXT_PUBLIC_NETWORK_URL
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      }

      const body = {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        // params: [currency]
        params: ["0xeb8f08a975ab53e34d8a0330e0d34de942c95926"]
      }

      const response = await fetcher(alchemyUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      })

      // TODO handle case in with one field is empty
      setMetadata(response.result)
    } catch (err) {
      // TODO how to handle potential errors?
      return err
    }
  }

  useEffect(() => {
    if (currency) {
      if (currency === ethers.constants.AddressZero) {
        setMetadata({
          decimals: 6,
          logo: ethImg,
          name: "Ethereum",
          symbol: "ETH"
        })
      } else {
        getTokenMetadata()
      }
    }
  }, [currency])

  return metadata
}
