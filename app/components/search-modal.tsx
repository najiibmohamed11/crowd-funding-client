"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useReadContract } from "thirdweb/react";
import { client } from "../client";
import { getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";

interface Campaign {
  id: string;
  title: string;
  creator: string;
  image: string;
  raised: number;
  goal: number;
}

const contract = getContract({
  client,
  address: "0xF0925dCe1A9FDC060ff8b9abD9fb8eE8E7D4765c",
  chain: polygonAmoy,
});

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
    "function getOngoingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  });

  const filteredCampaigns = React.useMemo(() => {
    if (!data) return [];
    return data.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(search.toLowerCase()) ||
        campaign.owner.toLowerCase().includes(search.toLowerCase()) ||
        campaign.story.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading&&open)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">Loading campaigns...</div>
      </div>
    );

  if (error&&open)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10 text-red-500">
          Error loading campaigns: {error.message}
        </div>
      </div>
    );

  if (!data&&open)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">No data available.</div>
      </div>
    );

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="max-w-4xl">
      <Command className="rounded-xl border shadow-xl bg-white/90 backdrop-blur-sm">
      <CommandInput
          placeholder="Search campaigns..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[70vh] overflow-y-auto py-2">
          <CommandEmpty className="py-12 text-center text-lg text-muted-foreground">
            No campaigns found. Try a different search term.
          </CommandEmpty>
          <CommandGroup heading="Campaigns" className="px-2">
            {filteredCampaigns.map((campaign, key) => (
              <CommandItem
                key={key}
                onSelect={() => {
                  window.location.href = `/campaign/${key}`;
                }}
                className="flex items-center gap-6 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="h-24 w-32 overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex items-start justify-between">
                    <span className="text-xl font-semibold tracking-tight">
                      {campaign.title}
                    </span>
         
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    {campaign.owner}
                  </span>

                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <div className="border-t p-4 text-sm text-muted-foreground text-center">
          Press <kbd className="px-2 py-1 rounded bg-gray-100">ESC</kbd> to
          close,
          <kbd className="px-2 py-1 rounded bg-gray-100 ml-1">↵</kbd> to select
        </div>
      </Command>
    </CommandDialog>
  );
}
