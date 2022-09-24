import Download from "@components/icons/Download"

const FakeWithdrawItems = () => {
  return (
    <div>
      <div className="flex justify-between px-4 py-3 mb-4 bg-white rounded-md shadow-md sm:px-6 animate-pulse">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded dark:bg-gray-700" />
          <div className="w-8 h-8 ml-4 mr-3 bg-gray-100 rounded-full dark:bg-gray-700" />
          <div className="pt-1 text-left">
            <p className="w-10 h-4 mb-1 bg-gray-100 rounded md:w-14 md:h-6 dark:bg-gray-700"></p>
            <p className="w-12 h-2 bg-gray-100 rounded md:w-20 md:h-4 dark:bg-gray-700"></p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="pt-1 pr-4 text-right">
            <p className="w-12 h-4 mb-1 bg-gray-100 rounded md:w-20 md:h-6 dark:bg-gray-700"></p>
            <p className="w-10 h-2 ml-2 bg-gray-100 rounded md:ml-6 md:w-14 md:h-4 dark:bg-gray-700"></p>
          </div>

          <Download className="h-6 text-gray-100 dark:text-gray-700 md:h-8 md:w-8" />
        </div>
      </div>
    </div>
  )
}

export default FakeWithdrawItems
