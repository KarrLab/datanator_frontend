import { AbundanceDataTable } from "~/scenes/BiochemicalEntityDetails/Protein/AbundanceDataTable";
import testRawData from "~/__tests__/fixtures/protein-abundances-6-phosphofructo-2-kinase";
import testRawMetadata from "~/__tests__/fixtures/protein-metadata-6-phosphofructo-2-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Protein/MetadataSection";
import { shallow } from "enzyme";
import { get_list_DOM_elements } from "~/utils/testing_utils";

/* global describe, it, expect */
describe("Protein data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "K00850";
    const organism = "Escherichia coli";
    // instantiate data table
    const dataTable = new AbundanceDataTable();

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40&depth=40"
    );
    expect(dataTable.getUrl(entity, organism)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40&depth=40&anchor=Escherichia coli"
    );
  });

  it("Formats concentration data correctly", () => {
    // instantiate data table
    const dataTable = new AbundanceDataTable();

    // format raw data
    const formattedData = dataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(30);

    let formatedDatum = formattedData[17];
    expect(formatedDatum).toEqual({
      abundance: 2.04,
      proteinName: "6-phosphofructo-2-kinase 1 ",
      uniprotId: "P40433",
      geneSymbol: "PFK26",
      organism: "Saccharomyces cerevisiae S288C",
      taxonomicProximity: 6,
      organ: "whole organism"
    });

    expect(formattedData[7].organism).toEqual(
      "Schizosaccharomyces pombe 972h-"
    );
    expect(formattedData[8].geneSymbol).toEqual(null);
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
    console.log("hi");

    const description = get_list_DOM_elements(
      descriptionMetadataWrapper,
      "div",
      "html"
    );

    expect(description).toEqual([
      '<div><div class="lazyload-placeholder"></div></div>'
    ]);

    expect(formattedMetadata[1].id).toEqual("names");
    expect(formattedMetadata[1].title).toEqual("Names");

    const namesMetadataWrapper = shallow(formattedMetadata[1].content);
    console.log("hi");

    const correct_list_of_names = [
      "Name: 6-phosphofructokinase 1",
      "KEGG Orthology ID:  K00850",
      "EC Code: 2.7.1.11"
    ];

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
