import { HalfLifeDataTable } from "~/scenes/BiochemicalEntityDetails/Rna/HalfLifeDataTable";
import testRawData from "~/__tests__/fixtures/rna-abundances-phophofructokinase";
import testRawDataWithoutGeneName from "~/__tests__/fixtures/rna-abundances-prephenate-dehydrogenase-without-gene-name";

import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Rna/MetadataSection";

/* global describe, it, expect */
describe("Reaction data page", () => {
  it("Gets correct reaction data url", () => {
    const entity =
      "ATP-dependent 6-phosphofructokinase (ATP-PFK) (Phosphofructokinase) (EC 2.7.1.11) (Phosphohexokinase)";
    // assert URL correct
    expect(HalfLifeDataTable.getUrl(entity)).toEqual(
      "/rna/halflife/get_info_by_protein_name/?protein_name=ATP-dependent 6-phosphofructokinase (ATP-PFK) (Phosphofructokinase) (EC 2.7.1.11) (Phosphohexokinase)&_from=0&size=1000"
    );
  });

  it("Formats concentration data correct", async () => {
    // format raw data
    const formattedData = HalfLifeDataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(3);

    let formatedDatum = formattedData[0];
    expect(formatedDatum).toEqual({
      halfLife: 4256.48322,
      organism: "Methanosarcina acetivorans",
      growthMedium: "MeOH",
      source: "10.1186/s12864-016-3219-8"
    });
    expect(formattedData[1].organism).toEqual("Methanosarcina acetivorans");
  });

  it("Formats metadata data correctly", async () => {
    // format raw data
    let formattedMetadata = MetadataSection.processMetadata(testRawData);
    expect(formattedMetadata).toEqual({
      geneName: "pfk",
      proteinName: "Archaeal ADP-dependent phosphofructokinase/glucokinase"
    });

    const formattedMetadataWithoutProteinName = MetadataSection.processMetadata(
      testRawDataWithoutGeneName
    );
    expect(formattedMetadataWithoutProteinName).toEqual({
      geneName: null,
      proteinName: "Protein name not found"
    });
  });
});
