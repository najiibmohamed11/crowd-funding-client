"use server";
import {  prepareContractCall, sendTransaction } from "thirdweb";
import { polygon } from "thirdweb/chains"; // or your target chain
import { client,contract } from "../client";
import { privateKeyAccount } from "thirdweb/wallets";
import {payByWaafiPay,formatMerchantPhone} from "evc-plus"

export const evcPaying=async(phoneNumber:string,evcAmount:number)=>{
  try{
    if(!phoneNumber||!evcAmount){
      return {succes:false,message:"required fild is missing"}
    }
    const response= await payByWaafiPay({
        phone: phoneNumber,
        amount: evcAmount,
        merchantUid: process.env.MERCHANT_UID, //Ask User Provider Like Hormuud
        apiUserId: process.env.API_USER_ID,  //Ask User Provider Like Hormuud
        apiKey: process.env.API_KEY, //Ask User Provider Like Hormuud
        description: 'Payment description',
        invoiceId: '12345',
        referenceId: 'abc123',
    })
    return response

  }catch(e){
    console.log(e)
    return {succes:false,message:"some thing when wrong during payment"}
  }

}


export const donation = async (
  campaignId:bigint,
  donor:string,
  amountInWei:string,
  comment:string,
  date:string,
  phoneNumber:string,
  evcAmount:number
) => {
  try {

   const isPaymentVerified=await evcPaying(phoneNumber,evcAmount)

    if (!isPaymentVerified) {
      console.log(isPaymentVerified)
      throw new Error(isPaymentVerified);
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
       campaignId,
        donor,
        BigInt(amountInWei),
        comment,
        date,
        "evcTransactionId",
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