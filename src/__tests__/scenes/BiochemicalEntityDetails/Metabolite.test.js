import { ConcentrationDataTable } from "~/scenes/BiochemicalEntityDetails/Metabolite/ConcentrationDataTable";
import { MetadataSection } from "~/scenes/BiochemicalEntityDetails/Metabolite/MetadataSection";
import testRawData from "~/__tests__/fixtures/metabolite-concentrations-Alpha-D-glucose 1-phosphate.json";
import testRawMetadata from "~/__tests__/fixtures/metabolite-metadata-udp.json";
import { mount, shallow } from "enzyme";
import { getListDomElements, getSectionFromList } from "~/utils/testing_utils";
import SearchResultsList from "~/scenes/BiochemicalEntityDetails/Metabolite/SearchResultsList";

/* global describe, it, expect */
describe("Metabolite data page", () => {
  it("Gets correct concentration data url", () => {
    const entity = "dTDP-D-Glucose";
    const organism = "Escherichia coli";

    // assert URL correct
    expect(ConcentrationDataTable.getUrl(entity)).toEqual(
      "metabolites/concentrations/similar_compounds/?inchikey=dTDP-D-Glucose&threshold=0.6&taxon_distance=false"
    );
    expect(ConcentrationDataTable.getUrl(entity, organism)).toEqual(
      "metabolites/concentrations/similar_compounds/?inchikey=dTDP-D-Glucose&threshold=0.6&target_species=Escherichia coli&taxon_distance=true"
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
    expect(formattedData).toHaveLength(27);

    let formatedDatum = formattedData[26];
    expect(formatedDatum).toEqual({
      name: "Glucose 1-phosphate",
      link: {
        label: "Glucose 1-phosphate",
        query: "HXXFSFRBOHSIMQ-VFUOTHLCSA-N"
      },
      tanimotoSimilarity: 1.0,
      value: 33.4,
      uncertainty: null,
      units: "μM",
      organism: "Escherichia coli BW25113",
      taxonomicProximity: 0,
      growthPhase: "Stationary",
      growthMedia:
        "48 mM Na2HPO4, 22 mM KH2PO4, 10 mM NaCl, 45 mM (NH4)2SO4, supplemented with 1 mM MgSO4, 1 mg/l thiamine\\u00b7HCl, 5.6 mg/l CaCl2, 8 mg/l FeCl3, 1 mg/l MnCl2\\u00b74H2O, 1.7 mg/l ZnCl2, 0.43 mg/l CuCl2\\u00b72H2O, 0.6 mg/l CoCl2\\u00b72H2O and 0.6 mg/l Na2MoO4\\u00b72H2O.  4 g/L Gluco",
      growthConditions:
        "Bioreactor, pH controlled, O2 and CO2 controlled, dilution rate: 0.2/h",
      source: {
        url: "https://www.ncbi.nlm.nih.gov/pubmed/17379776",
        id: "PubMed: 17379776"
      }
    });

    expect(formattedData[0].organism).toEqual("Escherichia coli");
    expect(formattedData[0].source).toEqual({
      url: "https://dx.doi.org/10.1016/j.cels.2015.09.008",
      id: "DOI: 10.1016/j.cels.2015.09.008"
    });
    expect(formattedData[0].growthPhase).toEqual(null);
    expect(formattedData[0].growthMedia).toEqual(null);
    expect(formattedData[0].growthConditions).toEqual(null);
  });

  it("test getColDefs", () => {
    const colDefs = ConcentrationDataTable.getColDefs(null, null, null);

    const sourceCol = getSectionFromList(colDefs, "headerName", "Source");
    expect(
      sourceCol.cellRenderer({
        value: {
          url: "http://ecmdb.ca/compounds/M2MDB000319",
          id: "ECMDB: M2MDB000319"
        }
      })
    ).toEqual(
      '<a href="http://ecmdb.ca/compounds/M2MDB000319" target="_blank" rel="noopener noreferrer">ECMDB: M2MDB000319</a>'
    );
    expect(
      sourceCol.cellRenderer({
        value: {
          url: "http://www.ymdb.ca/compounds/YMDB00097",
          id: "YMDB: YMDB00097"
        }
      })
    ).toEqual(
      '<a href="http://www.ymdb.ca/compounds/YMDB00097" target="_blank" rel="noopener noreferrer">YMDB: YMDB00097</a>'
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
    const query = "BAWFJGJZGIEFAR-NNYOXOHSSA-O";
    const organism = "Escherichia coli";
    expect(MetadataSection.getMetadataUrl(query, organism)).toEqual(
      "metabolites/meta/?inchikey=BAWFJGJZGIEFAR-NNYOXOHSSA-O"
    );
  });

  it("Processes metadata data correctly", () => {
    // format raw data
    const processedMetadata = MetadataSection.processMetadata(testRawMetadata);
    // test processed data
    expect(Object.keys(processedMetadata.cellularLocations)).toHaveLength(1);
    expect(Object.keys(processedMetadata.cellularLocations)[0]).toEqual(
      "Escherichia coli (ECMDB)"
    );
    expect(
      processedMetadata.cellularLocations["Escherichia coli (ECMDB)"]
    ).toHaveLength(1);
    expect(
      processedMetadata.cellularLocations["Escherichia coli (ECMDB)"][0]
    ).toEqual("Cytosol");

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

    const formattedDataReaction = getSectionFromList(
      formattedMetadata,
      "id",
      "reactions"
    );
    const reactionsWrapper = shallow(formattedDataReaction.content);
    expect(reactionsWrapper.find(SearchResultsList)).toHaveLength(1);

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

    const formattedChemistry = getSectionFromList(
      formattedMetadata,
      "id",
      "chemistry"
    );
    expect(formattedChemistry.title).toEqual("Chemistry");
    const chemistryWrapper = shallow(formattedChemistry.content);

    const correctListOfChemistry = [
      "<li><b>SMILES:</b> O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O</li>",
      "<li><b>InChI:</b> InChI=1S/C9H14N2O12P2/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(22-8)3-21-25(19,20)23-24(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1</li>",
      "<li><b>Formula:</b> <span>C<sub>9</sub></span><span>H<sub>14</sub></span><span>N<sub>2</sub></span><span>O<sub>12</sub></span><span>P<sub>2</sub></span></li>",
      "<li><b>Molecular weight:</b> 404.1612</li>",
      "<li><b>Charge:</b> 0</li>",
      "<li><b>Physiological charge:</b> -2</li>"
    ];

    const actualListOfChemistry = getListDomElements(chemistryWrapper, "li");
    expect(actualListOfChemistry).toEqual(
      expect.arrayContaining(correctListOfChemistry)
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
      '<ul class="vertically-spaced"><li><div class="bulleted-list-item">Escherichia coli (ECMDB)<ul><li>Cytosol</li></ul></div></li></ul>'
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

    processedMetadata.chemistry = {
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

    processedMetadata.chemistry = {
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
