'use client'
import { ConnectButton, lightTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../client";

import { polygonAmoy } from "thirdweb/chains";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function ConnectWallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={polygonAmoy}
      theme={lightTheme({
        colors: { accentText: "hsl(199, 95%, 71%)" },
      })}
      connectModal={{ size: "compact" }}
    />
  );
}
