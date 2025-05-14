"use client";

import { useState } from "react";
import {
  Calendar,
  Upload,
  DollarSign,
  Clock,
  FileText,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useActiveAccount, useSendAndConfirmTransaction, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client,contract } from "@/app/client";
import ConnectWallet from "@/app/components/ConnectWallet";
import { SiPolygon } from 'react-icons/si' // Using SiPolygon from react-icons
import { useRouter,redirect } from "next/navigation";



export default function CreateCampaign() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [target, setTarget] = useState<number>(0);
  const [date, seDate] = useState<string>("");
  const account = useActiveAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(""); // Store Cloudinary URL
  const router=useRouter()
  const {
    mutateAsync: sendTransaction,
    isPending,
    isError,
    isSuccess,
  } = useSendAndConfirmTransaction();
  // Simulate form completion progress


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImgeTcloudinary = async (image: string | null) => {
    if (!image) {
      return;
    }
    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "crowdfunding");
      data.append("cloud_name", "dvgapjlqg");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvgapjlqg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const resJSON = await res.json();
      setImageUrl(resJSON.secure_url); // This is
      setIsUploading(false);
      console.log(resJSON.secure_url);
      return resJSON.secure_url;
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }
  };


  
  function convertDateToTimestamp(dateString: string) {
    // Parse the string into a JavaScript Date object
    const date = new Date(dateString);

    // Ensure the input is a valid date
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    // Convert the date to a Unix timestamp (in seconds)
    return Math.floor(date.getTime() / 1000);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account?.address) {
      alert("Please connect your wallet");
      return;
    }
    if ( !title || !story || !target || !date || !image) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      const uploadedImageUrl = await uploadImgeTcloudinary(image);
      if (!uploadedImageUrl) {
        console.log("Image upload failed");
        return;
      }
      
      const deadline = convertDateToTimestamp(date);
      const transaction = prepareContractCall({
        contract,
        method:"function createCampaign(address _owner, string _title, string _story, uint256 _target, uint256 _deadline, string _image) returns (uint256)",
        params: [account.address, title, story, BigInt(target), BigInt(deadline), uploadedImageUrl],
      });
      
    const receipt =await  sendTransaction(transaction);
    console.log(receipt.blockHash);
      router.push('/');
    } catch (error) {
      console.log("error during submission", error);
    }
  };
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];
  

  return (
    <>
   
      <div className="min-h-screen bg-gradient-to-br  p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-0 shadow-lg bg-gray-50 backdrop-blur-sm">
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Campaign Details
                </CardTitle>
                <CardDescription>
                  Fill in the information below to launch your campaign
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-4 flex h-5 w-5 items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      name="title"
                      placeholder="Campaign Title"
                      className="pl-10 h-14 text-lg border-2 hover:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Textarea
                      onChange={(e) => {
                        setStory(e.target.value);
                      }}
                      name="story"
                      placeholder="Tell your campaign story..."
                      className="min-h-[200px] border-2 hover:border-primary/50 transition-colors resize-none text-lg leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Target Amount
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center">
                        <SiPolygon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        onChange={(e) => {
                          setTarget(Number(e.target.value));
                        }}
                        name="target"
                        type="number"
                        placeholder="0.00"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  pl-10 h-12 border-2 hover:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Campaign Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        onChange={(e) => {
                          seDate(e.target.value);
                        }}
                        min={minDate}
                        name="deadline"
                        type="date"
                        className="pl-10 h-12 border-2 hover:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    Campaign Image
                  </label>
                  <div className="flex flex-col items-center justify-center gap-4">
                    {image ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                        <img
                          src={image}
                          alt="Campaign preview"
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setImage(null)}
                            className="bg-white/90 hover:bg-white"
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 transition-colors">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="p-4 rounded-full bg-primary/10">
                              <ImageIcon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Drop your image here or
                              </p>
                              <label className="text-sm text-primary cursor-pointer hover:text-primary/80">
                                browse files
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 1920x1080px or higher
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {isError ||
                      (isSuccess && (
                        <p
                          className={`text-lg ${
                            isError ? "text-red-600" : "text-green-600"
                          } `}
                        >
                          {isError ? "there is error" : "succesfuly created"}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading||isPending?'launching the comapaign....':' Launch Campaign'}
                   
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By creating a campaign, you agree to our Terms of Service
                    and Privacy Policy
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
