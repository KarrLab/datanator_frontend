import { RateConstantsDataTable } from "~/scenes/BiochemicalEntityDetails/Reaction/RateConstantsDataTable";
import testRawData from "~/__tests__/fixtures/reaction-constants-adenylate-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Reaction/MetadataSection";
import ReactDOMServer from "react-dom/server";

/* global describe, it, expect */
describe("Reaction data page", () => {
  it("Gets correct reaction data url", () => {
    const entity = "ATP,AMP --> ADP";

    // assert URL correct
    expect(RateConstantsDataTable.getUrl(entity)).toEqual(
      "reactions/kinlaw_by_name/?substrates=ATP,AMP&products=ADP&_from=0&size=1000&bound=tight"
    );
  });

  it("Formats concentration data correct", async () => {
    // format raw data
    const formattedData = RateConstantsDataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(62);

    let formatedDatum = formattedData[0];
    expect(formatedDatum).toEqual({
      kcat: 650,
      km: {},
      organism: "Gallus gallus",
      ph: 8,
      source: 6051,
      temperature: 30,
      wildtypeMutant: null
    });

    expect(formattedData[20].organism).toEqual("Homo sapiens");
    expect(formattedData[5].km).toEqual({ AMP: 0.0014 });
    expect(formattedData[10].km).toEqual({});
  });

  it("Gets correct metadata url ", async () => {
    const query = "ATP + AMP --> ADP";
    const organism = "Saccharomyces cerevisiae S288C";
    const substrates = "ATP + AMP";
    const products = "ADP";
    expect(MetadataSection.getMetadataUrl(query, organism)).toEqual(
      "reactions/kinlaw_by_name/" +
        "?substrates=" +
        substrates +
        "&products=" +
        products +
        "&_from=0" +
        "&size=1000" +
        "&bound=tight"
    );
  });

  it("Processes metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(processedMetadata).toEqual({
      reactionId: "82",
      substrates: ["AMP", "ATP"],
      products: ["ADP"],
      ecNumber: "2.7.4.3",
      name: "Adenylate kinase",
      equation: "AMP + ATP → ADP"
    });
  });
  it("Formats metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);
    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");
    expect(
      ReactDOMServer.renderToStaticMarkup(formattedMetadata[0].content)
    ).toEqual(
      '<ul class="key-value-list link-list"><li><b>Name:</b> Adenylate kinase</li><li><b>Equation:</b> AMP + ATP → ADP</li><li><b>EC number:</b> <a href="https://enzyme.expasy.org/EC/2.7.4.3" target="_blank" rel="noopener noreferrer">2.7.4.3</a></li></ul>'
    );
  });
});
