




//mine/page.tsx
import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import MineClient from "./mine";

const MineServer = async () => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({ collection: "Mines" });
  return <MineClient MineItems={docs} />;
};

export default MineServer;
