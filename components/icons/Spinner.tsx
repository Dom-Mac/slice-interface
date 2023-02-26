import { useEffect, useState } from "react"

const Spinner = ({ className = "" }) => {
  const [activeSlice, setActiveSlice] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlice((prev) => (prev === 6 ? 1 : prev + 1))
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const calculateOpacity = (slice: number) => {
    if (slice === activeSlice) {
      return 1
    } else if (
      slice === activeSlice - 1 ||
      (slice === 6 && activeSlice === 1)
    ) {
      return 0.6
    } else if (
      slice === activeSlice - 2 ||
      (slice === 6 && activeSlice === 2)
    ) {
      return 0.3
    } else {
      return 0
    }
  }

  return (
    <svg
      width="646"
      height="599"
      viewBox="0 0 646 599"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "h-5 w-5"}
    >
      <path
        d="M203.784 50.426L310.008 234.488C315.781 244.491 330.219 244.491 335.992 234.488L442.297 50.2858C449.012 38.6497 445.807 24.1934 433.443 18.9377C413.325 10.3861 377.69 1.73792e-05 323.271 0C268.841 -1.73826e-05 233.015 10.3902 212.745 18.9427C200.302 24.1926 197.033 38.7293 203.784 50.426Z"
        fill="currentColor"
        opacity={calculateOpacity(1)}
      />
      <path
        d="M476.359 75.6518L370.068 259.676C364.292 269.677 371.511 282.181 383.06 282.178L595.737 282.14C609.172 282.138 620.089 272.134 618.458 258.799C615.805 237.1 606.982 201.046 579.773 153.918C552.558 106.78 525.646 80.9487 508.105 67.6706C497.337 59.52 483.113 63.9575 476.359 75.6518Z"
        fill="currentColor"
        opacity={calculateOpacity(2)}
      />
      <path
        d="M476.359 522.997L370.068 338.972C364.292 328.971 371.511 316.468 383.06 316.47L595.737 316.508C609.172 316.511 620.089 326.515 618.458 339.85C615.805 361.548 606.982 397.602 579.773 444.731C552.558 491.869 525.646 517.7 508.105 530.978C497.337 539.129 483.113 534.691 476.359 522.997Z"
        fill="currentColor"
        opacity={calculateOpacity(3)}
      />
      <path
        d="M203.784 548.223L310.008 364.16C315.781 354.157 330.219 354.157 335.992 364.16L442.297 548.363C449.012 559.999 445.807 574.455 433.443 579.711C413.325 588.262 377.69 598.649 323.271 598.649C268.841 598.649 233.015 588.258 212.745 579.706C200.302 574.456 197.033 559.919 203.784 548.223Z"
        fill="currentColor"
        opacity={calculateOpacity(4)}
      />
      <path
        d="M168.645 522.997L274.935 338.972C280.711 328.971 273.493 316.468 261.943 316.47L49.2664 316.508C35.8316 316.511 24.9147 326.515 26.5452 339.85C29.1982 361.548 38.0212 397.602 65.2308 444.731C92.4458 491.869 119.357 517.7 136.899 530.978C147.667 539.129 161.89 534.691 168.645 522.997Z"
        fill="currentColor"
        opacity={calculateOpacity(5)}
      />
      <path
        d="M168.645 75.6518L274.935 259.676C280.711 269.677 273.493 282.181 261.943 282.178L49.2664 282.14C35.8316 282.138 24.9147 272.134 26.5452 258.799C29.1982 237.1 38.0212 201.046 65.2308 153.918C92.4458 106.78 119.357 80.9487 136.899 67.6706C147.667 59.52 161.89 63.9575 168.645 75.6518Z"
        fill="currentColor"
        opacity={calculateOpacity(6)}
      />
    </svg>
  )
}

export default Spinner
