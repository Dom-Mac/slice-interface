import { Dispatch, SetStateAction } from "react"
import { Input, InputSwitch } from "@components/ui"

type Props = {
  isMultiple: boolean
  isLimited: boolean
  units: number
  maxUnits: number
  setIsMultiple: Dispatch<SetStateAction<boolean>>
  setIsLimited: Dispatch<SetStateAction<boolean>>
  setUnits: Dispatch<SetStateAction<number>>
  setMaxUnits: Dispatch<SetStateAction<number>>
}

const AddProductFormAvailability = ({
  isMultiple,
  isLimited,
  units,
  maxUnits,
  setIsMultiple,
  setIsLimited,
  setUnits,
  setMaxUnits
}: Props) => {
  return (
    <>
      <div>
        <InputSwitch
          label="Allow multiple purchases"
          questionText={
            <>
              <p>
                If enabled, a buyer will be able to buy more than one unit of
                this product.
              </p>
            </>
          }
          enabled={isMultiple}
          setEnabled={setIsMultiple}
        />
        {isMultiple && (
          <div className="pt-5 pb-2">
            <Input
              label="Max units per buyer (up to 255)"
              placeholder="Leave blank for unlimited"
              type="number"
              min={0}
              max={255}
              value={maxUnits == 0 ? "" : maxUnits}
              error={maxUnits > 255}
              onChange={setMaxUnits}
            />
          </div>
        )}
        <InputSwitch
          label="Limited availability"
          questionText={
            <>
              <p>
                If enabled, purchases will be disabled once available units drop
                to 0.
              </p>
              <p>
                <b>Note:</b> As a creator, you will be able to set a new amount
                of available units.
              </p>
            </>
          }
          enabled={isLimited}
          setEnabled={setIsLimited}
        />
        {isLimited && (
          <div className="pt-5 pb-2">
            <Input
              label="Available units for sale"
              type="number"
              min={0}
              max={4000000000}
              value={units}
              onChange={setUnits}
              required={isLimited}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AddProductFormAvailability
