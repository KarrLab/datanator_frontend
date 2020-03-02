import { HalfLifeDataTable } from "~/scenes/BiochemicalEntityDetails/Rna/HalfLifeDataTable";
import testRawData from "~/__tests__/fixtures/rna-abundances-phophofructokinase";
import testRawDataWithoutGeneName from "~/__tests__/fixtures/rna-abundances-prephenate-dehydrogenase-without-gene-name";

import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Rna/MetadataSection";
import { shallow } from "enzyme";
import React from "react";

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

  it("Processes metadata data correctly", async () => {
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

  it("Formats metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const formattedMetadataWrapper = shallow(
      <div>{formattedMetadata[0].content}</div>
    );

    // test the formatted JSX
    expect(
      formattedMetadataWrapper
        .find(".key-value-list li")
        .at(0)
        .text()
    ).toEqual("Gene: pfk");
    expect(
      formattedMetadataWrapper
        .find(".key-value-list li")
        .at(1)
        .text()
    ).toEqual(
      "Protein: Archaeal ADP-dependent phosphofructokinase/glucokinase"
    );
  });
});
