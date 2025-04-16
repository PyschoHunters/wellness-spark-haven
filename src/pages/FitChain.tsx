
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { FitChainOverview } from '@/components/blockchain/FitChainOverview';
import { ChallengeBoard } from '@/components/blockchain/ChallengeBoard';
import { FitTokenWallet } from '@/components/blockchain/FitTokenWallet';
import { NFTCollection } from '@/components/blockchain/NFTCollection';
import { MarketplaceExchange } from '@/components/blockchain/MarketplaceExchange';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';

const FitChain = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
        </div>
        
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">FitChain: Blockchain Fitness Rewards</h1>
          <p className="text-muted-foreground">
            Earn FitTokens through workouts, challenges, and achievements. 
            Convert your fitness progress into digital assets on our blockchain network.
          </p>
        </div>
        
        <FitChainOverview />
        
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
            <MarketplaceExchange />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FitChain;
