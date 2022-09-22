# Purchase Hooks - Components

Purchase hooks in this folder appear in the `Hooks Library` and can be chosen when creating a new product.

## How to add a hook

1. Add the hook contracts to the [contracts-hooks repo](https://github.com/slice-so/interface) with a PR
2. Open a PR adding a folder named like your purchase hook, containing:

- `{YourHook}.tsx`: The component displayed in the frontend
- `cloneInterface.json`: The interface of the factory contract used for your hook (after compiling the contracts in the `contracts-hooks` repo, you'll find it under `artifacts/contracts/hooks/{YourHook}/{YourHookFactory}.sol/{YourHookFactory}.json`)
- `index.ts`: Export component

3. Export component in `components/hooks/index.ts`

## How to write component

The component purpose is to

1. Hold the states necessary to execute the logic of the relative hook
2. Set the params correctly to

The exported object will need to have:

- `component`: The component to be rendered on page
- `label`: Text inside the hook card
- `description`: Short description of the hook
- `factoryAddresses`: List of deployments for each chainId (1 for ETH mainnet, 4 for Rinkeby)

> Hint: keep the component minimal and use the existing ones as reference, like [ERC20Gated](ERC20Gated/ERC20Gated.tsx) or [Allowlisted](Allowlisted/Allowlisted.tsx)

### Set params

The `params` object defines what happens when the user submits the form and creates the product. In your component props you have access to `setParams` to set it.

You can set 3 keys in the `params` object:

- `externalCall`: Defines the params of the purchase hook that will be called during purchase. In most cases, you can use `defaultExternalCall`.
- `deploy` (optional): If present, deploys and initializes the contract via a pre-deployed factory contract.
- `allowedAddresses` (optional): Addresses used on the frontend to generate from the connected account a Merkle proof verification and send it as `buyerCustomData` param.

See the `Params` type in `purchaseHooks.ts` as reference for the various fields
