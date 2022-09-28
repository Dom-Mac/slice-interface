import { BigNumberish, utils } from "ethers"

const getEthFromWei = (weiAmount: BigNumberish, noString = false) => {
  const ethAmount = weiAmount
    ? Math.floor(Number(utils.formatEther(weiAmount)) * 10000) / 10000
    : null

  if (noString) {
    return weiAmount ? (ethAmount != 0 ? ethAmount : null) : null
  } else {
    return weiAmount ? (ethAmount != 0 ? ethAmount : "~0") : null
  }
}

export default getEthFromWei
