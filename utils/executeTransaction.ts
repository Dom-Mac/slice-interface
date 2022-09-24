import { Dispatch, SetStateAction } from "react"

export type TxData = {
  tx?: { hash: string }
  wait?: { transactionHash: string }
}

const executeTransaction = async (
  promise: () => Promise<any>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<any>>
) => {
  setData(null)
  setLoading(true)
  try {
    const tx = await promise()
    setData({ tx })
    const wait = await tx.wait()
    setData({ tx, wait })
  } catch (err) {}
  setLoading(false)
}

export default executeTransaction
