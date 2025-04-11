import Image from "next/image"
export function MobileApp() {
    return (
      <div className="bg-[#FF6B6B] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="max-w-[60%]">
          <h3 className="text-xl font-medium mb-4">
            Do you want exchange ?
          </h3>
          <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100">
            exchange
          </button>
        </div>
        <Image
        width={150}
        height={150}
        src='/exchange-avater.svg'
        alt="exchange avater"
        className="absolute bottom-0 right-0 w-32"
        />
      </div>
    )
  }
  
  