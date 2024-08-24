// src/utils/getEthPrice.ts

export async function getEthPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy');
      const data = await response.json();
      return data.ethereum.jpy;
    } catch (error) {
      console.error('Failed to fetch ETH price:', error);
      throw error;
    }
  }
  
  export function jpyToEth(jpyAmount: number, ethPrice: number): string {
    const ethAmount = jpyAmount / ethPrice;
    return ethAmount.toFixed(18); // ETHは18桁の小数点精度を持つ
  }