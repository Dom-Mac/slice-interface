import { Banner, Carousel } from "@components/ui"

const Examples = () => {
  return (
    <Banner color="bg-transparent" id="examples" title="Examples">
      <div className="max-w-screen-lg mx-auto md:px-6">
        <Carousel />
      </div>
    </Banner>
  )
}

export default Examples
