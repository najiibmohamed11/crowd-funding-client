'use client'

import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Predefined color palettes for web3-style gradients
const WEB3_PALETTES = [
  { from: '#FF8F71', to: '#EF2D1A' },  // Warm orange to red
  { from: '#7F7FD5', to: '#91EAE4' },  // Electric blue to cyan
  { from: '#4776E6', to: '#8E54E9' },  // Royal blue to purple
  { from: '#00F5A0', to: '#00D9F5' },  // Neon green to cyan
  { from: '#FF6B6B', to: '#556270' },  // Coral to slate
  { from: '#FFD700', to: '#FF8C00' },  // Gold to dark orange
  { from: '#7303c0', to: '#ec38bc' },  // Deep purple to pink
  { from: '#38ef7d', to: '#11998e' },  // Bright green to teal
  { from: '#FC466B', to: '#3F5EFB' },  // Pink to blue
  { from: '#1ed7b5', to: '#f0c808' },  // Teal to yellow
]

// Pattern types for more variety
const PATTERN_TYPES = ['gradient', 'geometric', 'rings'] as const

interface Web3AvatarProps {
  address: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  pattern?: typeof PATTERN_TYPES[number]
}

const Web3Avatar = ({ 
  address, 
  size = "md",
  pattern = 'gradient'
}: Web3AvatarProps) => {
  // Generate deterministic index based on address
  const getIndex = (addr: string) => {
    const hash = addr.toLowerCase().split('').reduce((a, b) => {
      return a + b.charCodeAt(0)
    }, 0)
    return hash % WEB3_PALETTES.length
  }

  // Get palette based on address
  const getPalette = (addr: string) => {
    const index = getIndex(addr)
    return WEB3_PALETTES[index]
  }

  const { from, to } = getPalette(address || '0x0000000000000000000000000000000000000000')
    // Available styles: 
  // 'pixel-art', 'bottts', 'avataaars', 'identicon', 'shapes'
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`;
  
  // Size variants with xl option
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }

  // Generate pattern based on type
  const getPattern = () => {
    switch (pattern) {
      case 'geometric':
        return {
          background: `${from}`,
          backgroundImage: `
            linear-gradient(120deg, ${from} 25%, transparent 25%),
            linear-gradient(210deg, ${from} 25%, transparent 25%),
            linear-gradient(0deg, ${to} 25%, transparent 25%),
            linear-gradient(300deg, ${to} 25%, transparent 25%)
          `,
          backgroundSize: '50% 50%'
        }
      case 'rings':
        return {
          background: `
            radial-gradient(circle at 100%, ${from} 0%, ${from} 10%, ${to} 10%, ${to} 20%, ${from} 20%, ${from} 30%, ${to} 30%, ${to} 40%, ${from} 40%, ${from} 50%, ${to} 50%, ${to} 60%, ${from} 60%, ${from} 70%, ${to} 70%, ${to} 80%, ${from} 80%, ${from} 90%, ${to} 90%)
          `,
          backgroundSize: '100% 100%'
        }
      default:
        return {
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }
    }
  }

  return (
    <Avatar className={`${sizeClasses[size]} ring-2 ring-white/10`}>
      <AvatarFallback 
        className="rounded-full"
        style={getPattern()}
      >
             <img
          src={avatarUrl}
          alt="NFT Avatar"
          className="h-full w-full rounded-full object-cover"
        />  
        {/* {address.slice(2, 4).toUpperCase()} */}
      </AvatarFallback>
    </Avatar>
  )
}

export default Web3Avatar

