const SinWave = ({ ...props }) => {
  return (
    <svg
      viewBox="0 0 104 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      stroke-width="7"
      {...props}
    >
      <path
        d="M2 20.3438C2 20.3438 12.3291 2.84375 27 2.84375C41.6709 2.84375 52 20.3438 52 20.3438"
        stroke="currentColor"
      />
      <path
        d="M52 20.3437C52 20.3437 62.3291 37.8438 77 37.8437C91.6709 37.8437 102 20.3437 102 20.3437"
        stroke="currentColor"
      />
    </svg>
  )
}

export default SinWave
