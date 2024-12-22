import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NFTAvatar = ({ address, size = "md", style = "pixel-art" }) => {
  // Available styles: 
  // 'pixel-art', 'bottts', 'avataaars', 'identicon', 'shapes'
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`;
  
  // Size variants
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={sizeClasses[size]}>

      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500">
              <div className="h-full w-full">
  
      <img
          src={avatarUrl}
          alt="NFT Avatar"
          className="h-full w-full rounded-full object-cover"
        />  
      </div>
            </AvatarFallback>
    </Avatar>
  );
};

export default NFTAvatar;