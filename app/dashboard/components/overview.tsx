import Image from "next/image";
import { SiPolygon } from "react-icons/si"; // Using SiPolygon from react-icons
import { TfiAnnouncement } from "react-icons/tfi";

export function Overview({ campaigns }) {
  // Flatten all donations into a single array
  const allDonations = campaigns.flatMap((campaign) => campaign.donators);

  // Find the latest donation by date
  const latestDonation = allDonations.reduce(
    (latest, donation) => {
      const donationDate = new Date(donation.date);
      console.log("donationDate",donationDate )
      console.log("latest",latest.date )
      return donationDate > latest.date
        ? { ...donation, date: donationDate }
        : latest;
    },
    { date: new Date(0) }
  ); // Initialize with a very old date

  // Format the donation amount from wei to Ether (assuming 1 ETH = 1e18 wei)
  const donationAmount = latestDonation.amount
    ? (parseFloat(latestDonation.amount) / 1e18).toFixed(0)
    : "0";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Overview</h2>
      <div className="space-y-4">
        {/* Display the latest donation if it exists */}
        {latestDonation.date ? (
          <div className="bg-[#7C5CFC] rounded-2xl h-[250px] text-white w-[200px]">
            <div className="flex flex-col justify-between items-center p-6">
              <p className="text-lg mb-4">Latest Donation</p>
              <span className="text-5xl font-bold flex justify-end items-center gap-2">
                <SiPolygon />
                {donationAmount}
              </span>
            </div>
            <Image
              src="./cliem.svg"
              alt="Donation hand"
              width={200}
              height={200}
            />
          </div>
        ) : (
          <p>No donations available.</p>
        )}
        <div className="bg-[#4318FF] rounded-2xl h-[250px] text-white w-[200px]">
          <div className="flex flex-col justify-center items-center py-2">
            <p className="text-lg mb-4">Active Campaigns</p>
            <span className="text-5xl font-bold flex justify-end items-center gap-2">
              <TfiAnnouncement />
              {campaigns.length}
            </span>
          </div>
          <Image
            src="./avater-man.svg"
            alt="Donation hand"
            width={150}
            height={150}
            className="p-0 m-0"
          />
        </div>
      </div>
    </div>
  );
}
  
  