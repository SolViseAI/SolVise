import { getParsedNftAccountsByOwner } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL);

export const getNFTs = async (walletAddress) => {
  try {
    const nftAccounts = await getParsedNftAccountsByOwner({
      publicAddress: walletAddress,
      connection
    });

    return nftAccounts.map(nft => ({
      mint: nft.mint,
      name: nft.data.name,
      image: nft.data.uri,
      floorPrice: 0 // You would need to fetch this from a marketplace API
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
}; 