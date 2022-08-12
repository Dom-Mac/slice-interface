import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ethImg from "public/eth.svg"
import fetcher from "./fetcher"

// TODO: Save tokens metadata into a db/json file anche call alchemy api just in case the metadata is not available
export default function useTokenMetadata(currency: string) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenLogo, setTokenLogo] = useState(ethImg)

  const getTokenMetadata = async () => {
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

    if (response.result) {
      setTokenName(response.result.name || "")
      setTokenSymbol(response.result.symbol || "")
      // TODO choose default logo
      setTokenLogo(response.result.logo || ethImg)
    }
  }

  useEffect(() => {
    if (currency) {
      if (currency === ethers.constants.AddressZero) {
        setTokenName("Ethereum")
        setTokenSymbol("ETH")
        setTokenLogo(ethImg)
      } else {
        getTokenMetadata()
      }
    }
  }, [currency])

  return { tokenName, tokenSymbol, tokenLogo }
}
