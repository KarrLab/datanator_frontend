import { RateConstantsDataTable } from "~/scenes/BiochemicalEntityDetails/Reaction/RateConstantsDataTable";
import testRawData from "~/__tests__/fixtures/reaction-constants-adenylate-kinase";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Reaction/MetadataSection";
import { shallow } from "enzyme";
import { get_list_DOM_elements } from "~/utils/testing_utils";

/* global describe, it, expect */
describe("Reaction data page", () => {
  it("Gets correct reaction data url", () => {
    const entity = "ATP,AMP --> ADP";

    // assert URL correct
    expect(RateConstantsDataTable.getUrl(entity)).toEqual(
      "reactions/kinlaw_by_name/?_from=0&size=1000&bound=tight&substrates=ATP,AMP&products=ADP"
    );
  });

  it("Formats concentration data correctly", () => {
    // format raw data
    const formattedData = RateConstantsDataTable.formatData(
      testRawData,
      null,
      null
    );
    //console.log(formattedData)

    // test formatted data
    expect(formattedData).toHaveLength(62);

    expect(formattedData).toEqual(
      expect.arrayContaining([
        {
          kcat: 650,
          km: {},
          organism: "Gallus gallus",
          ph: 8,
          source: 6051,
          temperature: 30,
          wildtypeMutant: "wildtype"
        },
        {
          kcat: 680,
          km: {},
          organism: "Gallus gallus",
          wildtypeMutant: "mutant",
          temperature: 30,
          ph: 8,
          source: 6052
        }
      ])
    );

    expect(formattedData[20].organism).toEqual("Homo sapiens");
    expect(formattedData[5].km).toEqual({ AMP: 0.0014 });
    expect(formattedData[10].km).toEqual({});
  });

  it("Gets correct metadata url ", () => {
    const query = "ATP + AMP --> ADP";
    //const organism = "Saccharomyces cerevisiae S288C";
    expect(MetadataSection.getMetadataUrl(query)).toEqual(
      "reactions/kinlaw_by_name/?_from=0&size=1000&bound=tight&substrates=ATP + AMP&products=ADP"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    expect(processedMetadata).toEqual({
      reactionId: "82",
      substrates: ["AMP", "ATP"],
      products: ["ADP"],
      ecNumber: "2.7.4.3",
      enzyme: "Adenylate kinase",
      equation: "AMP + ATP → ADP"
    });
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

    const correct_list_of_metadata = [
      "Enzyme: Adenylate kinase",
      "Equation: AMP + ATP → ADP",
      "EC code: 2.7.4.3"
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
