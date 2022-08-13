import { useEffect, useState } from "react"
import fetcher from "./fetcher"

const useCurrenciesQuotes = (tokensMetadata: any[]) => {
  const [quotes, setQuotes] = useState({})

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
