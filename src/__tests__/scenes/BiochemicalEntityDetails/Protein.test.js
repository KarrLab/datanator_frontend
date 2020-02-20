import { AbundanceDataTable } from "~/scenes/BiochemicalEntityDetails/Protein/AbundanceDataTable";
import testRawData from "~/__tests__/fixtures/protein-abundances-6-phosphofructo-2-kinase";

/* global describe, it, expect */
describe("Protein data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "K00900";
    const organism = "Escherichia coli";
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

  it("Formats concentration data correct", async () => {
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
    //expect(formattedData[7].source).toEqual({
    //  source: "ymdb",
    //  id: "ymdb_id_xxx"
    //});
    expect(formattedData[20].geneSymbol).toEqual(null);

  });
});
