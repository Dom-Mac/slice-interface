import Cross from "@components/icons/Cross"
import { Dispatch, SetStateAction } from "react"
import {
  View,
  LOADING_VIEW,
  NETWORK_VIEW,
  CONNECT_VIEW,
  IRREVERSIBLE_VIEW,
  OWNERS_VIEW,
  CREATE_PRODUCT_VIEW,
  CREATE_PRODUCT_CONFIRM_VIEW,
  PRODUCT_VIEW,
  REDEEM_PRODUCT_VIEW,
  FINGERPRINTING_VIEW
} from "@lib/content/modals"

type Props = {
  modalView: View
  setModalView: Dispatch<SetStateAction<View>>
}

const Modal = ({ modalView, setModalView }: Props) => {
  let content: JSX.Element
  const { name, cross, params } = modalView

  switch (name) {
    case "LOADING_VIEW":
      content = LOADING_VIEW()
      break
    case "NETWORK_VIEW":
      content = NETWORK_VIEW()
      break
    case "CONNECT_VIEW":
      content = CONNECT_VIEW()
      break
    case "IRREVERSIBLE_VIEW":
      content = IRREVERSIBLE_VIEW()
      break
    case "OWNERS_VIEW":
      content = OWNERS_VIEW(params)
      break
    case "CREATE_PRODUCT_CONFIRM_VIEW":
      content = CREATE_PRODUCT_CONFIRM_VIEW(params)
      break
    case "CREATE_PRODUCT_VIEW":
      content = CREATE_PRODUCT_VIEW(params)
      break
    case "PRODUCT_VIEW":
      content = PRODUCT_VIEW(params)
      break
    case "REDEEM_PRODUCT_VIEW":
      content = REDEEM_PRODUCT_VIEW(params)
      break
    case "FINGERPRINTING_VIEW":
      content = FINGERPRINTING_VIEW()
      break
  }

  return (
    <div
      className={`fixed top-0 w-screen h-screen py-12 overflow-y-scroll xs:py-20 background-modal ${
        name === "NETWORK_VIEW" ? "z-100" : "z-50"
      }`}
    >
      <div
        className="absolute w-full h-full mt-[-3rem] xs:mt-[-5rem]"
        onClick={() => (cross ? setModalView({ name: "" }) : null)}
      />
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100%" }}
      >
        <div className="relative w-full px-4 py-16 mx-4 bg-white shadow-xl xs:py-20 xs:px-8 rounded-xl max-w-screen-xs">
          {cross && (
            <div className="absolute top-[24px] right-[24px]">
              <Cross
                className="text-right cursor-pointer hover:text-red-500"
                onClick={() => setModalView({ name: "" })}
              />
            </div>
          )}
          <div>{content}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
