import { NodeMessage } from "node-red";
import { NumericTriple } from "@devilsmaul/color-converter";
import { InputFormat } from "./model/input-format";

export class ColorConverterNodeRed {
  public getPayload(msg: NodeMessage, inputFormat: InputFormat): NumericTriple | undefined {
    let value: number[] = undefined;
    let briValue: number = undefined;

    switch (inputFormat) {
      case InputFormat.RGB:
        value = this.findRGB(msg);
        break;
      case InputFormat.HSV:
        value = this.findHSV(msg);
        break;
      case InputFormat.xyBri:
        value = this.findxy(msg);
        briValue = this.findBrightness(msg);
        if (value != undefined && briValue != undefined) {
          // make also a triple value x,y,bri
          value = [...value, briValue];
        } else {
          value = undefined;
        }
        break;
      default:
        throw new Error("Unknown InputFormat: " + inputFormat);
    }
    if (value != undefined) {
      return <NumericTriple>value;
    }
    return undefined;
  }

  public autoDetectInputFormat(msg: NodeMessage) {
    if (this.findRGB(msg) != undefined) {
      return InputFormat.RGB;
    }

    if (this.findxy(msg) != undefined && this.findBrightness(msg) != undefined) {
      return InputFormat.xyBri;
    }

    if (this.findHSV(msg) != undefined) {
      return InputFormat.HSV;
    }

    // previous converted node
    if (
      msg["input"] != undefined &&
      msg["input"].format != undefined &&
      msg["input"].value != undefined &&
      msg.payload != undefined &&
      Array.isArray(msg.payload) &&
      msg.payload.length == 3 &&
      msg["output"] != undefined &&
      msg["output"].format != undefined
    ) {
      return msg["output"].format;
    }
  }

  private findRGB(msg: NodeMessage): number[] {
    const values = this.findColorValues(msg, "r", "g", "b");
    // check if these are 3 numbers
    if (typeof values[0] == "number" && typeof values[1] == "number" && typeof values[2] == "number") {
      return values;
    }
    throw new Error("The RGB values are no numbers!");
  }

  private findxy(msg: NodeMessage): number[] {
    const values = this.findColorValues(msg, "x", "y");

    if (typeof values[0] == "number" && typeof values[1] == "number") {
      return values;
    }
    throw new Error("The xy values are no numbers!");
  }

  private findBrightness(msg: NodeMessage): number {
    const values = this.findColorValues(msg, "brightness");
    if (typeof values[0] == "number") {
      return values[0];
    }
    throw new Error("The brightness value is no number!");
  }

  private findHSV(msg): number[] {
    const values = this.findColorValues(msg, "h", "s", "v");
    if (typeof values[0] == "number" && typeof values[1] == "number" && typeof values[2] == "number") {
      return values;
    }
    throw new Error("The HSV values are no numbers!");
  }

  private findColorValues(msg: NodeMessage, ...values: string[]): any[] {
    const searchPaths = ["msg", "msg.payload", "msg.payload.color"];
    for (const p of searchPaths) {
      let conditionsArray: boolean[] = [];
      let result: any[] = [];

      let splittedPath: string[] = p.split(".");

      let temp = "";
      let skip = false;

      for (const part of splittedPath) {
        if (temp == "") {
          temp += part;
        } else {
          temp += "." + part;
        }
        if (eval(temp) == undefined) {
          skip = true;
          break;
        }
      }
      if (skip) {
        continue;
      }

      // define conditions
      for (const v of values) {
        conditionsArray.push(eval(`${p}.${v}`) != undefined);
      }

      // check if all conditions are valid
      if (!conditionsArray.includes(false)) {
        for (const v of values) {
          result.push(eval(`${p}.${v}`));
        }
        //console.log(result);
        return result;
      }

      // check for a combination of the values as one object property
      const combined = values.join("");

      conditionsArray = [];
      conditionsArray.push(
        eval(`${p}.${combined}`) != undefined &&
          eval(`typeof ${p}.${combined}`) == "object" &&
          eval(`Array.isArray(${p}.${combined})`) &&
          eval(`${p}.${combined}.length`) == combined.length
      );

      // check if all conditions are valid
      if (!conditionsArray.includes(false)) {
        result.push(...eval(`${p}.${combined}`));

        // console.log(result);
        return result;
      }
    }
  }
}
