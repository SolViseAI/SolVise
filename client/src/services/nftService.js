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
      name: nft.data?.name || 'Unnamed NFT',
      image: nft.data?.uri || '',
      floorPrice: 0,
      collection: nft.data?.collection,
      attributes: nft.data?.attributes
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error(`Failed to fetch NFTs: ${error.message}`);
  }
}; 