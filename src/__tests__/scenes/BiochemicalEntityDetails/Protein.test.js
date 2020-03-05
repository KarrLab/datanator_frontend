import { AbundanceDataTable } from "~/scenes/BiochemicalEntityDetails/Protein/AbundanceDataTable";
import testRawData from "~/__tests__/fixtures/protein-abundances-6-phosphofructo-2-kinase";
import testRawMetadata from "~/__tests__/fixtures/protein-metadata-6-phosphofructo-2-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Protein/MetadataSection";
import { shallow } from "enzyme";
import { get_list_DOM_elements } from "./testing_utils";

/* global describe, it, expect */
describe("Protein data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "K00900";
    const uniprot_to_taxon = { Q9UTE1: 6, Q8TFH0: 6, Q12471: 6, P40433: 6 };
    // instantiate data table
    const dataTable = new AbundanceDataTable({
      "uniprot-id-to-taxon-dist": uniprot_to_taxon
    });

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "proteins/meta/meta_combo/?uniprot_id=Q9UTE1&uniprot_id=Q8TFH0&uniprot_id=Q12471&uniprot_id=P40433"
    );
  });

  it("Formats concentration data correctly", async () => {
    const uniprot_to_taxon = { Q9UTE1: 6, Q8TFH0: 6, Q12471: 6, P40433: 6 };
    // instantiate data table
    const dataTable = new AbundanceDataTable({
      "uniprot-id-to-taxon-dist": uniprot_to_taxon
    });

    // format raw data
    const formattedData = dataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(30);

    let formatedDatum = formattedData[0];
    expect(formatedDatum).toEqual({
      abundance: 2.04,
      proteinName: "6-phosphofructo-2-kinase 1 ",
      uniprotId: "P40433",
      geneSymbol: "PFK26",
      organism: "Saccharomyces cerevisiae S288C",
      taxonomicProximity: 6,
      organ: "whole organism"
    });

    expect(formattedData[7].organism).toEqual("Saccharomyces cerevisiae S288C");
    expect(formattedData[20].geneSymbol).toEqual(null);
  });

  it("Gets correct metadata url ", async () => {
    const query = "K00850";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40&depth=40"
    );
    const organism = "Saccharomyces cerevisiae S288C";
    expect(MetadataSection.getMetadataUrl(query, organism)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&anchor=Saccharomyces cerevisiae S288C&distance=40&depth=40"
    );
  });

  it("Processes metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);
    //console.log(processedMetadata)
    expect(processedMetadata.koNumber).toEqual("K00850");
    expect(processedMetadata.koName).toEqual("6-phosphofructokinase 1");
    expect(processedMetadata.other.uniprotIdToTaxonDist["A1A4J1"]).toEqual(6);
    expect(processedMetadata.other.uniprotIdToTaxonDist["Q8A624"]).toEqual(5);
    expect(processedMetadata.uniprotIds).toEqual([
      "A1A4J1",
      "O34529",
      "O42938",
      "P08237",
      "P0A796",
      "P12382",
      "P16861",
      "P16862",
      "P17858",
      "P30835",
      "P47857",
      "P47858",
      "P47860",
      "P52034",
      "P52784",
      "P65692",
      "P65694",
      "Q01813",
      "Q0IIG5",
      "Q27483",
      "Q2HYU2",
      "Q4E657",
      "Q867C9",
      "Q8A624",
      "Q8A8R5",
      "Q8VYN6",
      "Q8Y6W0",
      "Q8ZJL6",
      "Q94AA4",
      "Q99ZD0",
      "Q9C5J7",
      "Q9FIK0",
      "Q9FKG3",
      "Q9M076",
      "Q9M0F9",
      "Q9TZL8",
      "Q9WUA3"
    ]);
  });

  it("Formats metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const formattedMetadataWrapper = shallow(formattedMetadata[0].content);

    const correct_list_of_metadata = [
      "Name: 6-phosphofructokinase 1",
      "KEGG Orthology id:  K00850",
      "Proteins: A1A4J1O34529O42938P08237P0A796P12382P16861P16862P17858P30835P47857P47858P47860P52034P52784P65692P65694Q01813Q0IIG5Q27483Q2HYU2Q4E657Q867C9Q8A624Q8A8R5Q8VYN6Q8Y6W0Q8ZJL6Q94AA4Q99ZD0Q9C5J7Q9FIK0Q9FKG3Q9M076Q9M0F9Q9TZL8Q9WUA3"
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
