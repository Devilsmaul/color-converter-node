import { Node, NodeDef } from "@node-red/registry";
import { RefWhite, RGBModel, GammaModel, Adaptation } from "@devilsmaul/color-converter";

export interface CieConfig extends NodeDef {
  name: string;
  whiteRef: RefWhite;
  rgbModel: RGBModel;
  gammaModel: GammaModel;
  adaptation: Adaptation;
}

export interface CieConfigNode extends Node {
  name: string;
  whiteRef: RefWhite;
  rgbModel: RGBModel;
  gammaModel: GammaModel;
  adaptation: Adaptation;
}
