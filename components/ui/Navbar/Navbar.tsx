import dynamic from "next/dynamic"
import Link from "next/link"
import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import { Container } from "@components/ui"
import { useAppContext } from "@components/ui/context"
import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import UserIcon from "@components/icons/UserIcon"
import saEvent from "@utils/saEvent"

const DropdownMenu = dynamic(() => import("@components/ui/DropdownMenu"), {
  ssr: false
})

const Navbar = () => {
  const { isConnected } = useAppContext()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="shadow-sm">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="flex items-center space-x-7 sm:space-x-10">
            <Link href="/">
              <a className="mb-1" aria-label="Slice logo">
                <Logo size="w-[24px]" />
              </a>
            </Link>
            <Link href="/slicer">
              <a>
                <p className="text-[0.925rem] font-normal">Explore</p>
              </a>
            </Link>
          </div>
          <div className="relative z-10 flex items-center space-x-6">
            <div>
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => saEvent("connect_wallet_attempt")}>
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full"
                }}
                chainStatus={{
                  smallScreen: "none",
                  largeScreen: "full"
                }}
              />
            </div>
            {isConnected && (
              <a
                onClick={() => setShowDropdown((showDropdown) => !showDropdown)}
              >
                <UserIcon />
              </a>
            )}
          </div>
          {showDropdown && (
            <DropdownMenu
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
