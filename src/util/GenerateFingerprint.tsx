import React from "react";
import Fingerprintjs from "@fingerprintjs/fingerprintjs";

const generateBrowserFingerprint = async () => {
  const fp = await Fingerprintjs.load();
  const result = await fp.get();
  const visitorId = result.visitorId;
  return visitorId;
};

export default generateBrowserFingerprint;