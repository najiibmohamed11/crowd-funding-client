import { ConnectButton, lightTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../../../../crowd-funding-client/app/utility/constants";

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
      theme={lightTheme({
        colors: { accentText: "hsl(199, 95%, 71%)" },
      })}
      connectModal={{ size: "compact" }}
    />
  );
}
