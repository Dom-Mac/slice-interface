# Slice Interface

Slice frontend application.

- Mainnet: https://slice.so
- Rinkeby: https://testnet.slice.so
- Development (staging branch): https://dev.slice.so

## Development

### Installation

1. Create a
   [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this repository.
2. Clone your fork and navigate to the root directory.
3. Install project dependencies.

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory which mirrors the `.example.env`
   file. Learn how to define each field in the `.env` file in [Setup](#setup).

### Setup

`Slice-interface` relies on a number of services for development. A separate set of contracts on Rinkeby was appositely created for development purposes.

The following sections describe how to set up each service for local
development.

- [Alchemy](#Alchemy)
- [Pinata](#Pinata)
- [Web3Storage](#Web3Storage)
- [Supabase](#Supabase)
- [CoinMarketCap](#CoinMarketCap)

> A shared staging environment has also been set up on https://dev.slice.so. The shared environment uses the same contracts and subgraphs as the ones used for local development, so the slicers and products created locally will also appear there.

#### Alchemy

Slice uses [Alchemy](https://www.alchemy.com) to connect to an Ethereum network
(mainnet, or one of the testnets).

Follow these steps to create an Alchemy key:

1. Create an account on [Alchemy](https://www.alchemy.com)
2. Create a new App, specifying Rinkeby as network
3. Enter the app and click on **View Key**
4. Copy the HTTP key and paste it into the **NEXT_PUBLIC_NETWORK_URL** in your `.env` file

#### Pinata

Slice uses [Pinata](https://www.pinata.cloud) to store products metadata.

Follow these steps to create a Pinata key

1. Create or log into your account on [Pinata](https://www.pinata.cloud) by clicking on **Login**
2. On the top left corner, open the user menu and click on **API Keys**
3. Create a new API key with admin permissions and copy the JWT secret access token into **PINATA_JWT** in your `.env` file

#### Web3Storage

Slice uses [Web3Storage](https://web3.storage) to store encrypted product metadata.

Follow these steps to create a web3Storage key

1. Create or log into your account on [Web3Storage](https://web3.storage) by clicking on **Login**
2. Create an API token and copy it in **WEB3STORAGE_KEY** in your `.env` file

#### Supabase

Slice uses [Supabase](https://supabase.com) as its database and storage solution. The database is used for optimizing performance and to store slicers metadata, product metadata, list reverted products, as well as to support interface-only features.

> The database represents the source of truth when it comes to slicer metadata.

Follow these steps to set up your db and storage:

1. Create or log into your account on [Supabase](https://supabase.com) by clicking on **Start your project**
2. Create an organization and create a **New project** (take note of the password you choose)
3. Copy the following values into your `.env` file
   - `anon key` -> `ANON_SUPABASE_KEY`
   - `secret key` -> `BACKEND_SUPABASE_KEY`
   - `project configuration url` -> `NEXT_PUBLIC_SUPABASE_URL`
4. Create a storage
   - Click on **storage** on the left sidebar and click on **create a new bucket**
   - (Important) Name it **slicer-images** and make it public
   - Click on **policies** in the left menu and create a new policy from scratch for the new bucket. You can name it "allow anon users to upload to slicer-images"
   - Check `INSERT` as the allowed operations and paste the following snippet in the policy definition

```sql
   ((bucket_id = 'slicer-images'::text) AND (role() = 'anon'::text))
```

5. Link the database to your app

   - Click on **settings** on the left sidebar and select **database** under project settings
   - Copy the `connection string` at the bottom of the page and paste it into **DATABASE_URL** in your `.env`, and add the string `?pgbouncer=true` at the end
   - Substitute **\[YOUR-PASSWORD]** in the string with your project password

6. Navigate to the root directory and run the following command in your terminal to initiate your db

   ```bash
      npx prisma generate && npx prisma migrate deploy
   ```

> The interface uses incremental static regeneration to populate the db, so once you start the app you will see any slicer that other devs have created in their own local environments, but without their images or metadata.

#### CoinMarketCap

Slice uses [CoinMarketCap](https://coinmarketcap.com/) API to get and store currencies prices.

Follow these steps to create a Coin Market Cap API key

1. Create or log into your account on [CoinMarketCap](https://coinmarketcap.com/api/) by clicking on **Login**
2. Create an API token and copy it in **COIN_MARKET_CAP_KEY** in your `.env` file

### Usage

1. Start the app.

   ```bash
   npm run dev
   ```

> If you use a different port than 3000 for local development, update the NEXT_PUBLIC_APP_URL in your `.env` file accordingly

## Deployment

Frontend application(s) is hosted on [Vercel](https://vercel.com/) and new versions are automatically deployed when pushed to `master`, `testnet` or `staging`.
