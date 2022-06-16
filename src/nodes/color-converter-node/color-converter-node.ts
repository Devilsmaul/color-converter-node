import { NodeAPI } from "@node-red/registry";
import { NumericTriple } from "@devilsmaul/color-converter";
import { ColorConverterLib } from "./color-converter.lib";
import { ColorConverterNodeRed } from "./color-converter.lib.red";

import { ColorConverterNode, ColorConverterNodeConfig } from "./model/color-converter-node.model";
import { InputFormat } from "./model/input-format";
import { OutputFormat } from "./model/output-format";
import { TransportFormat } from "./model/transport-format";
import { CieConfigNode } from "../../config-nodes/cie-config/cie-config.model";
import { TransportFormatFactory } from "./transport-formatter-factory";

export = function (RED: NodeAPI) {
  "use strict";

  // to have code completion we overwrite the this keyword in the function to the appropriate interface
  // becaus typescript only allows one export = we have to split the type definitions into a separate file
  // (in this case temperature.model.ts)
  function ColorConverterNode(this: ColorConverterNode, config: ColorConverterNodeConfig) {
    RED.nodes.createNode(this, config);

    const node = this; // eslint-disable-line
    node.debug("onConstruct of ColorConverterNode: " + node.id);
    node.cieConfig = config.cieConfig;
    node.output = config.output || OutputFormat.xyBri;
    node.formatter = config.formatter || TransportFormat.z2mqtt;

    const colorConverter = new ColorConverterLib();
    const colorConverterNodeRed = new ColorConverterNodeRed();

    node.on("input", function (msg, send, done) {
      // first get options from node itself
      let outputFormat: OutputFormat = node.output;
      let transportFormat: TransportFormat = node.formatter;

      // check if msg.config contains options. If so -> overwrite
      if (msg["config"]) {
        if (msg["config"].output) {
          outputFormat = msg["config"].output;
        }
        if (msg["config"].formatter) {
          transportFormat = msg["config"].formatter;
        }
      }

      // grab CieConfig
      const cieConfig = <CieConfigNode>RED.nodes.getNode(node.cieConfig);
      const converterOptions = {
        gammaModel: cieConfig.gammaModel,
        whiteRef: cieConfig.whiteRef,
        adaptation: cieConfig.adaptation,
        rgbModel: cieConfig.rgbModel,
      };

      const inputFormat: InputFormat = colorConverterNodeRed.autoDetectInputFormat(msg);

      const inputValue: NumericTriple = colorConverterNodeRed.getPayload(msg, inputFormat);

      // // check if msg.payload consist of 3 numbers
      // if (
      //   inputValue == undefined &&
      //   msg.payload != undefined &&
      //   Array.isArray(msg.payload) &&
      //   msg.payload.length == 3 &&
      //   typeof msg.payload[0] == "number" &&
      //   typeof msg.payload[1] == "number" &&
      //   typeof msg.payload[2] == "number"
      // ) {
      //   inputValue = <NumericTriple>Object.assign({}, msg.payload);
      // }

      msg["input"] = {};
      msg["input"].format = inputFormat;
      msg["input"].value = Object.assign({}, inputValue);
      msg["output"] = {};
      msg["output"].format = outputFormat;
      msg["formatter"] = transportFormat;

      msg.payload = {};

      node.warn("input: " + inputFormat + " - " + JSON.stringify(inputValue));
      const convertedValue: NumericTriple = colorConverter.convert(inputValue, inputFormat, outputFormat, converterOptions);

      // format into transport protocol
      const transportFormatter = TransportFormatFactory(node.formatter);
      const formattedValue = transportFormatter.toTransport(convertedValue, outputFormat);

      msg.payload = formattedValue;
      msg["output"].value = convertedValue;
      msg["output"].formattedValue = formattedValue;
      node.warn("output: " + outputFormat + " - " + JSON.stringify(msg["output"].value));
      node.warn("output formatted with: " + transportFormat + " - " + JSON.stringify(msg["output"].formattedValue));
      send(msg);
      done();
    });

    /**
     * cleanup resources.
     * This routine is also called when deploy (save and test) is pressed.
     */
    node.on("close", function (done) {
      node.debug("onClose of color-converter Node: " + node.id);
      // nothing to do here
      done();
    });
  }

  RED.nodes.registerType("color-converter", ColorConverterNode);
};
