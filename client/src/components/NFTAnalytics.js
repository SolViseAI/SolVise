import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getNFTs } from '../services/nftService';

function NFTAnalytics() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicKey) {
      loadNFTData();
    }
  }, [publicKey]);

  const loadNFTData = async () => {
    try {
      const userNFTs = await getNFTs(publicKey.toString());
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error loading NFT data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading NFTs...</div>;

  return (
    <div className="nft-analytics">
      <h2>NFT Portfolio</h2>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.mint} className="nft-card">
            <img src={nft.image} alt={nft.name} />
            <h3>{nft.name}</h3>
            <p>Floor Price: {nft.floorPrice} SOL</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NFTAnalytics; 