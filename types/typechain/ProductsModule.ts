/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type SubSlicerProductStruct = {
  subSlicerId: BigNumberish;
  subProductId: BigNumberish;
};

export type SubSlicerProductStructOutput = [BigNumber, number] & {
  subSlicerId: BigNumber;
  subProductId: number;
};

export type CurrencyPriceStruct = {
  value: BigNumberish;
  dynamicPricing: boolean;
  externalAddress: string;
  currency: string;
};

export type CurrencyPriceStructOutput = [BigNumber, boolean, string, string] & {
  value: BigNumber;
  dynamicPricing: boolean;
  externalAddress: string;
  currency: string;
};

export type ProductParamsStruct = {
  subSlicerProducts: SubSlicerProductStruct[];
  currencyPrices: CurrencyPriceStruct[];
  data: BytesLike;
  purchaseData: BytesLike;
  availableUnits: BigNumberish;
  maxUnitsPerBuyer: BigNumberish;
  isFree: boolean;
  isInfinite: boolean;
  isExternalCallPaymentRelative: boolean;
  isExternalCallPreferredToken: boolean;
};

export type ProductParamsStructOutput = [
  SubSlicerProductStructOutput[],
  CurrencyPriceStructOutput[],
  string,
  string,
  number,
  number,
  boolean,
  boolean,
  boolean,
  boolean
] & {
  subSlicerProducts: SubSlicerProductStructOutput[];
  currencyPrices: CurrencyPriceStructOutput[];
  data: string;
  purchaseData: string;
  availableUnits: number;
  maxUnitsPerBuyer: number;
  isFree: boolean;
  isInfinite: boolean;
  isExternalCallPaymentRelative: boolean;
  isExternalCallPreferredToken: boolean;
};

export type FunctionStruct = {
  data: BytesLike;
  value: BigNumberish;
  externalAddress: string;
  checkFunctionSignature: BytesLike;
  execFunctionSignature: BytesLike;
};

export type FunctionStructOutput = [
  string,
  BigNumber,
  string,
  string,
  string
] & {
  data: string;
  value: BigNumber;
  externalAddress: string;
  checkFunctionSignature: string;
  execFunctionSignature: string;
};

export type PriceStruct = {
  eth: BigNumberish;
  currency: BigNumberish;
  ethExternalCall: BigNumberish;
  currencyExternalCall: BigNumberish;
};

export type PriceStructOutput = [BigNumber, BigNumber, BigNumber, BigNumber] & {
  eth: BigNumber;
  currency: BigNumber;
  ethExternalCall: BigNumber;
  currencyExternalCall: BigNumber;
};

export type PurchaseParamsStruct = {
  slicerId: BigNumberish;
  quantity: BigNumberish;
  currency: string;
  productId: BigNumberish;
  buyerCustomData: BytesLike;
};

export type PurchaseParamsStructOutput = [
  BigNumber,
  number,
  string,
  number,
  string
] & {
  slicerId: BigNumber;
  quantity: number;
  currency: string;
  productId: number;
  buyerCustomData: string;
};

export interface ProductsModuleInterface extends utils.Interface {
  contractName: "ProductsModule";
  functions: {
    "_togglePause()": FunctionFragment;
    "addProduct(uint256,((uint128,uint32)[],(uint248,bool,address,address)[],bytes,bytes,uint32,uint8,bool,bool,bool,bool),(bytes,uint256,address,bytes4,bytes4))": FunctionFragment;
    "availableUnits(uint256,uint256)": FunctionFragment;
    "ethBalance(uint256)": FunctionFragment;
    "initialize()": FunctionFragment;
    "isProductOwner(uint256,uint256,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "paused()": FunctionFragment;
    "payProducts(address,(uint128,uint32,address,uint32,bytes)[])": FunctionFragment;
    "productPrice(uint256,uint256,address,uint256,address,bytes)": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "releaseEthToSlicer(uint256)": FunctionFragment;
    "removeProduct(uint256,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setProductInfo(uint256,uint256,uint8,bool,bool,uint32,(uint248,bool,address,address)[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
    "validatePurchase(uint256,uint256)": FunctionFragment;
    "validatePurchaseUnits(address,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_togglePause",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addProduct",
    values: [BigNumberish, ProductParamsStruct, FunctionStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "availableUnits",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ethBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isProductOwner",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payProducts",
    values: [string, PurchaseParamsStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "productPrice",
    values: [
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      string,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "releaseEthToSlicer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeProduct",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setProductInfo",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      boolean,
      BigNumberish,
      CurrencyPriceStruct[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validatePurchase",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "validatePurchaseUnits",
    values: [string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "_togglePause",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addProduct", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "availableUnits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ethBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isProductOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "payProducts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "productPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "releaseEthToSlicer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeProduct",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProductInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePurchase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePurchaseUnits",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "ERC1155ListingChanged(uint256,address,uint256,uint256)": EventFragment;
    "ERC721ListingChanged(uint256,address,uint256,bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "ProductAdded(uint256,uint256,uint256,address,tuple,tuple)": EventFragment;
    "ProductInfoChanged(uint256,uint256,uint8,bool,bool,uint256,tuple[])": EventFragment;
    "ProductPaid(uint256,uint256,uint256,address,address,tuple)": EventFragment;
    "ProductRemoved(uint256,uint256)": EventFragment;
    "ReleasedToSlicer(uint256,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC1155ListingChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC721ListingChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProductAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProductInfoChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProductPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProductRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReleasedToSlicer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export type AdminChangedEvent = TypedEvent<
  [string, string],
  { previousAdmin: string; newAdmin: string }
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export type BeaconUpgradedEvent = TypedEvent<[string], { beacon: string }>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export type ERC1155ListingChangedEvent = TypedEvent<
  [BigNumber, string, BigNumber, BigNumber],
  {
    slicerId: BigNumber;
    contractAddress: string;
    tokenId: BigNumber;
    currentAmount: BigNumber;
  }
>;

export type ERC1155ListingChangedEventFilter =
  TypedEventFilter<ERC1155ListingChangedEvent>;

export type ERC721ListingChangedEvent = TypedEvent<
  [BigNumber, string, BigNumber, boolean],
  {
    slicerId: BigNumber;
    contractAddress: string;
    tokenId: BigNumber;
    isActive: boolean;
  }
>;

export type ERC721ListingChangedEventFilter =
  TypedEventFilter<ERC721ListingChangedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type PausedEvent = TypedEvent<[string], { account: string }>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export type ProductAddedEvent = TypedEvent<
  [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    ProductParamsStructOutput,
    FunctionStructOutput
  ],
  {
    slicerId: BigNumber;
    productId: BigNumber;
    categoryIndex: BigNumber;
    creator: string;
    params: ProductParamsStructOutput;
    externalCall: FunctionStructOutput;
  }
>;

export type ProductAddedEventFilter = TypedEventFilter<ProductAddedEvent>;

export type ProductInfoChangedEvent = TypedEvent<
  [
    BigNumber,
    BigNumber,
    number,
    boolean,
    boolean,
    BigNumber,
    CurrencyPriceStructOutput[]
  ],
  {
    slicerId: BigNumber;
    productId: BigNumber;
    maxUnitsPerBuyer: number;
    isFree: boolean;
    isInfinite: boolean;
    newUnits: BigNumber;
    currencyPrices: CurrencyPriceStructOutput[];
  }
>;

export type ProductInfoChangedEventFilter =
  TypedEventFilter<ProductInfoChangedEvent>;

export type ProductPaidEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string, string, PriceStructOutput],
  {
    slicerId: BigNumber;
    productId: BigNumber;
    quantity: BigNumber;
    buyer: string;
    currency: string;
    price: PriceStructOutput;
  }
>;

export type ProductPaidEventFilter = TypedEventFilter<ProductPaidEvent>;

export type ProductRemovedEvent = TypedEvent<
  [BigNumber, BigNumber],
  { slicerId: BigNumber; productId: BigNumber }
>;

export type ProductRemovedEventFilter = TypedEventFilter<ProductRemovedEvent>;

export type ReleasedToSlicerEvent = TypedEvent<
  [BigNumber, BigNumber],
  { slicerId: BigNumber; ethToRelease: BigNumber }
>;

export type ReleasedToSlicerEventFilter =
  TypedEventFilter<ReleasedToSlicerEvent>;

export type UnpausedEvent = TypedEvent<[string], { account: string }>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export type UpgradedEvent = TypedEvent<[string], { implementation: string }>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface ProductsModule extends BaseContract {
  contractName: "ProductsModule";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ProductsModuleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _togglePause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addProduct(
      slicerId: BigNumberish,
      params: ProductParamsStruct,
      externalCall_: FunctionStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    availableUnits(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { units: BigNumber; isInfinite: boolean }
    >;

    ethBalance(
      slicerId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isProductOwner(
      slicerId: BigNumberish,
      productId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isAllowed: boolean }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    payProducts(
      buyer: string,
      purchases: PurchaseParamsStruct[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    productPrice(
      slicerId: BigNumberish,
      productId: BigNumberish,
      currency: string,
      quantity: BigNumberish,
      buyer: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[PriceStructOutput] & { price: PriceStructOutput }>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    releaseEthToSlicer(
      slicerId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeProduct(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProductInfo(
      slicerId: BigNumberish,
      productId: BigNumberish,
      newMaxUnits: BigNumberish,
      isFree: boolean,
      isInfinite: boolean,
      newUnits: BigNumberish,
      currencyPrices: CurrencyPriceStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validatePurchase(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string] & { purchases: BigNumber; purchaseData: string }
    >;

    validatePurchaseUnits(
      account: string,
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { purchases: BigNumber }>;
  };

  _togglePause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addProduct(
    slicerId: BigNumberish,
    params: ProductParamsStruct,
    externalCall_: FunctionStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  availableUnits(
    slicerId: BigNumberish,
    productId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean] & { units: BigNumber; isInfinite: boolean }>;

  ethBalance(
    slicerId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isProductOwner(
    slicerId: BigNumberish,
    productId: BigNumberish,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  payProducts(
    buyer: string,
    purchases: PurchaseParamsStruct[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  productPrice(
    slicerId: BigNumberish,
    productId: BigNumberish,
    currency: string,
    quantity: BigNumberish,
    buyer: string,
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<PriceStructOutput>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  releaseEthToSlicer(
    slicerId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeProduct(
    slicerId: BigNumberish,
    productId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProductInfo(
    slicerId: BigNumberish,
    productId: BigNumberish,
    newMaxUnits: BigNumberish,
    isFree: boolean,
    isInfinite: boolean,
    newUnits: BigNumberish,
    currencyPrices: CurrencyPriceStruct[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validatePurchase(
    slicerId: BigNumberish,
    productId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string] & { purchases: BigNumber; purchaseData: string }
  >;

  validatePurchaseUnits(
    account: string,
    slicerId: BigNumberish,
    productId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    _togglePause(overrides?: CallOverrides): Promise<void>;

    addProduct(
      slicerId: BigNumberish,
      params: ProductParamsStruct,
      externalCall_: FunctionStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    availableUnits(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { units: BigNumber; isInfinite: boolean }
    >;

    ethBalance(
      slicerId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(overrides?: CallOverrides): Promise<void>;

    isProductOwner(
      slicerId: BigNumberish,
      productId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    payProducts(
      buyer: string,
      purchases: PurchaseParamsStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    productPrice(
      slicerId: BigNumberish,
      productId: BigNumberish,
      currency: string,
      quantity: BigNumberish,
      buyer: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PriceStructOutput>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    releaseEthToSlicer(
      slicerId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    removeProduct(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setProductInfo(
      slicerId: BigNumberish,
      productId: BigNumberish,
      newMaxUnits: BigNumberish,
      isFree: boolean,
      isInfinite: boolean,
      newUnits: BigNumberish,
      currencyPrices: CurrencyPriceStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    validatePurchase(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string] & { purchases: BigNumber; purchaseData: string }
    >;

    validatePurchaseUnits(
      account: string,
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "AdminChanged(address,address)"(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;
    AdminChanged(
      previousAdmin?: null,
      newAdmin?: null
    ): AdminChangedEventFilter;

    "BeaconUpgraded(address)"(
      beacon?: string | null
    ): BeaconUpgradedEventFilter;
    BeaconUpgraded(beacon?: string | null): BeaconUpgradedEventFilter;

    "ERC1155ListingChanged(uint256,address,uint256,uint256)"(
      slicerId?: BigNumberish | null,
      contractAddress?: string | null,
      tokenId?: BigNumberish | null,
      currentAmount?: null
    ): ERC1155ListingChangedEventFilter;
    ERC1155ListingChanged(
      slicerId?: BigNumberish | null,
      contractAddress?: string | null,
      tokenId?: BigNumberish | null,
      currentAmount?: null
    ): ERC1155ListingChangedEventFilter;

    "ERC721ListingChanged(uint256,address,uint256,bool)"(
      slicerId?: BigNumberish | null,
      contractAddress?: string | null,
      tokenId?: BigNumberish | null,
      isActive?: null
    ): ERC721ListingChangedEventFilter;
    ERC721ListingChanged(
      slicerId?: BigNumberish | null,
      contractAddress?: string | null,
      tokenId?: BigNumberish | null,
      isActive?: null
    ): ERC721ListingChangedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "ProductAdded(uint256,uint256,uint256,address,tuple,tuple)"(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      categoryIndex?: BigNumberish | null,
      creator?: null,
      params?: null,
      externalCall?: null
    ): ProductAddedEventFilter;
    ProductAdded(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      categoryIndex?: BigNumberish | null,
      creator?: null,
      params?: null,
      externalCall?: null
    ): ProductAddedEventFilter;

    "ProductInfoChanged(uint256,uint256,uint8,bool,bool,uint256,tuple[])"(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      maxUnitsPerBuyer?: null,
      isFree?: null,
      isInfinite?: null,
      newUnits?: null,
      currencyPrices?: null
    ): ProductInfoChangedEventFilter;
    ProductInfoChanged(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      maxUnitsPerBuyer?: null,
      isFree?: null,
      isInfinite?: null,
      newUnits?: null,
      currencyPrices?: null
    ): ProductInfoChangedEventFilter;

    "ProductPaid(uint256,uint256,uint256,address,address,tuple)"(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      quantity?: null,
      buyer?: string | null,
      currency?: null,
      price?: null
    ): ProductPaidEventFilter;
    ProductPaid(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null,
      quantity?: null,
      buyer?: string | null,
      currency?: null,
      price?: null
    ): ProductPaidEventFilter;

    "ProductRemoved(uint256,uint256)"(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null
    ): ProductRemovedEventFilter;
    ProductRemoved(
      slicerId?: BigNumberish | null,
      productId?: BigNumberish | null
    ): ProductRemovedEventFilter;

    "ReleasedToSlicer(uint256,uint256)"(
      slicerId?: BigNumberish | null,
      ethToRelease?: null
    ): ReleasedToSlicerEventFilter;
    ReleasedToSlicer(
      slicerId?: BigNumberish | null,
      ethToRelease?: null
    ): ReleasedToSlicerEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "Upgraded(address)"(implementation?: string | null): UpgradedEventFilter;
    Upgraded(implementation?: string | null): UpgradedEventFilter;
  };

  estimateGas: {
    _togglePause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addProduct(
      slicerId: BigNumberish,
      params: ProductParamsStruct,
      externalCall_: FunctionStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    availableUnits(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ethBalance(
      slicerId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isProductOwner(
      slicerId: BigNumberish,
      productId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    payProducts(
      buyer: string,
      purchases: PurchaseParamsStruct[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    productPrice(
      slicerId: BigNumberish,
      productId: BigNumberish,
      currency: string,
      quantity: BigNumberish,
      buyer: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    releaseEthToSlicer(
      slicerId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeProduct(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProductInfo(
      slicerId: BigNumberish,
      productId: BigNumberish,
      newMaxUnits: BigNumberish,
      isFree: boolean,
      isInfinite: boolean,
      newUnits: BigNumberish,
      currencyPrices: CurrencyPriceStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validatePurchase(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validatePurchaseUnits(
      account: string,
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _togglePause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addProduct(
      slicerId: BigNumberish,
      params: ProductParamsStruct,
      externalCall_: FunctionStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    availableUnits(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ethBalance(
      slicerId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isProductOwner(
      slicerId: BigNumberish,
      productId: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    payProducts(
      buyer: string,
      purchases: PurchaseParamsStruct[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    productPrice(
      slicerId: BigNumberish,
      productId: BigNumberish,
      currency: string,
      quantity: BigNumberish,
      buyer: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    releaseEthToSlicer(
      slicerId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeProduct(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProductInfo(
      slicerId: BigNumberish,
      productId: BigNumberish,
      newMaxUnits: BigNumberish,
      isFree: boolean,
      isInfinite: boolean,
      newUnits: BigNumberish,
      currencyPrices: CurrencyPriceStruct[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validatePurchase(
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validatePurchaseUnits(
      account: string,
      slicerId: BigNumberish,
      productId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
