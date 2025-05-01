




//mine/page.tsx
import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import MineClient from "./vendor";

const VenderServer = async () => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({ collection: "vendor" });
  return <MineClient VendorItems={docs} />;
};

export default VenderServer;
