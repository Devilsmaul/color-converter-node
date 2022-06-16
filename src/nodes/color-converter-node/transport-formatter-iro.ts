import { NumericTriple } from "@devilsmaul/color-converter";
import { TransportFormatter } from "./transport-formatter";

export type IroFormat = colorRgb1 | colorRgb2 | colorHex | colorHsv1;

export interface colorRgb1 {
  r: number;
  g: number;
  b: number;
}

export interface colorRgb2 {
  rgb: string;
}

export interface colorHex {
  hex: string;
}
export interface colorHsv1 {
  h: number;
  s: number;
  v: number;
}

export class TransportFormatterIro extends TransportFormatter<IroFormat> {
  public xyBri(_: NumericTriple): IroFormat {
    throw new Error("xyBri to Iro format is not supported!");
  }

  public rgb(rgb: NumericTriple): IroFormat {
    const z2m: IroFormat = { r: rgb[0], g: rgb[1], b: rgb[2] };

    if (z2m.r == undefined) {
      z2m.r = 255;
    }
    if (z2m.g == undefined) {
      z2m.g = 255;
    }
    if (z2m.b == undefined) {
      z2m.b = 255;
    }

    return z2m;
  }

  public hsv(hsv: NumericTriple): IroFormat {
    const z2m: IroFormat = { h: hsv[0], s: hsv[1], v: hsv[2] };

    if (z2m.h == undefined) {
      z2m.h = 0;
    }
    if (z2m.s == undefined) {
      z2m.s = 0;
    }
    if (z2m.v == undefined) {
      z2m.v = 100;
    }

    return z2m;
  }
}
