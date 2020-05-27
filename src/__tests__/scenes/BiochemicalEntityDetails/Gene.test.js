import { ProteinAbundanceDataTable } from "~/scenes/BiochemicalEntityDetails/Gene/ProteinAbundanceDataTable";
import testRawData from "~/__tests__/fixtures/protein-abundances-6-phosphofructo-2-kinase";
import testRawMetadata from "~/__tests__/fixtures/protein-metadata-6-phosphofructo-2-kinase";
import rawRelatedReactions from "~/__tests__/fixtures/related_reactions";
import rawUniprotDescription from "~/__tests__/fixtures/uniprot_description";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Gene/MetadataSection";
import { shallow } from "enzyme";
import { getListDomElements, getSectionFromList } from "~/utils/testing_utils";
import React from "react";

/* global describe, it, expect */
describe("Gene data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "K00850";
    const organism = "Escherichia coli";
    // instantiate data table
    const dataTable = new ProteinAbundanceDataTable();

    // assert URL correct
    expect(dataTable.getUrl(entity)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40"
    );
    expect(dataTable.getUrl(entity, organism)).toEqual(
      "proteins/proximity_abundance/proximity_abundance_kegg/?kegg_id=K00850&distance=40&anchor=Escherichia coli"
    );
  });

  it("Formats abundance data correctly", () => {
    // instantiate data table
    const dataTable = new ProteinAbundanceDataTable();

    // format raw data
    const query = "K00850";
    const organism = "Escherichia coli";
    const formattedData = dataTable.formatData(query, organism, testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(30);

    let formatedDatum = formattedData[17];
    expect(formatedDatum).toEqual({
      abundance: 2.04,
      proteinName: "6-phosphofructo-2-kinase 1 ",
      uniprotId: "P40433",
      geneSymbol: "PFK26",
      organism: "Saccharomyces cerevisiae S288C",
      taxonomicProximity: 8,
      organ: "whole organism"
    });

    expect(formattedData[7].organism).toEqual(
      "Schizosaccharomyces pombe 972h-"
    );
    expect(formattedData[8].geneSymbol).toEqual(null);

    const formattedDataWithoutTaxonomicData = dataTable.formatData(
      "K00850",
      null,
      testRawData
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

  it("Properly format columns", () => {
    const dummy_data = null;
    const colDefs = ProteinAbundanceDataTable.getColDefs(
      null,
      null,
      dummy_data,
      null
    );

    const uniprotCol = getSectionFromList(colDefs, "headerName", "UniProt id");
    expect(uniprotCol.cellRenderer({ value: "P26396" })).toEqual(
      '<a href="https://www.uniprot.org/uniprot/P26396" target="_blank" rel="noopener noreferrer">P26396</a>'
    );

    const sourceCol = getSectionFromList(colDefs, "headerName", "Source");
    expect(sourceCol.cellRenderer({ value: "P26396" })).toEqual(
      '<a href="https://pax-db.org/search?q=P26396" target="_blank" rel="noopener noreferrer">PAXdb</a>'
    );

    const nullTaxonSimCol = getSectionFromList(
      colDefs,
      "headerName",
      "Taxonomic similarity"
    );
    expect(nullTaxonSimCol).toEqual(null);

    const organism = "Escherichia coli";
    const rankings = ["species", "genus", "family"];
    const colDefsWithOrganism = ProteinAbundanceDataTable.getColDefs(
      null,
      organism,
      dummy_data,
      rankings
    );
    const taxonSimCol = getSectionFromList(
      colDefsWithOrganism,
      "field",
      "taxonomicProximity"
    );
    expect(taxonSimCol.valueFormatter({ value: 2 })).toEqual("Family");
  });

  it("Gets correct metadata url ", () => {
    const query = "K00850";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "kegg/get_meta/?kegg_ids=K00850"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(
      "K00850",
      null,
      testRawMetadata
    );
    expect(processedMetadata.koNumber).toEqual("K00850");
    expect(processedMetadata.title).toEqual("6-phosphofructokinase 1");
  });

  it("Formats metadata data correctly", () => {
    // format processed data
    const processedMetadata = MetadataSection.processMetadata(
      "K00850",
      null,
      testRawMetadata
    );

    expect(MetadataSection.formatTitle(processedMetadata)).toEqual(
      "6-phosphofructokinase 1"
    );

    const formattedMetadata = MetadataSection.formatMetadata(
      "K00850",
      null,
      processedMetadata
    );

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const descriptionMetadataWrapper = shallow(formattedMetadata[0].content);

    const description = getListDomElements(
      descriptionMetadataWrapper,
      "div",
      "html"
    );

    expect(description).toEqual(['<div><div class="loader"></div></div>']);

    const formattedCrossReferences = getSectionFromList(
      formattedMetadata,
      "id",
      "cross-refs"
    );
    expect(formattedCrossReferences.title).toEqual("Cross references");

    const namesMetadataWrapper = shallow(formattedCrossReferences.content);

    const correct_list_of_names = ["KEGG orthology:  K00850"];

    const actual_list_of_names = getListDomElements(
      namesMetadataWrapper,
      ".key-value-list li",
      "text"
    );

    expect(actual_list_of_names).toEqual(
      expect.arrayContaining(correct_list_of_names)
    );
  });

  it("get description from uniprot", () => {
    const emptyUniprotDescription = MetadataSection.processDescriptionFromUniprot(
      "K00850",
      null
    );
    expect(emptyUniprotDescription).toEqual("No description available.");
    const uniprotDescription = MetadataSection.processDescriptionFromUniprot(
      "K00850",
      rawUniprotDescription
    );
    expect(uniprotDescription).toEqual(
      "Catalyzes the phosphorylation of D-fructose 6-phosphate to fructose 1,6-bisphosphate by ATP, the first committing step of glycolysis"
    );
  });

  it("formats related reactions", () => {
    // format raw data
    const relatedReactions = MetadataSection.processRelatedReactions(
      "Escherichia coli",
      rawRelatedReactions
    );
    const formattedReactions = shallow(<div>{relatedReactions}</div>);
    const reactionLinksExternal = getListDomElements(formattedReactions, "a");
    const correctListOfLinksExternal = [
      '<a href="https://enzyme.expasy.org/EC/4.2.1.46" target="_blank" rel="noopener noreferrer">4.2.1.46</a>',
      '<a href="https://enzyme.expasy.org/EC/4.2.1.46" target="_blank" rel="noopener noreferrer">4.2.1.46</a>'
    ];
    expect(reactionLinksExternal).toEqual(
      expect.arrayContaining(correctListOfLinksExternal)
    );

    expect(formattedReactions.text()).toEqual(
      expect.stringContaining("dTDP-glucose 4,6-dehydratase")
    );

    expect(formattedReactions.text()).toEqual(
      expect.stringContaining(
        "dTDPglucose → dTDP-4-dehydro-6-deoxy-D-glucose + H2O"
      )
    );
  });
});
