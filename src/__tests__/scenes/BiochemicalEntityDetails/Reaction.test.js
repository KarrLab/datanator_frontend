import { RateConstantsDataTable } from "~/scenes/BiochemicalEntityDetails/Reaction/RateConstantsDataTable";
import testRawData from "~/__tests__/fixtures/reaction-constants-adenylate-kinase";
import { formatMetadata } from "~/scenes/BiochemicalEntityDetails/Reaction/MetadataSection";

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
    //expect(formattedData[7].source).toEqual({
    //  source: "ymdb",
    //  id: "ymdb_id_xxx"
    //});
    expect(formattedData[5].km).toEqual({ AMP: 0.0014 });
    expect(formattedData[10].km).toEqual({});
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
