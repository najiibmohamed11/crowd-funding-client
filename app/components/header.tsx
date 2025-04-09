import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";
import { SearchModal } from "./search-modal";
import logo from "@/public/light-logo.svg"
export default function Header() {
  return (
    <div className="container flex h-16 items-center justify-between gap-4 ">
      {/* Logo and Search Group */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="flex-shrink-0">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
        </Link>

        {/* Search Bar */}
        <div className="  w-[320px] lg:flex">
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
                placeholder="Do fundraise now"
                className="w-full rounded-full border-0 bg-gray-50/90 py-2 pl-4 pr-16 text-base shadow-sm ring-1 ring-gray-200 transition-all placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-100"
                readOnly
              />
              <div className="absolute right-2 flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 text-xs text-gray-500">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
            <SearchModal />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* <Button size="lg" className="">
          Start a campaign
        </Button> */}
        <ConnectWallet />
      </div>
    </div>
  );
}
