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
  address: "0xBd47fCDa95E3Bc78d42B474847568319C463D7AE",
  chain: polygonAmoy,
});