import { HalfLifeDataTable } from "~/scenes/BiochemicalEntityDetails/Rna/HalfLifeDataTable";
import testRawData from "~/__tests__/fixtures/rna-abundances-phophofructokinase";
import testRawDataWithoutGeneName from "~/__tests__/fixtures/rna-abundances-prephenate-dehydrogenase-without-gene-name";
import testRawDataWithoutGeneNameWithProteinName from "~/__tests__/fixtures/rna-abundances-prephenate-dehydrogenase-without-gene-name-with-protein-name";
import { get_list_DOM_elements } from "~/utils/testing_utils";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Rna/MetadataSection";
import { shallow } from "enzyme";

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

  it("Formats concentration data correct", () => {
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

  it("Gets correct metadata url ", () => {
    const query = "ATP-PFK";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "/rna/halflife/get_info_by_protein_name/?protein_name=ATP-PFK&_from=0&size=1000"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    let processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(processedMetadata).toEqual({
      geneName: "pfk",
      proteinName: "Archaeal ADP-dependent phosphofructokinase/glucokinase"
    });

    const processedMetadataWithoutAnyName = MetadataSection.processMetadata(
      testRawDataWithoutGeneName
    );
    expect(processedMetadataWithoutAnyName).toEqual({
      geneName: null,
      proteinName: "Protein name not found"
    });

    const processedMetadataWithOnlyProteinName = MetadataSection.processMetadata(
      testRawDataWithoutGeneNameWithProteinName
    );

    expect(processedMetadataWithOnlyProteinName).toEqual({
      geneName: null,
      proteinName:
        "ATP-dependent 6-phosphofructokinase (ATP-PFK) (Phosphofructokinase) (EC 2.7.1.11) (Phosphohexokinase)"
    });
  });

  it("Formats metadata data correctly", () => {
    // format processed data
    const processedMetadataWithOnlyProteinName = MetadataSection.processMetadata(
      testRawDataWithoutGeneNameWithProteinName
    );
    expect(
      MetadataSection.formatTitle(processedMetadataWithOnlyProteinName)
    ).toEqual(
      "ATP-dependent 6-phosphofructokinase (ATP-PFK) (Phosphofructokinase) (EC 2.7.1.11) (Phosphohexokinase)"
    );

    const processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(MetadataSection.formatTitle(processedMetadata)).toEqual("Pfk");

    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const formattedMetadataWrapper = shallow(formattedMetadata[0].content);

    const correct_list_of_metadata = [
      "Gene: pfk",
      "Protein: Archaeal ADP-dependent phosphofructokinase/glucokinase"
    ];

    const actual_list_of_metadata = get_list_DOM_elements(
      formattedMetadataWrapper,
      ".key-value-list li",
      "text"
    );

    expect(actual_list_of_metadata).toEqual(
      expect.arrayContaining(correct_list_of_metadata)
    );
  });
});
