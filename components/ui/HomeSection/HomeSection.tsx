import { useAppContext } from "../context"

type Props = {
  text: JSX.Element
  image: JSX.Element
  side?: "left" | "right"
}

const HomeSection = ({ text, image, side = "left" }: Props) => {
  const { shuffleColors } = useAppContext()
  return (
    <div
      className={`flex flex-col ${
        side === "right" ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div
        className={`prose flex-1 text-left ${
          side === "right" ? "md:text-right" : ""
        }`}
      >
        {text}
      </div>
      <div className="flex-1 pt-16 md:max-w-[420px] md:pt-0">
        <div className="flex items-center justify-center w-full h-full ">
          <div className="cursor-pointer" onClick={() => shuffleColors()}>
            {image}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection
