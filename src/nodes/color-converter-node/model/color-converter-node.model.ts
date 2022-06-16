import { Node, NodeDef } from "@node-red/registry";
import { OutputFormat } from "./output-format";
import { TransportFormat } from "./transport-format";

export interface ColorConverterNodeConfig extends NodeDef {
  cieConfig: string;
  output: OutputFormat;
  formatter: TransportFormat;
}
export interface ColorConverterNode extends Node {
  cieConfig: string;
  output: OutputFormat;
  formatter: TransportFormat;
}
