import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

export async function sendMessage(message: string) {
  // You'll want to replace this with a wallet from your application
  const wallet = Wallet.fromMnemonic(
    "animal caution honey comfort pair picnic march indoor similar song enough blossom"
  );
  // Create the client with your wallet. This will connect to the XMTP development network by default
  const xmtp = await Client.create(wallet, { env: "production" });
  // Start a conversation with XMTP
  const conversation = await xmtp.conversations.newConversation(
    "0x3ea3821c93163a207bf6875d9f6c90c7d72ef9ed"
  );

  // Send a message
  await conversation.send("This is a test from Slice");
}
