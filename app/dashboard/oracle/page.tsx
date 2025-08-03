"use client"

import { useEffect, useState } from "react"
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react"
import { prepareContractCall } from "thirdweb"
import { contract } from "@/app/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  Shield, 
  DollarSign, 
  ArrowUpDown, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Building2,
  Users,
  FileText,
  Clock
} from "lucide-react"
import ConnectWallet from "../../components/ConnectWallet"

export default function OraclePage() {
  const account = useActiveAccount()
  const [amount, setAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [newOracleAddress, setNewOracleAddress] = useState("")
  const [copied, setCopied] = useState(false)

  // Oracle address
  const { data: oracleAddress } = useReadContract({
    contract,
    method: "function oracle() view returns (address)",
    params: [],
  })

  // Contract balance
  const { data: contractBalance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  })

  // Pending campaigns
  const { data: pendingCampaigns } = useReadContract({
    contract,
    method: "function getPendingCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  })

  // Rejected campaigns
  const { data: rejectedCampaigns } = useReadContract({
    contract,
    method: "function getRejectedCampaigns() view returns ((uint256 id, address owner, string title, string story, uint256 target, uint256 deadline, uint256 amountCollected, string image, (address donator, uint256 amount, string comment, string date)[] donators, bool isActive)[])",
    params: [],
  })

  const { mutate: sendTransaction } = useSendTransaction()

  const isOracle = account?.address && oracleAddress && 
    account.address.toLowerCase() === oracleAddress.toLowerCase()

  const handleFundEscrow = () => {
    if (!amount || parseFloat(amount) <= 0) return
    
    const transaction = prepareContractCall({
      contract,
      method: "function fundEscrow() payable",
      params: [],
      value: BigInt(parseFloat(amount) * 10**18), // Convert to wei
    })
    sendTransaction(transaction)
    setAmount("")
  }

  const handleWithdrawFromEscrow = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return
    
    const transaction = prepareContractCall({
      contract,
      method: "function withdrawFromEscrow(uint256 _amount)",
      params: [BigInt(parseFloat(withdrawAmount) * 10**18)], // Convert to wei
    })
    sendTransaction(transaction)
    setWithdrawAmount("")
  }

  const handleSetOracle = () => {
    if (!newOracleAddress) return
    
    const transaction = prepareContractCall({
      contract,
      method: "function setOracle(address _newOracle)",
      params: [newOracleAddress],
    })
    sendTransaction(transaction)
    setNewOracleAddress("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: bigint) => {
    return (Number(balance) / 10**18).toFixed(4)
  }

  // Handle wallet not connected state
  if (account?.address == null) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4 flex flex-col items-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Connect your wallet to access oracle management</p>
          <ConnectWallet />
        </Card>
      </main>
    )
  }

  // Handle non-oracle access
  if (!isOracle) {
    return (
      <main className="h-[80vh] flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center space-y-4 flex flex-col items-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold">Access Denied</h1>
          <p className="text-muted-foreground">Only the oracle can access this page</p>
          <Badge variant="outline" className="text-sm">
            Current Oracle: {oracleAddress ? formatAddress(oracleAddress) : "Loading..."}
          </Badge>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oracle Management</h1>
          <p className="text-gray-600">Manage contract funds, campaign approvals, and oracle settings</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Contract Balance Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Contract Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {contractBalance ? formatBalance(contractBalance) : "0.0000"} MATIC
                </div>
                <p className="text-purple-100 text-sm mt-1">Total contract funds available for EVC payments</p>
              </CardContent>
            </Card>

            {/* Fund Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5" />
                  Fund Management
                </CardTitle>
                <CardDescription>
                  Add or withdraw funds from the contract for EVC payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fund Contract */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">Add Funds</h3>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Amount in MATIC"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleFundEscrow} className="bg-green-600 hover:bg-green-700">
                      Add Funds
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Withdraw from Contract */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">Withdraw Funds</h3>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Amount in MATIC"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleWithdrawFromEscrow} 
                      variant="destructive"
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Oracle Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Oracle Settings
                </CardTitle>
                <CardDescription>
                  Transfer oracle privileges to another address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="New oracle address"
                    value={newOracleAddress}
                    onChange={(e) => setNewOracleAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSetOracle} variant="outline">
                    Transfer Oracle
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ⚠️ This action is irreversible. Make sure you trust the new oracle address.
                </p>
              </CardContent>
            </Card>

            {/* Contract Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contract Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Contract Address:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm">{contract.address}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(contract.address)}
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Current Oracle:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm">{oracleAddress ? formatAddress(oracleAddress) : "Loading..."}</code>
                    {oracleAddress && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(oracleAddress)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Network:</span>
                  <Badge variant="outline">{contract.chain.name}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Oracle Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Oracle Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    O
                  </div>
                  <div>
                    <p className="font-medium">Oracle Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {account?.address ? formatAddress(account.address) : "Loading..."}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <Badge className="bg-green-100 text-green-800">Oracle</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Campaign Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {pendingCampaigns ? pendingCampaigns.length : 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Rejected</span>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {rejectedCampaigns ? rejectedCampaigns.length : 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/dashboard/settings" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Review Pending Campaigns
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  View All Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 