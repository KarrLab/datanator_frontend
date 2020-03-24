import { AbundanceDataTable } from "~/scenes/BiochemicalEntityDetails/Protein/AbundanceDataTable";
import testRawData from "~/__tests__/fixtures/protein-abundances-6-phosphofructo-2-kinase";
import testRawMetadata from "~/__tests__/fixtures/protein-metadata-6-phosphofructo-2-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Protein/MetadataSection";
import { shallow } from "enzyme";
import { get_list_DOM_elements } from "~/utils/testing_utils";

function getFormattedSection(formattedMetadata, id) {
  for (let i = 0; i < formattedMetadata.length; i++) {
    if (formattedMetadata[i].id === id) {
      return formattedMetadata[i];
    }
  }
}

/* global describe, it, expect */
describe("Protein data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "K00850";
    const organism = "Escherichia coli";
    // instantiate data table
    const dataTable = new AbundanceDataTable();

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40"
    );
    expect(dataTable.getUrl(entity, organism)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40&anchor=Escherichia coli"
    );
  });

  it("Formats concentration data correctly", () => {
    // instantiate data table
    const dataTable = new AbundanceDataTable();

    // format raw data
    const rankings = [
      "species",
      "genus",
      "family",
      "order",
      "class",
      "phylum",
      "superkingdom",
      "cellular life"
    ];
    const formattedData = dataTable.formatData(testRawData, rankings);

    // test formatted data
    expect(formattedData).toHaveLength(30);

    let formatedDatum = formattedData[17];
    expect(formatedDatum).toEqual({
      abundance: 2.04,
      proteinName: "6-phosphofructo-2-kinase 1 ",
      uniprotId: "P40433",
      geneSymbol: "PFK26",
      organism: "Saccharomyces cerevisiae S288C",
      taxonomicProximity: "cellular life",
      organ: "whole organism"
    });

    expect(formattedData[7].organism).toEqual(
      "Schizosaccharomyces pombe 972h-"
    );
    expect(formattedData[8].geneSymbol).toEqual(null);

    const formattedDataWithoutTaxonomicData = dataTable.formatData(
      testRawData,
      null
    );

    let formatedDatumWithoutTaxonomicData =
      formattedDataWithoutTaxonomicData[17];
    expect(formatedDatumWithoutTaxonomicData).toEqual({
      abundance: 2.04,
      proteinName: "6-phosphofructo-2-kinase 1 ",
      uniprotId: "P40433",
      geneSymbol: "PFK26",
      organism: "Saccharomyces cerevisiae S288C",
      organ: "whole organism"
    });
  });

  it("Gets correct metadata url ", () => {
    const query = "K00850";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "kegg/get_meta/?kegg_ids=K00850"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);
    //console.log(processedMetadata)
    expect(processedMetadata.koNumber).toEqual("K00850");
    expect(processedMetadata.koName).toEqual("6-phosphofructokinase 1");
  });

  it("Formats metadata data correctly", () => {
    // format processed data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);

    expect(MetadataSection.formatTitle(processedMetadata)).toEqual(
      "6-phosphofructokinase 1"
    );

    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const descriptionMetadataWrapper = shallow(formattedMetadata[0].content);

    const description = get_list_DOM_elements(
      descriptionMetadataWrapper,
      "div",
      "html"
    );

    expect(description).toEqual([
      '<div><div class="loader"></div></div>'
    ]);

    const formattedCrossReferences = getFormattedSection(
      formattedMetadata,
      "cross_references"
    );
    expect(formattedCrossReferences.title).toEqual("Cross references");

    const namesMetadataWrapper = shallow(formattedCrossReferences.content);

    const correct_list_of_names = ["KEGG:  K00850", "EC code:  2.7.1.11"];

    const actual_list_of_names = get_list_DOM_elements(
      namesMetadataWrapper,
      ".key-value-list li",
      "text"
    );

    expect(actual_list_of_names).toEqual(
      expect.arrayContaining(correct_list_of_names)
    );
  });
});
