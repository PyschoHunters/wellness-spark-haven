import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FitChainOverview } from '@/components/blockchain/FitChainOverview';
import { ChallengeBoard } from '@/components/blockchain/ChallengeBoard';
import { FitTokenWallet } from '@/components/blockchain/FitTokenWallet';
import { NFTCollection } from '@/components/blockchain/NFTCollection';
import { MarketplaceExchange } from '@/components/blockchain/MarketplaceExchange';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coins as CoinsIcon, Trophy, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import StatsCard from '@/components/StatsCard';

const FitChain = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(1250);
  const [showNotification, setShowNotification] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate a notification after a short delay
    const timer = setTimeout(() => {
      setShowNotification(true);
      toast({
        title: "Daily Challenge Completed!",
        description: "+25 FTK added to your wallet",
        variant: "default",
      });
      setWalletBalance(prev => prev + 25);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Layout>
      <div 
        className="container max-w-7xl mx-auto px-4 py-8 space-y-6"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMTgyQ0UiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0xN3YxaC0yMHYtMWgyMHptMCA5djFoLTE0di0xaDE0eiIvPjwvZz48L2c+PC9zdmc+Cg==')",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FitChain: Blockchain Fitness Rewards
              </h1>
              <p className="text-muted-foreground">
                Earn FitTokens through workouts, challenges, and achievements. 
                Convert your fitness progress into digital assets on our blockchain network.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
              <div className="flex gap-1 items-center text-indigo-600 font-medium">
                <CoinsIcon className="h-4 w-4" />
                <span>{walletBalance} FTK</span>
              </div>
              
              <div className="h-4 w-px bg-indigo-200"></div>
              
              <div className="flex gap-1 items-center text-amber-600 font-medium">
                <Trophy className="h-4 w-4" />
                <span>Level 12</span>
              </div>
            </div>
          </div>
        </div>
        
        <FitChainOverview balance={walletBalance} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Weekly Token Earnings"
            value="325 FTK"
            icon={<CoinsIcon className="h-5 w-5 text-indigo-500" />}
            trend={{ value: 12, isPositive: true }}
            className="border-l-4 border-indigo-500"
          />
          
          <StatsCard
            title="Challenges Completed"
            value="7/10"
            icon={<Trophy className="h-5 w-5 text-amber-500" />}
            trend={{ value: 3, isPositive: true }}
            className="border-l-4 border-amber-500"
          />
          
          <StatsCard
            title="Achievement Rate"
            value="92%"
            icon={<AlertCircle className="h-5 w-5 text-emerald-500" />}
            trend={{ value: 5, isPositive: true }}
            className="border-l-4 border-emerald-500"
          />
        </div>
        
        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="nfts">NFT Rewards</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges" className="mt-6">
            <ChallengeBoard />
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-6">
            <FitTokenWallet />
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-6">
            <NFTCollection />
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-6">
            <MarketplaceExchange walletBalance={walletBalance} setWalletBalance={setWalletBalance} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FitChain;
