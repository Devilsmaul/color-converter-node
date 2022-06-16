import { NodeTestHelper } from "node-red-node-test-helper";
import CieConfigNode from "../config-nodes/cie-config/cie-config-node";

const helper = new NodeTestHelper();

describe("CieConfigNode Node", function () {
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
    const flow = [{ id: "c1", type: "cie-config-devilsmaul", name: "" }];
    helper.load(CieConfigNode, flow, function () {
      const c1 = helper.getNode("c1");
      expect(c1).toHaveProperty("whiteRef", "D50");
      expect(c1).toHaveProperty("rgbModel", "CIE RGB");
      expect(c1).toHaveProperty("gammaModel", "2.2");
      expect(c1).toHaveProperty("adaptation", "Bradford");
      done();
    });
  });
});
