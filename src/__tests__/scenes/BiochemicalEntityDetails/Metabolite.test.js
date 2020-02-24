import { ConcentrationDataTable } from "~/scenes/BiochemicalEntityDetails/Metabolite/ConcentrationDataTable";
import {
  formatMetadata,
  MetadataSection
} from "~/scenes/BiochemicalEntityDetails/Metabolite/MetadataSection";
import testRawData from "~/__tests__/fixtures/metabolite-concentrations-dTDP-D-Glucose";

/* global describe, it, expect */
describe("Metabolite data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    // instantiate data table
    const dataTable = new ConcentrationDataTable();

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "metabolites/concentration/" + "?metabolite=" + entity + "&abstract=true"
    );
    expect(dataTable.getUrl(entity, organism)).toEqual(
      "metabolites/concentration/" +
        "?metabolite=" +
        entity +
        "&abstract=true" +
        "&species=" +
        organism
    );
  });

  it("Formats concentration data correct", async () => {
    // instantiate data table
    const dataTable = new ConcentrationDataTable();

    // format raw data
    const formattedData = dataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(10);

    let formatedDatum = formattedData[0];
    expect(formatedDatum).toEqual({
      name: "Uridine 5'-diphosphate",
      tanimotoSimilarity: 0.783,
      value: 1790,
      uncertainty: null,
      units: "uM",
      organism: "Escherichia coli K12 NCM3722",
      taxonomicProximity: 1,
      growthPhase: "Mid-Log",
      growthMedia:
        "Gutnick minimal complete medium (4.7 g/L KH2PO4; 13.5 g/L K2HPO4; 1 g/L K2SO4; 0.1 g/L MgSO4-7H2O; 10 mM NH4Cl) with 4 g/L glucose",
      growthConditions: "Shake flask and filter culture",
      source: { source: "ecmdb", id: "M2MDB000123" }
    });

    expect(formattedData[7].organism).toEqual("Yeast");
    expect(formattedData[7].source).toEqual({
      source: "ymdb",
      id: "ymdb_id_xxx"
    });
    expect(formattedData[7].growthPhase).toEqual(null);
    expect(formattedData[7].growthMedia).toEqual(null);
    expect(formattedData[7].growthConditions).toEqual(null);
  });

  it("Gets correct metadata url ", async () => {
    const metadata = new MetadataSection();
    const query = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const abstract = "true";
    expect(metadata.getMetadataUrl(query, organism)).toEqual(
      "metabolites/concentration/" +
        "?metabolite=" +
        query +
        "&abstract=" +
        abstract +
        (organism ? "&species=" + organism : "")
    );
  });

  it("Formats metadata data correctly", async () => {
    // instantiate data table

    // format raw data
    const formattedMetadata = formatMetadata(testRawData);
    // test formatted data
    expect(formattedMetadata.cellularLocations).toHaveLength(1);
    expect(formattedMetadata.cellularLocations[0]).toEqual("Cytosol");

    expect(formattedMetadata.dbLinks.biocyc).toEqual("UDP");
    expect(formattedMetadata.dbLinks["kegg"]).toEqual("C00015");

    expect(formattedMetadata.description[0]).toEqual(
      expect.stringContaining("Uridine 5'-diphosphate,")
    );
    expect(formattedMetadata.synonyms).toEqual(["5'-UDP", "UDP"]);
  });
});
