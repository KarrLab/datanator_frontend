import { RateConstantsDataTable } from "~/scenes/BiochemicalEntityDetails/Reaction/RateConstantsDataTable";
import testRawData from "~/__tests__/fixtures/reaction-constants-adenylate-kinase";
import {
  formatMetadata,
  MetadataSection
} from "~/scenes/BiochemicalEntityDetails/Reaction/MetadataSection";
/* global describe, it, expect */
describe("Reaction data page", () => {
  it("Gets correct reaction data url", () => {
    const entity = "ATP,AMP --> ADP";
    // instantiate data table
    const dataTable = new RateConstantsDataTable();

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "reactions/kinlaw_by_name/?substrates=ATP,AMP&products=ADP&_from=0&size=1000&bound=tight"
    );
  });

  it("Formats concentration data correct", async () => {
    // instantiate data table
    const dataTable = new RateConstantsDataTable();

    // format raw data
    const formattedData = dataTable.formatData(testRawData);

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
    const metadata = new MetadataSection();
    const query = "ATP + AMP --> ADP";
    const organism = "Saccharomyces cerevisiae S288C";
    const substrates = "ATP + AMP";
    const products = "ADP";
    expect(metadata.getMetadataUrl(query, organism)).toEqual(
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

  it("Formats metadata data correctly", async () => {
    // format raw data
    const formattedMetadata = formatMetadata(testRawData);
    console.log(formattedMetadata);
    expect(formattedMetadata).toEqual({
      reactionId: "82",
      substrates: ["AMP", "ATP"],
      products: ["ADP"],
      ecNumber: "2.7.4.3",
      name: "Adenylate kinase",
      equation: "AMP + ATP → ADP"
    });
  });
});
