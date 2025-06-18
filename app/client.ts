import { createThirdwebClient, getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});


export const contract =getContract({
  client,
  address: "0xdB3ddF6667E1b21258e89C506C034e4762a1F6f1",
  chain: polygonAmoy,
});