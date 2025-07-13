"use client";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { contract } from "@/app/client";
import { prepareContractCall } from "thirdweb";
import ConnectWallet from "@/app/components/ConnectWallet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function ApprovalPage() {
  const account = useActiveAccount();
  const { data: oracleAddress, isPending: isOracleLoading } = useReadContract({
    contract,
    method: "function oracle() view returns (address)",
    params: [],
  });
  const isOracle =
    account?.address &&
    oracleAddress &&
    account.address.toLowerCase() === oracleAddress.toLowerCase();

  const { data: pendingCampaigns, isPending: isPendingCampaigns, refetch } = useReadContract({
    contract,
    method:
      "function getPendingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date, string paymentMethod)[] donators, bool isActive, bool approved)[])",
    params: [],
  });

  const { mutate: sendTransaction, isPending: isApproving, data: txResult } = useSendTransaction();
  const [approvingId, setApprovingId] = useState<string | number | null>(null);
  const [copied, setCopied] = useState<string | number | null>(null);

  const handleApprove = (id: string | number) => {
    setApprovingId(id);
    const transaction = prepareContractCall({
      contract,
      method: "function approveCampaign(uint256 _campaignId)",
      params: [id],
    });
    sendTransaction(transaction, {
      onSuccess: () => {
        setApprovingId(null);
        refetch();
      },
      onError: () => setApprovingId(null),
    });
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!account?.address) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Only the oracle can approve campaigns.</p>
          <ConnectWallet />
        </Card>
      </div>
    );
  }

  if (isOracleLoading || isPendingCampaigns) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isOracle) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pending Campaign Approvals</h1>
      {(!pendingCampaigns || pendingCampaigns.length === 0) ? (
        <div className="flex justify-center items-center h-[60vh] text-xl text-muted-foreground">No campaigns waiting for approval.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingCampaigns.map((campaign) => (
            <Card key={String(campaign.id)} className="p-6 flex flex-col gap-4 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <Image src={campaign.image || "/placeholder.svg"} alt={campaign.title} width={200} height={120} className="rounded-xl object-cover" />
                <h2 className="text-xl font-semibold mt-2">{campaign.title}</h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>By:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all cursor-pointer" title={campaign.owner}>
                    {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                  </span>
                  <button
                    onClick={() => handleCopy(campaign.owner)}
                    className="ml-1 p-1 rounded hover:bg-gray-200 transition"
                    title="Copy address"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                  {copied === campaign.owner && (
                    <span className="text-green-500 text-xs ml-1">Copied!</span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">Target: {campaign.target} MATIC</div>
                <div className="text-gray-500 text-xs">Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}</div>
                <p className="text-gray-700 text-sm mt-2 line-clamp-3">{campaign.story}</p>
              </div>
              <Button
                onClick={() => handleApprove(String(campaign.id))}
                disabled={isApproving && approvingId === String(campaign.id)}
                className="mt-4 w-full bg-black hover:bg-gray-900 text-white rounded-lg"
              >
                {isApproving && approvingId === String(campaign.id) ? "Approving..." : "Approve"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}