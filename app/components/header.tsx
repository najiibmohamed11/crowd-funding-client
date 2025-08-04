import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
import { SearchModal } from "./search-modal";
import { Button } from "@/components/ui/button";
import { useActiveAccount } from "thirdweb/react";
import { SiPolygon } from "react-icons/si"; // already imported

// Inside return, after <SearchModal />


export default function Header() {
  const account = useActiveAccount();
  
  return (
    <div className="container flex h-16 items-center justify-between gap-4 ">
      {/* Logo and Search Group */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="flex-shrink-0">
            <Image
              src="/sacid.svg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
        </Link>

        {/* Search Bar */}
        <div className="  w-[420px] lg:flex  hidden  ">
          <div className="relative flex w-full items-center">
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
              }
              className="relative flex w-full items-center"
            >
              <Input
                type="search"
                placeholder="Search documentation..."
                className="w-full rounded-md border-0 bg-gray-100 py-2 pl-4 pr-16 text-base shadow-sm ring-1 ring-gray-200 transition-all placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-300"
                readOnly
              />
              <div className="absolute right-2 flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 text-xs text-gray-500">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
            <SearchModal />
            <Link
            href="https://amoy.polygonscan.com/address/0xEEffd871b16eCFc2Eda84946Af61e1F8CcaF0029"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
          >
            <SiPolygon className="text-purple-600 w-4 h-4" />
            explorer
          </Link>

          </div>
        </div>
      </div>

      {/* Actions */}
            {/* Actions */}
<div className="flex items-center gap-3">
  <ConnectWallet />
  {account?.address && (
    <>
      <Link href="/dashboard">
        <Button className="h-10 rounded-md bg-black px-5 text-sm font-medium text-white hover:bg-black/90">
          Dashboard
        </Button>
      </Link>

  
    </>
  )}
</div>

      </div>
  );
}
