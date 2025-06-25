//mine/page.tsx
import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import Vendor from "./vendor";

const VenderServer = async () => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({ collection: "vendor" });
  return <Vendor VendorItems={docs} />;
};

export default VenderServer;
