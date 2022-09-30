import { useState, useEffect } from "react"
import { ethers } from "ethers"
import fetcher from "./fetcher"
import { Currency as DbCurrency } from "@prisma/client"

export type Currency = {
  id: string
  name?: string
  symbol?: string
  logo?: string
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
  address: string
}

export const ethMetadata = {
  name: "Ethereum",
  symbol: "ETH",
  logo: "",
  address: ethers.constants.AddressZero
}

export const getQuotesToBeUpdated = (
  currencies: { updatedAt: Date; quote: number }[]
) => {
  const dateNow = new Date()
  const minutesBetweenUpdates = 5
  // check if there are quotes to be updated
  return currencies.filter((currency) => {
    const lastUpdated = new Date(currency.updatedAt)
    return (
      !currency.quote ||
      lastUpdated.getTime() < Number(dateNow) - minutesBetweenUpdates * 60000
    )
  })
}

export const createOrUpdateCurrencies = (currencies) => {
  fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/currencies/createOrUpdate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currencies: currencies })
  })
}

export const getAlchemyMetadata = async (
  currencyAddress: string
): Promise<TokenMetadata> => {
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
    params: [currencyAddress]
  }
  const response = await fetcher(alchemyUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })

  return response.result
}

export const getCurrenciesMetadata = async (
  dbCurrencies: DbCurrency[],
  currencyAddresses: string[]
) => {
  const requests = []
  currencyAddresses.forEach(async (address) => {
    // check if requested currency is present inside the DB
    const dbCurrency = dbCurrencies.find((c) => c.address === address)
    if (dbCurrency) {
      // if present push its Metadata inside the requests
      requests.push({
        name: dbCurrency.name,
        symbol: dbCurrency.symbol,
        logo: dbCurrency.logo,
        address: dbCurrency.address
      })
    } else {
      if (address === ethers.constants.AddressZero) {
        // if ETH push eth metadata
        requests.push(ethMetadata)
      } else {
        // if not present search for the currency on alchemy
        requests.push(getAlchemyMetadata(address))
      }
    }
  })

  const metadata = await Promise.all(requests)
  const formattedMetadata = metadata.map((m, i) => {
    return {
      name: m?.name || "",
      symbol: m?.symbol || "",
      logo: m?.logo || "",
      address: m?.address || currencyAddresses[i]
    }
  })

  return formattedMetadata
}

// metadata could be either dbCurrencies ot metadata taken from alchemy API
export const getQuotes = async (
  tokens: { symbol: string; address: string }[]
) => {
  const response = await fetcher(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/getQuotes`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({ tokens })
    }
  )

  return response
}

// Custom hook, takes as param a list of currencies from the subgraph
// and ads symbol, name, logo and quote
export default function useCurrenciesData(
  subgraphData: {
    payee: {
      currencies: Currency[]
    }
  },
  dbCurrencies: DbCurrency[],
  account: string
): Currency[] {
  const [currenciesData, setCurrenciesData] = useState<Currency[]>()

  const getData = async () => {
    const currencies = subgraphData?.payee?.currencies
    let formattedData: Currency[] = []

    // Case in which all the requested currencies are known
    if (dbCurrencies.length === currencies.length) {
      let quotes = {}
      // check if there are quotes to be updated
      const quotesToBeUpdated = getQuotesToBeUpdated(dbCurrencies)

      // if there are tokens to be updated, get quotes from coin market cap
      if (quotesToBeUpdated.length) {
        quotes = await getQuotes(dbCurrencies)
      }

      // format data
      currencies?.forEach((currency) => {
        const dbCurrency = dbCurrencies.find(
          (dbCurrency) => currency.id.split("-")[1] === dbCurrency.address
        )
        const { name, symbol, logo, quote, address } = dbCurrency
        formattedData.push({
          ...currency,
          name,
          symbol,
          logo,
          // if the quotes have been updated return the new value, else return the db value
          quote: Object.keys(quotes).length ? quotes[symbol] : quote
        })
      })

      if (quotesToBeUpdated.length) {
        createOrUpdateCurrencies(formattedData)
      }
    } else {
      // Case in which one or more currencies are unknown
      // so are needed metadata from alchemy and quotes from coin market cap
      const currencyAddresses = currencies.map((el) => el.id.split("-")[1])
      const metadata = await getCurrenciesMetadata(
        dbCurrencies,
        currencyAddresses
      )
      const quotes = await getQuotes(metadata)
      if (Object.keys(quotes).length && metadata.length) {
        currencies?.forEach((currency, index) => {
          const { name, symbol, logo } = metadata[index]
          formattedData.push({
            ...currency,
            symbol,
            name,
            logo,
            quote: quotes[symbol]
          })
        })
      }

      createOrUpdateCurrencies(formattedData)
    }

    setCurrenciesData(formattedData)
  }

  useEffect(() => {
    if (subgraphData) {
      // Handle unexisting payee -> stop loading state
      if (!subgraphData.payee) {
        setCurrenciesData([])
      } else if (dbCurrencies) {
        getData()
      }
    }
  }, [subgraphData, dbCurrencies])

  // Cleanup on account change
  useEffect(() => {
    if (currenciesData) {
      setCurrenciesData(null)
    }
  }, [account])

  return currenciesData
}

///////////////////////////// DEV //////////////////////
/// SETDATA FUNCTION TO PUT IN SUBGRAPHQUERY
// IN ORDER TO TEST FRONTEND WITH MULTIPLE CURRENCIES
// setData({
//   payee: {
//     __typename: "Payee",
//     currencies: [
//       {
//         __typename: "PayeeCurrency",
//         id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0x0000000000000000000000000000000000000000",
//         withdrawn: "15794999999999999",
//         toWithdraw: "9750000000000001",
//         toPayToProtocol: "250000000000001",
//         paidToProtocol: "404999999999997"
//       },
//       {
//         __typename: "PayeeCurrency",
//         id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//         withdrawn: "157",
//         toWithdraw: "1542",
//         toPayToProtocol: "250000000000001",
//         paidToProtocol: "404999999999997"
//       },
//       {
//         __typename: "PayeeCurrency",
//         id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0xdAC17F958D2ee523a2206206994597C13D831ec7",
//         withdrawn: "3670",
//         toWithdraw: "975000",
//         toPayToProtocol: "2500000",
//         paidToProtocol: "404999999999997"
//       },
//       {
//         __typename: "PayeeCurrency",
//         id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0x6fa5FF63B2752265c6Bd9350591f97A7dAd9e918",
//         withdrawn: "3670",
//         toWithdraw: "975000",
//         toPayToProtocol: "2500000",
//         paidToProtocol: "404999999999997"
//       }
//     ]
//   }
// })
