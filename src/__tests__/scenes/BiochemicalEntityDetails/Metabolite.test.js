import { ConcentrationDataTable } from "~/scenes/BiochemicalEntityDetails/Metabolite/ConcentrationDataTable";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Metabolite/MetadataSection";
import testRawData from "~/__tests__/fixtures/metabolite-concentrations-dTDP-D-Glucose";
import testRawMetadata from "~/__tests__/fixtures/metabolite-metadata-udp.json";
import { mount, shallow } from "enzyme";
import { getListDomElements, getSectionFromList } from "~/utils/testing_utils";

/* global describe, it, expect */
describe("Metabolite data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    // assert URL correct
    expect(ConcentrationDataTable.getUrl(entity)).toEqual(
      "metabolites/concentration/?metabolite=dTDP-D-Glucose&abstract=true"
    );
    expect(ConcentrationDataTable.getUrl(entity, organism)).toEqual(
      "metabolites/concentration/?metabolite=dTDP-D-Glucose&abstract=true&species=Escherichia coli"
    );
  });

  it("Formats concentration data correct", () => {
    // format raw data
    const organism = "Escherichia coli";
    const formattedData = ConcentrationDataTable.formatData(
      testRawData,
      organism
    );

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

  it("test getColDefs", () => {
    const colDefs = ConcentrationDataTable.getColDefs(null, null, null);

    const tanimotoCol = getSectionFromList(
      colDefs,
      "field",
      "tanimotoSimilarity"
    );
    expect(tanimotoCol.valueFormatter({ value: 0.89345 })).toEqual("0.893");

    const sourceCol = getSectionFromList(colDefs, "headerName", "Source");
    expect(
      sourceCol.cellRenderer({ value: { source: "ecmdb", id: "M2MDB000319" } })
    ).toEqual(
      '<a href="http://ecmdb.ca/compounds/M2MDB000319" target="_blank" rel="noopener noreferrer">ECMDB</a>'
    );
    expect(
      sourceCol.cellRenderer({ value: { source: "ymdb", id: "YMDB00097" } })
    ).toEqual(
      '<a href="http://www.ymdb.ca/compounds/YMDB00097" target="_blank" rel="noopener noreferrer">YMDB</a>'
    );

    const nullTaxonSimCol = getSectionFromList(
      colDefs,
      "headerName",
      "Taxonomic similarity"
    );
    expect(nullTaxonSimCol).toEqual(null);

    const organism = "Escherichia coli";
    const rankings = ["species", "genus", "family"];
    const colDefsWithOrganism = ConcentrationDataTable.getColDefs(
      organism,
      null,
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
    const query = "dTDP-D-Glucose";
    const organism = "Escherichia coli";
    expect(MetadataSection.getMetadataUrl(query, organism)).toEqual(
      "/metabolites/meta/?_input=dTDP-D-Glucose"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);
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

  it("Formats metadata data correctly", () => {
    // format processed data
    let processedMetadata = MetadataSection.processMetadata(testRawMetadata);
    expect(MetadataSection.formatTitle(processedMetadata)).toEqual(
      "Uridine 5'-diphosphate"
    );
    const formattedMetadata = MetadataSection.formatMetadata(processedMetadata);

    const formattedDescription = getSectionFromList(
      formattedMetadata,
      "id",
      "description"
    );
    expect(formattedDescription.title).toEqual("Description");

    const descriptionsWrapper = shallow(formattedDescription.content);
    expect(descriptionsWrapper.text().substring(1, 30)).toEqual(
      "LazyLoad />Uridine 5'-diphosp"
    );

    const formattedSynonyms = getSectionFromList(
      formattedMetadata,
      "id",
      "synonyms"
    );
    expect(formattedSynonyms.title).toEqual("Synonyms");
    const synonymsWrapper = mount(formattedSynonyms.content);
    expect(synonymsWrapper.text()).toEqual("5'-UDPUDP");

    const formattedLinks = getSectionFromList(
      formattedMetadata,
      "id",
      "cross-refs"
    );
    expect(formattedLinks.title).toEqual("Cross references");
    const linksWrapper = shallow(formattedLinks.content);

    const correctListOfLinks = [
      '<a href="https://biocyc.org/compound?id=UDP" target="_blank" rel="noopener noreferrer">UDP</a>',
      '<a href="https://webbook.nist.gov/cgi/cbook.cgi?ID=58-98-0" target="_blank" rel="noopener noreferrer">58-98-0</a>',
      '<a href="https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:17659" target="_blank" rel="noopener noreferrer">17659</a>',
      '<a href="https://www.chemspider.com/Chemical-Structure.5809.html" target="_blank" rel="noopener noreferrer">5809</a>',
      '<a href="http://ecmdb.ca/compounds/M2MDB000123" target="_blank" rel="noopener noreferrer">M2MDB000123</a>',
      '<a href="http://www.hmdb.ca/metabolites/HMDB00295" target="_blank" rel="noopener noreferrer">HMDB00295</a>',
      '<a href="https://www.genome.jp/dbget-bin/www_bget?cpd:C00015" target="_blank" rel="noopener noreferrer">C00015</a>',
      '<a href="https://pubchem.ncbi.nlm.nih.gov/compound/6031" target="_blank" rel="noopener noreferrer">6031</a>'
    ];

    const actualListOfLinks = getListDomElements(linksWrapper, "a");
    expect(actualListOfLinks).toEqual(
      expect.arrayContaining(correctListOfLinks)
    );

    const formattedPhysics = getSectionFromList(
      formattedMetadata,
      "id",
      "physics"
    );
    expect(formattedPhysics.title).toEqual("Physics");
    const physicsWrapper = shallow(formattedPhysics.content);

    const correctListOfPhysics = [
      "<li><b>SMILES:</b> O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O</li>",
      "<li><b>InChI:</b> InChI=1S/C9H14N2O12P2/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(22-8)3-21-25(19,20)23-24(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1</li>",
      "<li><b>Formula:</b> <span>C<sub>9</sub></span><span>H<sub>14</sub></span><span>N<sub>2</sub></span><span>O<sub>12</sub></span><span>P<sub>2</sub></span></li>",
      "<li><b>Molecular weight:</b> 404.1612</li>",
      "<li><b>Charge:</b> 0</li>",
      "<li><b>Physiological charge:</b> -2</li>"
    ];

    const actualListOfPhysics = getListDomElements(physicsWrapper, "li");
    expect(actualListOfPhysics).toEqual(
      expect.arrayContaining(correctListOfPhysics)
    );

    const formattedLocalizations = getSectionFromList(
      formattedMetadata,
      "id",
      "localizations"
    );
    expect(formattedLocalizations.id).toEqual("localizations");
    expect(formattedLocalizations.title).toEqual("Localizations");
    const localizationsWrapper = shallow(formattedLocalizations.content);
    expect(localizationsWrapper.html()).toEqual(
      '<ul class="two-col-list"><li><div class="bulleted-list-item">Cytosol</div></li></ul>'
    );

    const formattedPathways = getSectionFromList(
      formattedMetadata,
      "id",
      "pathways"
    );
    expect(formattedPathways.id).toEqual("pathways");
    expect(formattedPathways.title).toEqual("Pathways");
    const pathwaysWrapper = shallow(formattedPathways.content);

    const correctListOfPathways = [
      '<li><a href="https://www.genome.jp/dbget-bin/www_bget?map00240" class="bulleted-list-item" target="_blank" rel="noopener noreferrer">Pyrimidine metabolism</a></li>',
      '<li><div class="bulleted-list-item">Superpathway of (KDO)<SUB>2</SUB>-lipid A biosynthesis</div></li>'
    ];

    const actualListOfPathways = getListDomElements(pathwaysWrapper, "li");
    expect(actualListOfPathways).toEqual(
      expect.arrayContaining(correctListOfPathways)
    );

    let structure =
      formattedMetadata[0].content.props.children[0].props.children.props
        .children.props.src;
    structure = structure.substring(0, structure.indexOf("image"));
    expect(structure).toEqual(
      "https://cactus.nci.nih.gov/chemical/structure/O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O/"
    );

    processedMetadata.physics = {
      inchi: "InChI=1S",
      inchiKey: "XCC"
    };

    const formattedMetadataWithInchi = MetadataSection.formatMetadata(
      processedMetadata
    );

    let structureWithInchi =
      formattedMetadataWithInchi[0].content.props.children[0].props.children
        .props.children.props.src;
    structureWithInchi = structureWithInchi.substring(
      0,
      structureWithInchi.indexOf("image")
    );

    expect(structureWithInchi).toEqual(
      "https://cactus.nci.nih.gov/chemical/structure/InChI=InChI=1S/"
    );

    processedMetadata.physics = {
      inchiKey: "XCC"
    };

    const formattedMetadataWithInchiKey = MetadataSection.formatMetadata(
      processedMetadata
    );
    let structureWithInchiKey =
      formattedMetadataWithInchiKey[0].content.props.children[0].props.children
        .props.children.props.src;
    structureWithInchiKey = structureWithInchiKey.substring(
      0,
      structureWithInchiKey.indexOf("image")
    );

    expect(structureWithInchiKey).toEqual(
      "https://cactus.nci.nih.gov/chemical/structure/InChIKey=XCC/"
    );
  });
});
