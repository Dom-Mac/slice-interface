import { useEffect, useState } from "react"
import { TokenMetadata } from "./useTokensMetadata"
import fetcher from "./fetcher"

export type Quotes = {
  [key: string]: number
}

const useCurrenciesQuotes = (tokensMetadata: TokenMetadata[]): Quotes => {
  const [quotes, setQuotes] = useState<Quotes>({})

  const getQuotes = async () => {
    const response = await fetcher("/api/getQuotes", {
      method: "POST",
      body: JSON.stringify({ tokensMetadata })
    })

    setQuotes(response)
  }

  useEffect(() => {
    if (tokensMetadata.length > 0) {
      getQuotes()
    }
  }, [tokensMetadata])

  return quotes
}

export default useCurrenciesQuotes
