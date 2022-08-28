import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ethImg from "public/eth.svg"
import fetcher from "./fetcher"

export type Currency = {
  id: string
  metadata?: any
  paidToProtocol: string
  quote?: number
  toPayToProtocol: string
  toWithdraw: string
  withdrawn: string
  __typename: string
}

export type TokenMetadata = {
  decimals?: number
  name: string
  symbol: string
  logo: any
}

export default function useTokensMetadata(
  currencies: Currency[]
): TokenMetadata[] {
  const [tokensMetadata, setTokensMetadata] = useState<TokenMetadata[]>([])

  const getTokenMetadata = async (currency: string): Promise<TokenMetadata> => {
    const dbCurrency = await fetcher("/api/currencies", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency })
    })

    // Return if currency is already in slice database
    if (dbCurrency) {
      console.log("Currency already exists")
      return dbCurrency
    } else {
      console.log("Currency doesn't exist")
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

      fetcher("/api/currencies/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          name: response.result.name,
          symbol: response.result.symbol,
          logo: response.result.logo || ""
        })
      })

      return response.result
    }
  }

  const getEthMetadata = async (): Promise<TokenMetadata> => {
    return { name: "Ethereum", symbol: "ETH", logo: ethImg }
  }

  const getAllTokensMetadata = async (requests: Promise<TokenMetadata>[]) => {
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
    const requests: Promise<TokenMetadata>[] = []
    if (currencies) {
      currencies.forEach((currency) => {
        if (currency?.id.split("-")[1] === ethers.constants.AddressZero) {
          requests.push(getEthMetadata())
        } else {
          requests.push(getTokenMetadata(currency?.id.split("-")[1]))
        }
      })

      getAllTokensMetadata(requests)
    }
  }, [currencies])

  return tokensMetadata
}
