import { RateConstantsDataTable } from "~/scenes/BiochemicalEntityDetails/Reaction/RateConstantsDataTable";
import testRawData from "~/__tests__/fixtures/reaction-constants-adenylate-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Reaction/MetadataSection";
import { shallow } from "enzyme";
import { getListDomElements, getSectionFromList } from "~/utils/testing_utils";

/* global describe, it, expect */
describe("Reaction data page", () => {
  it("Gets correct reaction data url", () => {
    const entity = "ATP,AMP-->ADP";

    // assert URL correct
    expect(RateConstantsDataTable.getUrl(entity)).toEqual(
      "reactions/kinlaw_by_name/?_from=0&size=1000&bound=tight&substrates=ATP%7CAMP&products=ADP"
    );

    expect(RateConstantsDataTable.getUrl(entity, "Escherichia coli")).toEqual(
      "reactions/kinlaw_by_name/?_from=0&size=1000&bound=tight&substrates=ATP%7CAMP&products=ADP&taxon_distance=true&species=Escherichia coli"
    );
  });

  it("Formats data correctly", () => {
    // format raw data
    const formattedData = RateConstantsDataTable.formatData(
      testRawData,
      "escherichia coli",
      9
    );
    //console.log(formattedData)

    // test formatted data
    expect(formattedData).toHaveLength(10);

    expect(formattedData).toEqual(
      expect.arrayContaining([
        {
          kcat: 650,
          km: {},
          organism: "Gallus gallus",
          ph: 8,
          source: 6051,
          temperature: 30,
          wildtypeMutant: "wildtype",
          taxonomicProximity: 7
        },
        {
          kcat: 680,
          km: {},
          organism: "Gallus gallus",
          wildtypeMutant: "mutant",
          temperature: 30,
          ph: 8,
          source: 6052,
          taxonomicProximity: 7
        }
      ])
    );

    expect(formattedData[5].organism).toEqual("Gallus gallus");
    expect(formattedData[5].km).toEqual({ AMP: 0.0014 });
    expect(formattedData[9].km).toEqual({});
  });

  it("Properly format columns", () => {
    const formattedData = RateConstantsDataTable.formatData(
      testRawData,
      null,
      null
    );
    const colDefs = RateConstantsDataTable.getColDefs(
      null,
      formattedData,
      null
    );

    expect(getSectionFromList(colDefs, "field", "kcat")).not.toEqual(null);
    expect(getSectionFromList(colDefs, "field", "km.AMP")).not.toEqual(null);

    const sourceCol = getSectionFromList(colDefs, "field", "source");
    expect(sourceCol.cellRenderer({ value: "11554" })).toEqual(
      '<a href="http://sabiork.h-its.org/newSearch/index?q=EntryID:11554" target="_blank" rel="noopener noreferrer">SABIO-RK</a>'
    );

    const nullTaxonSimCol = getSectionFromList(
      colDefs,
      "headerName",
      "Taxonomic similarity"
    );
    expect(nullTaxonSimCol).toEqual(null);

    const organism = "Escherichia coli";
    const rankings = ["species", "genus", "family"];
    const colDefsWithOrganism = RateConstantsDataTable.getColDefs(
      organism,
      formattedData,
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
    const query = "ATP,AMP-->ADP";
    //const organism = "Saccharomyces cerevisiae S288C";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "reactions/kinlaw_by_name/?_from=0&size=1000&bound=tight&substrates=ATP%7CAMP&products=ADP"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(processedMetadata.reactionId).toEqual("82");
    expect(processedMetadata.substrates).toEqual(["AMP", "ATP"]);
    expect(processedMetadata.products).toEqual(["ADP"]);
    expect(processedMetadata.ecNumber).toEqual("2.7.4.3");
    expect(processedMetadata.enzyme).toEqual("Adenylate kinase");
    expect(processedMetadata.equation).toEqual("AMP + ATP → ADP");

    expect(processedMetadata.pathways).toEqual(
      expect.arrayContaining([
        {
          kegg_pathway_code: "ko00230",
          pathway_description: "Purine metabolism"
        }
      ])
    );
  });

  it("Formats metadata data correctly", () => {
    // format processed data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(MetadataSection.formatTitle(processedMetadata)).toEqual(
      "Adenylate kinase"
    );
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const formattedMetadataWrapper = shallow(formattedMetadata[0].content);

    const correctListOfMetadata = [
      "Enzyme: Adenylate kinase",
      "Equation: AMP + ATP → ADP",
      "EC code: 2.7.4.3"
    ];

    const actualListOfMetadata = getListDomElements(
      formattedMetadataWrapper,
      ".key-value-list li",
      "text"
    );

    expect(actualListOfMetadata).toEqual(
      expect.arrayContaining(correctListOfMetadata)
    );
  });

  it("Test processing functions", () => {
    // format raw data
    const resources = [
      { id: "82", namespace: "sabiork.reaction" },
      { id: "2.7.4.3", namespace: "ec-code" }
    ];
    expect(MetadataSection.getEcNum(resources)).toEqual("2.7.4.3");
    expect(MetadataSection.getReactionId(resources)).toEqual("82");

    const substrates = [
      {
        substrate_name: "AMP"
      },
      { substrate_name: "ATP" }
    ];

    const products = [
      {
        product_name: "ADP"
      }
    ];
    expect(MetadataSection.getSubstrateNames(substrates)).toEqual([
      "AMP",
      "ATP"
    ]);
    expect(MetadataSection.getProductNames(products)).toEqual(["ADP"]);

    expect(MetadataSection.formatSide(["AMP", "ATP"])).toEqual("AMP + ATP");
  });
});
