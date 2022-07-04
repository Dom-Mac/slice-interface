import Link from "next/link"
import Chevron from "@components/icons/Chevron"
import ShoppingBag from "@components/icons/ShoppingBag"
import Spinner from "@components/icons/Spinner"
import { ProductCart } from "@lib/handleUpdateCart"
import fetcher from "@utils/fetcher"
import { Message } from "@utils/handleMessage"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import useSWR from "swr"
import { CartList } from ".."
import { useAppContext } from "../context"
import { updatePurchases } from "@utils/getPurchases"
import { utils } from "ethers"
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useSigner } from "wagmi"
import saEvent from "@utils/saEvent"

type Props = {
  cookieCart: ProductCart[]
  success: boolean
  setSuccess: Dispatch<SetStateAction<boolean>>
}

const FloatingCart = ({ cookieCart, success, setSuccess }: Props) => {
  const { setPurchases, purchases, setModalView, account } = useAppContext()
  const { data: signer } = useSigner()
  const addRecentTransaction = useAddRecentTransaction()
  const [cookies, setCookie, removeCookie] = useCookies(["cart"])
  const [showCartList, setShowCartList] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message>({
    message: "",
    messageStatus: "success"
  })

  const { data: ethUsd } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )

  const reducer = (previousValue: number, currentValue: ProductCart) => {
    const { quantity, price, isUSD, extCallValue } = currentValue
    const productPrice = isUSD
      ? Math.floor((price * 100) / Number(ethUsd?.price)) / 10000
      : Math.floor(price / 10 ** 14) / 10000
    const externalCallEth = utils.formatEther(extCallValue)
    return previousValue + (productPrice + Number(externalCallEth)) * quantity
  }
  const totalPrice: number = cookieCart?.reduce(reducer, 0) || 0

  useEffect(() => {
    if (cookieCart && cookieCart?.length != 0) {
      if (success) {
        setSuccess(false)
      }
      setShowCart(true)
    } else {
      setShowCart(false)
      setShowCartList(false)
    }
  }, [cookieCart])

  useEffect(() => {
    if (success) {
      const newPurchases = updatePurchases(cookieCart, purchases)
      setPurchases(newPurchases)
      removeCookie("cart")
    }
  }, [success])

  const handleCheckout = async () => {
    const handleSubmit = (await import("@utils/handleSubmit")).default
    const { PayProducts } = await import("@lib/handlers/chain")

    try {
      saEvent("checkout_cart_attempt")
      setLoading(true)
      await handleSubmit(
        PayProducts(signer, account, cookieCart),
        setMessage,
        setLoading,
        setSuccess,
        true,
        addRecentTransaction,
        "Checkout"
      )
      saEvent("checkout_cart_success")
      setModalView({ name: "" })
    } catch (err) {
      saEvent("checkout_cart_fail")
      console.log(err)
    }
  }

  return (
    <>
      {/* Todo: fix errors in console without breaking opacity transition */}
      {/* {showCart && showCartList && ( */}
      <div
        className={`fixed bottom-0 mb-[80px] sm:mb-[100px] right-[20px] sm:right-[32px] transition-opacity duration-200 ${
          showCart && showCartList ? "z-50 opacity-100" : "-z-10 opacity-0"
        }`}
      >
        <CartList
          cookieCart={cookieCart}
          ethUsd={ethUsd}
          setCookie={setCookie}
        />
      </div>
      {/* } */}
      {(showCart || loading || success) && (
        <div
          className={`fixed z-50 bottom-0 mb-[20px] sm:mb-[32px] right-[20px] sm:right-[32px] nightwind-prevent-block transition-opacity duration-200`}
          // ${
          //   showCart || loading || success
          //     ? "z-20 opacity-100"
          //     : "-z-10 opacity-0"
          // }
        >
          <div className="flex h-12 pl-3 overflow-hidden font-medium text-black bg-white border-2 border-transparent rounded-full shadow-base">
            <div
              className="flex items-center pl-2 pr-4 min-w-[100px] cursor-pointer group"
              onClick={() =>
                success
                  ? setSuccess(false)
                  : setShowCartList((showCartList) => !showCartList)
              }
            >
              {success ? (
                <p className="px-2 text-sm">Keep buying</p>
              ) : (
                <>
                  <Chevron
                    className={`h-5 transition-transform duration-200 ${
                      showCartList ? "rotate-90" : ""
                    } w-7`}
                  />
                  <p className="w-full ml-2 text-center">
                    Ξ {Math.round(totalPrice * 1000) / 1000}
                  </p>
                </>
              )}
            </div>
            <ConnectButton.Custom>
              {({ account, openConnectModal }) => (
                <div
                  className={`flex items-center h-full px-4 text-sm text-white transition-colors duration-150 bg-blue-600 ${
                    !loading ? "cursor-pointer hover:bg-green-500" : ""
                  } nightwind-prevent`}
                  onClick={
                    account
                      ? !loading
                        ? () => handleCheckout()
                        : null
                      : openConnectModal
                  }
                >
                  {success ? (
                    <Link href="/purchases">
                      <a className="px-2 text-white hover:text-white">
                        Go to purchases
                      </a>
                    </Link>
                  ) : loading ? (
                    <div className="px-4">
                      <Spinner color="text-white" />
                    </div>
                  ) : (
                    <>
                      <p className="pr-2 text-sm ">
                        {account ? "Checkout" : "Connect"}
                      </p>
                      <ShoppingBag className="w-[18px] h-[18px]" />{" "}
                    </>
                  )}
                </div>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingCart
