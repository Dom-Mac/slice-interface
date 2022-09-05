import { useState, useEffect } from "react"
import { ethers } from "ethers"
import fetcher from "./fetcher"

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
}

const getDbCurrencies = async (currenciesAddresses: String[]) => {
  const dbCurrencies = await fetcher("/api/currencies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currencies: currenciesAddresses })
  })

  return dbCurrencies
}

const getAlchemyMetadata = async (currency: string): Promise<TokenMetadata> => {
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

  return response.result
}

const getEthMetadata = async (): Promise<TokenMetadata> => {
  return { name: "Ethereum", symbol: "ETH", logo: "" }
}

const getCurrenciesMetadata = async (currencies, dbCurrencies) => {
  const requests = []
  currencies.forEach(async (currency) => {
    const address = currency?.id.split("-")[1]

    // check if requested currency is present inside the DB
    const dbCurrency = dbCurrencies.find((c) => c.address === address)
    if (dbCurrency) {
      // if present push its Metadata inside the requests
      requests.push({
        name: dbCurrency.name,
        symbol: dbCurrency.symbol,
        logo: dbCurrency.logo
      })
    } else {
      if (address === ethers.constants.AddressZero) {
        // if ETH push eth metadata
        requests.push(getEthMetadata())
      } else {
        // if not present search for the currency on alchemy
        requests.push(getAlchemyMetadata(address))
      }
    }
  })

  const metadata = await Promise.all(requests)
  const formattedMetadata = metadata.map((m) => {
    return {
      name: m?.name || "",
      symbol: m?.symbol || "",
      logo: m?.logo || ""
    }
  })

  return formattedMetadata
}

const getQuotes = async (metadata, currencies) => {
  const formattedData = {}

  const response = await fetcher("/api/getQuotes", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: JSON.stringify({ tokens: metadata })
  })

  Object.keys(response.data).forEach((key, index) => {
    const results = response.data[key] // array of currencies with the same key
    const currencyAddress = metadata?.address
      ? metadata.address
      : currencies[index].id.split("-")[1]
    if (currencyAddress === ethers.constants.AddressZero) {
      // if it's ETH take the first value of the array
      formattedData[key] = results[0]?.quote?.USD?.price
    } else {
      results.forEach((result) => {
        // check if the currency found by symbol has the correct address,
        // otherwise it's not the same currency
        const price =
          result.platform?.token_address?.toLowerCase() ===
          currencyAddress.toLowerCase()
            ? result.quote?.USD.price
            : 0
        formattedData[key] = price
      })
    }
  })

  return formattedData
}

export default function useCurrenciesData(currencies: Currency[]): Currency[] {
  // Custom hook, takes as param a list of currencies from the subgraph
  // and ads symbol, name, logo and quote

  const [currenciesData, setCurrenciesData] = useState<Currency[]>([])

  const getData = async () => {
    const currenciesAddresses = currencies.map((c) => c.id.split("-")[1])
    const dbCurrencies = await getDbCurrencies(currenciesAddresses)
    let formattedData: Currency[] = []

    // Case in which all the requested currencies are known
    if (dbCurrencies.length === currencies.length) {
      console.log("Case in which all the requested currencies are known")
      const dateNow = new Date()
      const minutesBetweenUpdates = 5
      // check if there are quotes to be updated
      const quotesToBeUpdated = dbCurrencies.filter(
        (currency) =>
          !currency.quote ||
          Number(currency.updatedAt) <
            Number(dateNow) - minutesBetweenUpdates * 60000
      )
      let quotes
      // if there are tokens to be updated, get quotes from coin market cap
      if (quotesToBeUpdated.length) {
        console.log(
          "Case in which all the requested currencies are known and quotes to be updated"
        )
        quotes = await getQuotes(dbCurrencies, currencies)
      }

      // format data
      currencies?.forEach((currency) => {
        const dbCurrency = dbCurrencies.find(
          (dbCurrency) => currency.id.split("-")[1] === dbCurrency.address
        )
        formattedData.push({
          ...currency,
          symbol: dbCurrency.symbol,
          name: dbCurrency.name,
          logo: dbCurrency.logo,
          // if the quotes have been updated return the new value, else return the db value
          quote: Object.keys(quotes).length
            ? quotes[dbCurrency.symbol]
            : dbCurrency.quote
        })
      })
    } else {
      // Case in which one or more currencies are unknown
      // so are needed metadata from alchemy and quotes from coin market cap
      const metadata = await getCurrenciesMetadata(currencies, dbCurrencies)
      const quotes = await getQuotes(metadata, currencies)
      console.log("Case in which one or more currencies are unknown")
      if (Object.keys(quotes).length && metadata.length) {
        currencies?.forEach((currency, index) => {
          const currencyMetadata = metadata[index]
          formattedData.push({
            ...currency,
            symbol: currencyMetadata.symbol,
            name: currencyMetadata.name,
            logo: currencyMetadata.logo,
            quote: quotes[currencyMetadata?.symbol]
          })
        })
      }
    }

    setCurrenciesData(formattedData)
  }

  useEffect(() => {
    if (currencies) {
      getData()
    }
  }, [currencies])

  return currenciesData
}
