// components/ThirdwebProviderWrapper.tsx
"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { ReactNode } from "react";
import { sepolia } from "thirdweb/chains";

export default function ThirdwebProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThirdwebProvider 
    >
      {children}
    </ThirdwebProvider>
  );
}