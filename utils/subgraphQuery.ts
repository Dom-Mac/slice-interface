import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ApolloQueryResult } from "@apollo/client"

export const graphQuery = async (
  tokensQuery: string,
  setData: Dispatch<SetStateAction<ApolloQueryResult<any>>>
) => {
  const client = (await import("@utils/apollo-client")).default
  const { gql } = await import("@apollo/client")

  try {
    const { data } = await client.query({
      query: gql`
        query {
          ${tokensQuery}
        }
      `
    })

    setData({
      payee: {
        __typename: "Payee",
        currencies: [
          {
            __typename: "PayeeCurrency",
            id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0x0000000000000000000000000000000000000000",
            withdrawn: "15794999999999999",
            toWithdraw: "9750000000000001",
            toPayToProtocol: "250000000000001",
            paidToProtocol: "404999999999997"
          },
          {
            __typename: "PayeeCurrency",
            id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            withdrawn: "157",
            toWithdraw: "1542",
            toPayToProtocol: "250000000000001",
            paidToProtocol: "404999999999997"
          }
          // {
          //   __typename: "PayeeCurrency",
          //   id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0xdAC17F958D2ee523a2206206994597C13D831ec7",
          //   withdrawn: "3670",
          //   toWithdraw: "975000",
          //   toPayToProtocol: "2500000",
          //   paidToProtocol: "404999999999997"
          // },
          // {
          //   __typename: "PayeeCurrency",
          //   id: "0x4d5d7d63989bbe6358a3352a2449d59aa5a08267-0x6fa5FF63B2752265c6Bd9350591f97A7dAd9e918",
          //   withdrawn: "3670",
          //   toWithdraw: "975000",
          //   toPayToProtocol: "2500000",
          //   paidToProtocol: "404999999999997"
          // }
        ]
      }
    })
    // setData(data)
  } catch (err) {
    console.log("Error fetching data: ", err)
  }
}

const useQuery = (tokensQuery: string, dependencies = []) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    let execute = true
    dependencies.map((dep) => {
      !dep ? (execute = false) : null
    })
    if (execute) {
      graphQuery(tokensQuery, setData)
    }
  }, dependencies)
  return data
}

export default useQuery
