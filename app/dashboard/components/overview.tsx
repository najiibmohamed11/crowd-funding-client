import Image from "next/image";

export function Overview() {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <div className="space-y-4">
          <div className="bg-[#7C5CFC] rounded-2xl  h-[250px] text-white w-[200px]">
            <div className="flex flex-col justify-between items-center  p-6">
            <p className="text-lg mb-4  ">Last donation</p>
              <span className="text-5xl font-bold">$16</span>
            </div>
              <Image
              
                src="./cliem.svg"
                alt="Donation hand"
                width={200}
                height={200}
                // className="w-16 h-16 rounded-lg"
              />
          </div>
          <div className="bg-[#4318FF] rounded-2xl h-[250px] text-white w-[200px]">
            <div className="flex flex-col justify-center items-center  py-2">
            <p className="text-lg mb-4  ">Last donation</p>
              <span className="text-5xl font-bold p-0 m-0 ">$16</span>
            </div>
              <Image
              
                src="./avater-man.svg"
                alt="Donation hand"
                width={150}
                height={150}
                className="p-0 m-0"
              />
          </div>
        </div>
      </div>
    )
  }
  
  