"use server";
import {  prepareContractCall, sendTransaction } from "thirdweb";
import { polygon } from "thirdweb/chains"; // or your target chain
import { client,contract } from "../client";
import { privateKeyAccount } from "thirdweb/wallets";

export const donation = async (
  campaignId,
  donor,
  amountInWei,
  comment,
  date,
  evcTransactionId,
) => {
  try {
    // Verify payment through your API here
    const paymentVerified = true; // Replace with your actual API check

    if (!paymentVerified) {
      throw new Error("Payment not verified");
    }

    if (!process.env.PRIVATE_KEY) {
      throw new Error("Private key not configured");
    }

    // Initialize wallet with private key
    const wallet = privateKeyAccount({
      client,
      privateKey: process.env.PRIVATE_KEY,
      
    });

    // Prepare and send transaction
    const transaction = await prepareContractCall({
      contract,
      method:"function donateWithEvc(uint256 _campaignId, address _donor, uint256 _amountInWei, string _comment, string _date, string _evcTransactionId)",

      params: [
        BigInt(campaignId),
        donor,
        BigInt(amountInWei),
        comment,
        date,
        evcTransactionId,
      ],
    });

    const { transactionHash } = await sendTransaction({
      transaction,
      account: wallet,
    });

    return { success: true, transactionHash };
  } catch (error) {
    console.error("Donation error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};