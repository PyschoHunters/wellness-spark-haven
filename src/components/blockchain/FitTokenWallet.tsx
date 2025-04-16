
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Wallet, QrCode, Copy, Send, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

export const FitTokenWallet: React.FC = () => {
  const [walletAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [sendAmount, setSendAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tab, setTab] = useState("balance");

  const transactions = [
    { 
      id: 1, 
      type: 'in', 
      amount: 120, 
      from: '0x3Fc...b8df', 
      to: walletAddress, 
      date: '2025-04-15 14:23', 
      status: 'completed',
      description: 'Workout Challenge Reward'
    },
    { 
      id: 2, 
      type: 'out', 
      amount: 50, 
      from: walletAddress, 
      to: '0x8Ab...5e21', 
      date: '2025-04-14 09:10', 
      status: 'completed',
      description: 'NFT Purchase'
    },
    { 
      id: 3, 
      type: 'in', 
      amount: 200, 
      from: '0xDc7...2a5F', 
      to: walletAddress, 
      date: '2025-04-12 16:45', 
      status: 'completed',
      description: 'Monthly Achievement Bonus'
    },
    { 
      id: 4, 
      type: 'in', 
      amount: 75, 
      from: '0xBc1...9dA2', 
      to: walletAddress, 
      date: '2025-04-10 11:32', 
      status: 'completed',
      description: 'Community Challenge Participation'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    // In a real app, add a toast notification here
    console.log("Address copied to clipboard");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would interact with a blockchain smart contract
    console.log(`Sending ${sendAmount} FTK to ${receiverAddress}`);
    // Reset form and show success message
    setSendAmount("");
    setReceiverAddress("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-indigo-500" />
              FitToken Wallet
            </span>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            Manage your FitTokens, view transactions, and transfer tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex-grow">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium opacity-80">Current Balance</span>
                  <span className="text-3xl font-bold">1,250 FTK</span>
                </div>
                <div className="flex justify-between mt-6">
                  <div>
                    <span className="text-xs opacity-80">USD Value</span>
                    <p className="text-sm font-medium">≈ $125.00</p>
                  </div>
                  <div>
                    <span className="text-xs opacity-80">Last Activity</span>
                    <p className="text-sm font-medium">2 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 bg-gray-50 rounded-xl p-4 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Wallet Address</span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-2 bg-white border rounded-md text-xs font-mono break-all">
                  {walletAddress}
                </div>
                <div className="flex justify-center mt-2">
                  <QrCode className="h-24 w-24 text-gray-400" />
                </div>
              </div>
            </div>
            
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="balance" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-green-500" />
                        Security Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-green-600 mb-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Wallet Secured</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your wallet is protected with blockchain encryption technology.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <ArrowUpRight className="mr-2 h-5 w-5 text-indigo-500" />
                        Token Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Total Earned</span>
                          <span className="text-xs font-medium">1,695 FTK</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Total Spent</span>
                          <span className="text-xs font-medium">445 FTK</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="send" className="space-y-4 py-4">
                <form onSubmit={handleSend}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="receiver">Receiver Address</Label>
                          <Input 
                            id="receiver" 
                            placeholder="0x..." 
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="amount" 
                              type="number"
                              min="1"
                              placeholder="0" 
                              value={sendAmount}
                              onChange={(e) => setSendAmount(e.target.value)}
                              required
                            />
                            <Select defaultValue="ftk">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ftk">FTK</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-3 bg-amber-50 border-amber-200">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div className="flex-1 text-sm text-amber-800">
                              <p className="font-medium mb-1">Important</p>
                              <p className="text-xs">
                                Token transfers are final and cannot be reversed. Please double-check the recipient address before sending.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Tokens
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 py-4">
                <div className="rounded-md border">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-medium">Recent Transactions</h3>
                  </div>
                  <div className="divide-y">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              tx.type === 'in' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-amber-100 text-amber-600'
                            }`}>
                              {tx.type === 'in' 
                                ? <ArrowDownLeft className="h-4 w-4" /> 
                                : <ArrowUpRight className="h-4 w-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              tx.type === 'in' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {tx.type === 'in' ? '+' : '-'}{tx.amount} FTK
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {tx.type === 'in' ? 'From: ' : 'To: '}
                              {tx.type === 'in' ? tx.from : tx.to}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
