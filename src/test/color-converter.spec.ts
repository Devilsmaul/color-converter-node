import { NodeTestHelper } from "node-red-node-test-helper";
import colorConverterNode from "../nodes/color-converter-node/color-converter-node";
import { OutputFormat } from "../nodes/color-converter-node/model/output-format";
import { TransportFormat } from "../nodes/color-converter-node/model/transport-format";

const helper = new NodeTestHelper();

describe("ColorConverter Node", function () {
  beforeAll(function (done) {
    helper.startServer(done);
  });

  afterAll(function (done) {
    helper.stopServer(done);
  });

  afterEach(function () {
    helper.unload();
  });

  it("should be loaded", function (done) {
    const flow = [{ id: "n1", type: "color-converter", name: "test name" }];
    helper.load(colorConverterNode, flow, function () {
      const n1 = helper.getNode("n1");
      expect(n1).toHaveProperty("name", "test name");
      expect(n1).toHaveProperty("output", OutputFormat.xyBri);
      expect(n1).toHaveProperty("formatter", TransportFormat.z2mqtt);
      done();
    });
  });

  it("should convert payload from hsv to rgb", function (done) {
    const flow = [
      {
        id: "n1",
        type: "color-converter",
        name: "test name",
        wires: [["nodeResult"]],
        output: OutputFormat.RGB,
        formatter: TransportFormat.z2mqtt,
      },
      { id: "nodeResult", type: "helper" },
    ];
    helper.load(colorConverterNode, flow, function () {
      const nodeResult = helper.getNode("nodeResult");
      const n1 = helper.getNode("n1");
      expect(n1).toHaveProperty("name", "test name");
      expect(n1).toHaveProperty("output", OutputFormat.RGB);
      expect(n1).toHaveProperty("formatter", TransportFormat.z2mqtt);

      nodeResult.on("input", function (msg) {
        expect(msg).toHaveProperty("payload", { color: { h: 0, s: 100, v: 100 } });
        done();
      });
      n1.receive({ payload: { color: { r: 255, g: 0, b: 0 } } });
    });
  });
});
