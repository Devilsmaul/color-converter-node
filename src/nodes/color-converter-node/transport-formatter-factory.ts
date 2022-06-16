import { TransportFormat } from "./model/transport-format";
import { TransportFormatter } from "./transport-formatter";
import { TransportFormatterIro } from "./transport-formatter-iro";
import { TransportFormatterZ2Mqtt } from "./transport-formatter-z2mqtt";

export const TransportFormatFactory = (transportFormat: TransportFormat): TransportFormatter<unknown> => {
  switch (transportFormat) {
    case TransportFormat.z2mqtt:
      return new TransportFormatterZ2Mqtt();

    case TransportFormat.iro:
      return new TransportFormatterIro();
  }
};
