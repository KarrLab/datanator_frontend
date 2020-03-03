import { ConcentrationDataTable } from "~/scenes/BiochemicalEntityDetails/Metabolite/ConcentrationDataTable";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Metabolite/MetadataSection";
import testRawData from "~/__tests__/fixtures/metabolite-concentrations-dTDP-D-Glucose";
import { shallow } from "enzyme";
import React from "react";

/* global describe, it, expect */
describe("Metabolite data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    // assert URL correct
    expect(ConcentrationDataTable.getUrl(entity)).toEqual(
      "metabolites/concentration/" + "?metabolite=" + entity + "&abstract=true"
    );
    expect(ConcentrationDataTable.getUrl(entity, organism)).toEqual(
      "metabolites/concentration/" +
        "?metabolite=" +
        entity +
        "&abstract=true" +
        "&species=" +
        organism
    );
  });

  it("Formats concentration data correct", async () => {
    // format raw data
    const formattedData = ConcentrationDataTable.formatData(testRawData);

    // test formatted data
    expect(formattedData).toHaveLength(10);

    let formatedDatum = formattedData[0];
    expect(formatedDatum).toEqual({
      name: "Uridine 5'-diphosphate",
      tanimotoSimilarity: 0.783,
      value: 1790,
      uncertainty: null,
      units: "uM",
      organism: "Escherichia coli K12 NCM3722",
      taxonomicProximity: 1,
      growthPhase: "Mid-Log",
      growthMedia:
        "Gutnick minimal complete medium (4.7 g/L KH2PO4; 13.5 g/L K2HPO4; 1 g/L K2SO4; 0.1 g/L MgSO4-7H2O; 10 mM NH4Cl) with 4 g/L glucose",
      growthConditions: "Shake flask and filter culture",
      source: { source: "ecmdb", id: "M2MDB000123" }
    });

    expect(formattedData[7].organism).toEqual("Yeast");
    expect(formattedData[7].source).toEqual({
      source: "ymdb",
      id: "ymdb_id_xxx"
    });
    expect(formattedData[7].growthPhase).toEqual(null);
    expect(formattedData[7].growthMedia).toEqual(null);
    expect(formattedData[7].growthConditions).toEqual(null);
  });

  it("Gets correct metadata url ", async () => {
    const query = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    const abstract = "true";
    expect(MetadataSection.getMetadataUrl(query, organism)).toEqual(
      "metabolites/concentration/" +
        "?metabolite=" +
        query +
        "&abstract=" +
        abstract +
        (organism ? "&species=" + organism : "")
    );
  });

  it("Processes metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    // test processed data
    expect(processedMetadata.cellularLocations).toHaveLength(1);
    expect(processedMetadata.cellularLocations[0]).toEqual("Cytosol");

    expect(processedMetadata.dbLinks.biocyc).toEqual("UDP");
    expect(processedMetadata.dbLinks["kegg"]).toEqual("C00015");

    expect(processedMetadata.description[0]).toEqual(
      expect.stringContaining("Uridine 5'-diphosphate,")
    );
    expect(processedMetadata.synonyms).toEqual(["5'-UDP", "UDP"]);
  });

  it("Formats metadata data correctly", async () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawData);
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    expect(formattedMetadata[0].id).toEqual("description");
    expect(formattedMetadata[0].title).toEqual("Description");

    const descriptionsWrapper = shallow(
      <div>{formattedMetadata[0].content}</div>
    );
    expect(descriptionsWrapper.text().substring(1, 30)).toEqual(
      "LazyLoad />Uridine 5'-diphosp"
    );

    expect(formattedMetadata[1].id).toEqual("synonyms");
    expect(formattedMetadata[1].title).toEqual("Synonyms");
    const synonymsWrapper = shallow(<div>{formattedMetadata[1].content}</div>);

    expect(synonymsWrapper.text()).toEqual("5'-UDPUDP");

    expect(formattedMetadata[2].id).toEqual("links");
    expect(formattedMetadata[2].title).toEqual("Database links");
    const linksWrapper = shallow(<div>{formattedMetadata[2].content}</div>);

    expect(
      linksWrapper
        .find("a")
        .at(0)
        .html()
    ).toEqual(
      '<a href="https://biocyc.org/compound?id=UDP" target="_blank" rel="noopener noreferrer">UDP</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(1)
        .html()
    ).toEqual(
      '<a href="https://webbook.nist.gov/cgi/cbook.cgi?ID=58-98-0" target="_blank" rel="noopener noreferrer">58-98-0</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(2)
        .html()
    ).toEqual(
      '<a href="https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:17659" target="_blank" rel="noopener noreferrer">17659</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(3)
        .html()
    ).toEqual(
      '<a href="https://www.chemspider.com/Chemical-Structure.5809.html" target="_blank" rel="noopener noreferrer">5809</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(4)
        .html()
    ).toEqual(
      '<a href="http://ecmdb.ca/compounds/M2MDB000123" target="_blank" rel="noopener noreferrer">M2MDB000123</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(5)
        .html()
    ).toEqual(
      '<a href="http://www.hmdb.ca/metabolites/HMDB00295" target="_blank" rel="noopener noreferrer">HMDB00295</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(6)
        .html()
    ).toEqual(
      '<a href="https://www.genome.jp/dbget-bin/www_bget?cpd:C00015" target="_blank" rel="noopener noreferrer">C00015</a>'
    );
    expect(
      linksWrapper
        .find("a")
        .at(7)
        .html()
    ).toEqual(
      '<a href="https://pubchem.ncbi.nlm.nih.gov/compound/6031" target="_blank" rel="noopener noreferrer">6031</a>'
    );

    expect(formattedMetadata[3].id).toEqual("physics");
    expect(formattedMetadata[3].title).toEqual("Physics");
    const physicsWrapper = shallow(<div>{formattedMetadata[3].content}</div>);

    expect(
      physicsWrapper
        .find("li")
        .at(0)
        .html()
    ).toEqual(
      "<li><b>SMILES:</b> O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O</li>"
    );
    expect(
      physicsWrapper
        .find("li")
        .at(1)
        .html()
    ).toEqual(
      "<li><b>InChI:</b> InChI=1S/C9H14N2O12P2/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(22-8)3-21-25(19,20)23-24(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1</li>"
    );
    expect(
      physicsWrapper
        .find("li")
        .at(2)
        .html()
    ).toEqual(
      "<li><b>Formula:</b> <span>C<sub>9</sub></span><span>H<sub>14</sub></span><span>N<sub>2</sub></span><span>O<sub>12</sub></span><span>P<sub>2</sub></span></li>"
    );
    expect(
      physicsWrapper
        .find("li")
        .at(3)
        .html()
    ).toEqual("<li><b>Molecular weight:</b> 404.1612</li>");
    expect(
      physicsWrapper
        .find("li")
        .at(4)
        .html()
    ).toEqual("<li><b>Charge:</b> 0</li>");
    expect(
      physicsWrapper
        .find("li")
        .at(5)
        .html()
    ).toEqual("<li><b>Physiological charge:</b> -2</li>");

    expect(formattedMetadata[4].id).toEqual("localizations");
    expect(formattedMetadata[4].title).toEqual("Localizations");
    const localizationsWrapper = shallow(
      <div>{formattedMetadata[4].content}</div>
    );

    expect(localizationsWrapper.html()).toEqual(
      '<div><ul class="two-col-list"><li><div class="bulleted-list-item">Cytosol</div></li></ul></div>'
    );

    expect(formattedMetadata[5].id).toEqual("pathways");
    expect(formattedMetadata[5].title).toEqual("Pathways");
    const pathwaysWrapper = shallow(<div>{formattedMetadata[5].content}</div>);

    expect(
      pathwaysWrapper
        .find("li")
        .at(0)
        .html()
    ).toEqual(
      '<li><a href="https://www.genome.jp/dbget-bin/www_bget?map00240" class="bulleted-list-item" target="_blank" rel="noopener noreferrer">Pyrimidine metabolism</a></li>'
    );
    expect(
      pathwaysWrapper
        .find("li")
        .at(1)
        .html()
    ).toEqual(
      '<li><div class="bulleted-list-item">Superpathway of (KDO)<SUB>2</SUB>-lipid A biosynthesis</div></li>'
    );
  });
});
