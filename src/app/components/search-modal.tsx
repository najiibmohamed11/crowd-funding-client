"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from 'lucide-react'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface Campaign {
  id: string
  title: string
  creator: string
  image: string
  raised: number
  goal: number
}

// This would come from your actual data source
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Powered Kits Learning Boxes",
    creator: "Mahfuzul Nabil",
    image: "/placeholder.svg",
    raised: 1900,
    goal: 2000,
  },
  {
    id: "1",
    title: "Powered Kits Learning Boxes",
    creator: "Mahfuzul Nabil",
    image: "/placeholder.svg",
    raised: 1900,
    goal: 2000,
  },
  // Add more mock campaigns as needed
]

export function SearchModal() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filteredCampaigns = mockCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(search.toLowerCase()) ||
    campaign.creator.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search campaigns..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Campaigns">
            {filteredCampaigns.map((campaign) => (
              <CommandItem
                key={campaign.id}
                onSelect={() => {
                  // Handle navigation to campaign
                  window.location.href = `/campaign/${campaign.id}`
                }}
                className="flex items-center gap-4 p-4"
              >
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{campaign.title}</span>
                  <span className="text-sm text-muted-foreground">
                    by {campaign.creator}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${campaign.raised} raised of ${campaign.goal}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

