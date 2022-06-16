import { NumericTriple } from "@devilsmaul/color-converter";
import { TransportFormatter } from "./transport-formatter";

export interface Zigbee2MqttFormat {
  brightness?: number;
  transition?: number;
  color?: z2mqttColorRgb1 | z2mqttColorRgb2 | z2mqttColorXy | z2mqttColorHex | z2mqttColorHsv1 | z2mqttColorHsv2;
  color_mode?: "xy" | "temp" | "hs";
  color_temp?: number;
  color_temp_startup?: number;
  linkquality?: number;
  power_on_behavior?: "previous";
  state?: "OFF" | "ON" | "TOGGLE";
  update?: { state: "idle" };
  update_available?: boolean;
}

export interface z2mqttColorXy {
  x: number;
  y: number;
}
export interface z2mqttColorRgb1 {
  r: number;
  g: number;
  b: number;
}

export interface z2mqttColorRgb2 {
  rgb: string;
}

export interface z2mqttColorHex {
  hex: string;
}
export interface z2mqttColorHsv1 {
  h: number;
  s: number;
  v: number;
}
export interface z2mqttColorHsv2 {
  hsv: string;
}

export class TransportFormatterZ2Mqtt extends TransportFormatter<Zigbee2MqttFormat> {
  public xyBri(xyBri: NumericTriple): Zigbee2MqttFormat {
    const z2m: Zigbee2MqttFormat = {};
    z2m.color_mode = "xy";
    z2m.color = { x: xyBri[0], y: xyBri[1] };
    z2m.brightness = xyBri[2];

    if (z2m.color.x == undefined) {
      z2m.color.x = 1.0;
    }
    if (z2m.color.y == undefined) {
      z2m.color.y = 1.0;
    }
    if (z2m.brightness == undefined) {
      z2m.brightness = 254;
    }
    return z2m;
  }

  public rgb(rgb: NumericTriple): Zigbee2MqttFormat {
    const z2m: Zigbee2MqttFormat = {};
    z2m.color_mode = "xy";
    z2m.color = { r: rgb[0], g: rgb[1], b: rgb[2] };

    if (z2m.color.r == undefined) {
      z2m.color.r = 255;
    }
    if (z2m.color.g == undefined) {
      z2m.color.g = 255;
    }
    if (z2m.color.b == undefined) {
      z2m.color.b = 255;
    }

    return z2m;
  }

  public hsv(hsv: NumericTriple): Zigbee2MqttFormat {
    const z2m: Zigbee2MqttFormat = {};
    z2m.color_mode = "hs";
    z2m.color = { h: hsv[0], s: hsv[1], v: hsv[2] };

    if (z2m.color.h == undefined) {
      z2m.color.h = 0;
    }
    if (z2m.color.s == undefined) {
      z2m.color.s = 0;
    }
    if (z2m.color.v == undefined) {
      z2m.color.v = 100;
    }

    return z2m;
  }
}
