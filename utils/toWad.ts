import { ethers } from "ethers"

const toWad = (value: number) => {
  return ethers.BigNumber.from(10)
    .pow(13)
    .mul(Math.floor(value * 100000))
}

export default toWad
