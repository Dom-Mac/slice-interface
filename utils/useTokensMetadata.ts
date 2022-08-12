import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ethImg from "public/eth.svg"
import fetcher from "./fetcher"

// TODO: Save tokens metadata into a db/json file and call alchemy api just in case the metadata is not available
export default function useTokensMetadata(currencies: any[]) {
  const [tokensMetadata, setTokensMetadata] = useState([])

  const getTokenMetadata = async (currency: string) => {
    const alchemyUrl = process.env.NEXT_PUBLIC_NETWORK_URL
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    }

    const body = {
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getTokenMetadata",
      params: [currency]
      // params: ["0xeb8f08a975ab53e34d8a0330e0d34de942c95926"]
    }

    const response = await fetcher(alchemyUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })

    return response.result
  }

  const getEthMetadata = async () => {
    return { name: "Ethereum", symbol: "ETH", logo: ethImg }
  }

  const getAllTokensMetadata = async (requests: Promise<any>[]) => {
    const metadata = await Promise.all(requests)
    const formattedMetadata = metadata.map((m) => {
      return {
        name: m.name || "",
        symbol: m.symbol || "",
        logo: m.logo || ethImg
      }
    })
    setTokensMetadata(formattedMetadata)
  }

  useEffect(() => {
    const requests = []
    if (currencies) {
      currencies.forEach((currency) => {
        if (currency?.id.split("-")[1] === ethers.constants.AddressZero) {
          requests.push(getEthMetadata())
        } else {
          requests.push(getTokenMetadata(currency?.id.split("-")[1]))
          console.log("currency", currency)
        }
      })

      getAllTokensMetadata(requests)
    }
  }, [currencies])

  return tokensMetadata
}
