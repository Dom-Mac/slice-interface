import type { NextApiRequest, NextApiResponse } from "next";
import { sendMessage } from "@utils/xmtp";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      await sendMessage("This is a test from Slice");
      res.status(200).json({});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export default handler;
