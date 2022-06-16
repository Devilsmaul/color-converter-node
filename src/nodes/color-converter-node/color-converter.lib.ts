import {
  RGB_to_xyBri,
  RGB_to_HSV,
  HSV_to_RGB,
  HSV_to_xyBri,
  xyBri_to_RGB,
  xyBri_to_HSV,
  ConverterOptions,
  NumericTriple,
} from "@devilsmaul/color-converter";
import { InputFormat } from "./model/input-format";
import { OutputFormat } from "./model/output-format";

export class ColorConverterLib {
  public convert(inputValue: NumericTriple, inputFormat: InputFormat, outputFormat: OutputFormat, converterOptions: ConverterOptions): NumericTriple {
    switch (inputFormat) {
      case InputFormat.HSV:
        return this.hsv2(inputValue, outputFormat, converterOptions);
      case InputFormat.RGB:
        return this.rgb2(inputValue, outputFormat, converterOptions);
      case InputFormat.xyBri:
        return this.xyBri2(inputValue, outputFormat, converterOptions);
      default:
        throw new Error("Unknown input format: " + inputFormat);
    }
  }

  private rgb2(inputValue: NumericTriple, outputFormat: OutputFormat, converterOptions: ConverterOptions): NumericTriple {
    let converted: NumericTriple;
    switch (outputFormat) {
      case OutputFormat.xyBri:
        converted = RGB_to_xyBri(inputValue, converterOptions);
        break;
      case OutputFormat.HSV:
        converted = RGB_to_HSV(inputValue);
        break;
      case OutputFormat.RGB:
        converted = inputValue;
        break;
    }
    return converted;
  }

  private hsv2(inputValue: NumericTriple, outputFormat: OutputFormat, converterOptions: ConverterOptions): NumericTriple {
    let converted: NumericTriple;
    switch (outputFormat) {
      case OutputFormat.RGB:
        converted = HSV_to_RGB(inputValue);
        break;
      case OutputFormat.xyBri:
        converted = HSV_to_xyBri(inputValue, converterOptions);
        break;
      case OutputFormat.HSV:
        converted = inputValue;
        break;
    }
    return converted;
  }

  private xyBri2(inputValue: NumericTriple, outputFormat: OutputFormat, converterOptions: ConverterOptions): NumericTriple {
    let converted: NumericTriple;
    switch (outputFormat) {
      case OutputFormat.RGB:
        converted = xyBri_to_RGB(inputValue, converterOptions);
        break;
      case OutputFormat.HSV:
        converted = xyBri_to_HSV(inputValue, converterOptions);
        break;
      case OutputFormat.xyBri:
        converted = inputValue;
        break;
    }
    return converted;
  }
}
