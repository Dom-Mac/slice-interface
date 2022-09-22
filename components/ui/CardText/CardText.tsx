type Props = {
  label: string
  isActive: boolean
}

export default function CardText({ label, isActive }: Props) {
  return (
    <div
      className={`px-5 py-4 font-medium text-left border rounded-sm cursor-pointer shadow-light-focusable ${
        isActive
          ? "bg-blue-600 text-white border-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:text-white"
          : "hover:bg-gray-100"
      }`}
    >
      <p>{label}</p>
    </div>
  )
}
