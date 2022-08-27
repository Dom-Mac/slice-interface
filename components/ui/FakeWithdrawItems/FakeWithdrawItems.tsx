import Download from "@components/icons/Download"

const FakeWithdrawItems = () => {
  return (
    <div>
      <div className="flex justify-between p-2 mb-4 border rounded-lg animate-pulse border-sky-400">
        <div className="flex items-center">
          <div className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded md:w-6 md:h-6 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></div>
          <div className="w-6 h-6 mx-2 bg-gray-100 rounded-full dark:bg-gray-700 md:w-10 md:h-10 md:mx-4"></div>
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
      <div className="flex justify-between p-2 mb-4 border rounded-lg opacity-80 opacity- animate-pulse border-sky-400">
        <div className="flex items-center">
          <div className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded md:w-6 md:h-6 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></div>
          <div className="w-6 h-6 mx-2 bg-gray-100 rounded-full dark:bg-gray-700 md:w-10 md:h-10 md:mx-4"></div>
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
      <div className="flex justify-between p-2 mb-4 border rounded-lg opacity-70 opacity- animate-pulse border-sky-400">
        <div className="flex items-center">
          <div className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded md:w-6 md:h-6 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></div>
          <div className="w-6 h-6 mx-2 bg-gray-100 rounded-full dark:bg-gray-700 md:w-10 md:h-10 md:mx-4"></div>
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
