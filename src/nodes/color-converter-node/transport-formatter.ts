import { OutputFormat } from "./model/output-format";
import { NumericTriple } from "@devilsmaul/color-converter";

export abstract class TransportFormatter<T> {
  public toTransport(value: NumericTriple, outputFormat: OutputFormat): T {
    switch (outputFormat) {
      case OutputFormat.HSV:
        return this.hsv(value);
      case OutputFormat.RGB:
        return this.rgb(value);
      case OutputFormat.xyBri:
        return this.xyBri(value);
      default:
        throw new Error("Unknown input format! " + outputFormat);
    }
  }

  public abstract xyBri(xyBri: NumericTriple): T;

  public abstract rgb(rgb: NumericTriple): T;

  public abstract hsv(hsv: NumericTriple): T;
}
