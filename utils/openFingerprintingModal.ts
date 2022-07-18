import { View } from "@lib/content/modals"
import { Dispatch, SetStateAction } from "react"
import saEvent from "./saEvent"

const openFingerprintingModal = (
  err: Error,
  setModalView: Dispatch<SetStateAction<View>>
) => {
  // Handling fingerptinting error
  if (err.message.includes("fingerprinting")) {
    // Trigger an event to track how many users are most likely using Brave with shields enabled
    saEvent("create_product_fail_due_to_fingerprint")
    // Open modal with fingerprinting warning
    setModalView({ name: "FINGERPRINTING_VIEW", cross: true })
  }
}

export default openFingerprintingModal
