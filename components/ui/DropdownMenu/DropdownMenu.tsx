import { useTheme } from "next-themes"
import nightwind from "nightwind/helper"
import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import ShoppingBag from "@components/icons/ShoppingBag"
import { Dispatch, SetStateAction } from "react"
import { DropdownMenuElement } from ".."
import Banknotes from "@components/icons/Banknotes"
type Props = {
  showDropdown: boolean
  setShowDropdown: Dispatch<SetStateAction<boolean>>
}

function DropdownMenu({ showDropdown, setShowDropdown }: Props) {
  const { theme, setTheme } = useTheme()

  // const toggle = () => {
  //   nightwind.beforeTransition()
  //   if (theme !== "dark") {
  //     setTheme("dark")
  //   } else {
  //     setTheme("light")
  //   }
  // }

  return (
    <div
      className={`z-20 absolute top-0 right-0 w-56 p-1.5 mt-20 border border-opacity-80 border-gray-200 space-y-1 bg-white rounded-lg shadow-base transition-opacity duration-200 nightwind-prevent-block`}
    >
      <DropdownMenuElement
        href="/profile"
        image={
          <Logo
            size="w-5"
            margin="mt-[4px] ml-[5px]"
            interactive={false}
            single={true}
          />
        }
        label="My slicers"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href="/earnings"
        image={<Banknotes className="w-5 h-5" />}
        label="Earnings"
        onClick={() => setShowDropdown(false)}
      />
      <DropdownMenuElement
        href="/purchases"
        image={<ShoppingBag strokeWidth="1.5" className="w-5 h-5" />}
        label="Purchases"
        onClick={() => setShowDropdown(false)}
      />
      {/* <div className="xs:hidden">
        <DropdownMenuElement
          image={<Nightwind size="h-5" onClick={null} />}
          label="Toggle dark mode"
          onClick={() => toggle()}
        />
      </div> */}
    </div>
  )
}

export default DropdownMenu
