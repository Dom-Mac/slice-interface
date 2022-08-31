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
    // Get currency metadata from alchemy API, it only accepts one address per request
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
    }
    const response = await fetcher(alchemyUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })

    // If metadata are found, save them inside our database to optimize queries
    if (response.result) {
      fetcher("/api/currencies/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          name: response.result.name,
          symbol: response.result.symbol,
          logo: response.result.logo
        })
      })
    }

    return response.result
  }

  const getEthMetadata = async (): Promise<TokenMetadata> => {
    return { name: "Ethereum", symbol: "ETH", logo: ethImg }
  }

  const getAllTokensMetadata = async (requests: Promise<TokenMetadata>[]) => {
    const metadata = await Promise.all(requests)
    const formattedMetadata = metadata.map((m) => {
      return {
        name: m?.name || "",
        symbol: m?.symbol || "",
        logo: m?.logo || ""
      }
    })
    setTokensMetadata(formattedMetadata)
  }

  const getCurrencies = async () => {
    const currenciesAddresses = currencies.map((c) => c.id.split("-")[1])
    // Get currencies from database if present
    const dbCurrencies = await fetcher("/api/currencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currencies: currenciesAddresses })
    })
    console.log(dbCurrencies)

    // Logic to mix currencies saved in our database with alchemy requests
    // without changin the currencies array order
    const requests = []
    currencies.forEach((currency) => {
      const address = currency?.id.split("-")[1]
      if (address === ethers.constants.AddressZero) {
        // if ETH, push eth metadata
        requests.push(getEthMetadata())
      } else {
        // check if requested currency is present inside the DB
        const dbCurrency = dbCurrencies.find((c) => c.address === address)
        if (dbCurrency) {
          // if present push its Metadata inside the requests
          requests.push({
            name: dbCurrency?.name || "",
            symbol: dbCurrency?.symbol || "",
            logo: dbCurrency?.logo || ""
          })
        } else {
          // if not present search for the currency on alchemy
          requests.push(getTokenMetadata(address))
        }
      }
    })

    getAllTokensMetadata(requests)
  }

  useEffect(() => {
    if (currencies) {
      getCurrencies()
    }
  }, [currencies])

  return tokensMetadata
}
