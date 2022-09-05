import { createContext, useContext, useEffect, useState } from "react"
import { colorList, darkColorList } from "@utils/colorList"
import { View } from "@lib/content/modals"
import { getPurchases } from "@utils/getPurchases"
import { BytesLike } from "ethers"
import { useAccount, useProvider } from "wagmi"

export type Purchase = {
  slicerId: string
  productId: string
  totalQuantity: string
  buyerCustomData: BytesLike
}

const AppContext = createContext<any>({
  connector: null,
  provider: null,
  account: "",
  isConnected: false,
  color1: colorList[0],
  color2: colorList[1],
  darkColor1: darkColorList[0],
  darkColor2: darkColorList[1],
  modalView: { name: "" },
  setModalView: () => null,
  setPurchases: () => null,
  shuffleColors: () => null,
  purchases: []
})

export function AppWrapper({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [modalView, setModalView] = useState<View>({ name: "" })
  const provider = useProvider()

  const { address, connector } = useAccount()

  const [color1, setColor1] = useState([])
  const [color2, setColor2] = useState([])
  const [darkColor1, setDarkColor1] = useState([])
  const [darkColor2, setDarkColor2] = useState([])
  const [purchases, setPurchases] = useState<Purchase[]>(null)

  const shuffleColors = () => {
    const random1 = Math.floor(Math.random() * colorList.length)
    const random2 = Math.floor(Math.random() * colorList.length)
    setColor1(colorList[random1])
    setColor2(colorList[random2])
    setDarkColor1(darkColorList[random1])
    setDarkColor2(darkColorList[random2])

    let root = document.documentElement
    root.style.setProperty("--color1", colorList[random1][0])
    root.style.setProperty("--color2", colorList[random2][0])
    root.style.setProperty("--darkColor1", darkColorList[random1][0])
    root.style.setProperty("--darkColor2", darkColorList[random2][0])
  }

  useEffect(() => {
    shuffleColors()
  }, [])

  useEffect(() => {
    setPurchases(null)
    setIsConnected(address && true)
    if (address) {
      getPurchases(address, setPurchases)
    }
  }, [address])

  return (
    <AppContext.Provider
      value={{
        connector,
        provider,
        account: address,
        isConnected,
        color1,
        color2,
        darkColor1,
        darkColor2,
        modalView,
        setModalView,
        shuffleColors,
        purchases,
        setPurchases
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
