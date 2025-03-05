import { Home, FileText, Users } from 'lucide-react'
import { useEffect, useState } from "react";
import { SiPolygon } from 'react-icons/si' // Using SiPolygon from react-icons

export function Statistics({ campaignData }) {
  console.log(campaignData, "campaig Data");
  const allCampaignDonators = campaignData.flatMap(
    (campaign) => campaign.donators
  );
  const [usdAmount, setUsdAmount] = useState(0);

  const TotallSpend = (allCampaignDonators: any[]) => {
    var total = 0;
    allCampaignDonators.forEach((donator) => {
      total += Number(donator.amount) / 1e18;
    });
    return total;
  };

  const confertMaticToUsdt = async (amount: number) => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
      );
      const data = await response.json();
      const price = data["matic-network"].usd;
      return amount * price;
    } catch (e) {
      console.error("there fetching issue", e);
      return 0.286;
    }
  };

  useEffect(() => {
    const totalSpend = TotallSpend(allCampaignDonators);
    confertMaticToUsdt(totalSpend).then(setUsdAmount);
  }, [allCampaignDonators]);

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Your statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5" />
            <span className="text-gray-500">Total incomes matic</span>
          </div>
          <div className="text-2xl font-medium text-red-500 flex gap-2 items-center"> <SiPolygon/> {TotallSpend(allCampaignDonators)}</div>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <span className="text-gray-500">Total incomes in dollar</span>
          </div>
          <div className="text-2xl font-medium text-blue-500">
            ${usdAmount.toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 flex flex-col ">
          <div className="flex items-center  gap-2 mb-4">
            <Users className="w-5 h-5" />
            <span className="text-gray-500">Total donators</span>
          </div>
          <div className="text-2xl font-medium text-purple-500 ">
            {allCampaignDonators.length}
          </div>
        </div>
      </div>
    </div>
  );
}

