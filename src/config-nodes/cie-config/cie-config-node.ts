import { NodeAPI } from "@node-red/registry";
import { CieConfig, CieConfigNode } from "./cie-config.model";
export = function (RED: NodeAPI) {
  "use strict";

  // to have code completion we overwrite the this keyword in the function to the appropriate interface
  // becaus typescript only allows one export = we have to split the type definitions into a separate file (in this case temperature.model.ts)
  function CieConfigNode(this: CieConfigNode, config: CieConfig) {
    RED.nodes.createNode(this, config);
    const node = this; // eslint-disable-line

    node.name = config.name;
    node.whiteRef = config.whiteRef || "D50";
    node.rgbModel = config.rgbModel || "CIE RGB";
    node.gammaModel = config.gammaModel || "2.2";
    node.adaptation = config.adaptation || "Bradford";
  }

  RED.nodes.registerType("cie-config-devilsmaul", CieConfigNode);
};
