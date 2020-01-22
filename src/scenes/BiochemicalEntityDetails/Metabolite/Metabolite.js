import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { MetadataSection } from "./MetadataSection";
import { getDataFromApi } from "~/services/MongoApi";
import { abstractMolecule } from "~/data/actions/pageAction";
import {
  setLineage,
  setTotalData,
  setSelectedData
} from "~/data/actions/resultsAction";

import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from '@ag-grid-enterprise/all-modules';
import StatsToolPanel from "./StatsToolPanel.js";
import { TaxonomyFilter } from "../TaxonomyFilter.js";
import { TanimotoFilter } from "../TanimotoFilter.js";
import PartialMatchFilter from "../PartialMatchFilter.js";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.scss";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham/sass/ag-theme-balham.scss";

import "../BiochemicalEntityDetails.scss";
import "./Metabolite.scss";

const queryString = require("query-string");
const sideBar = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel"
    },
    {
      id: "filters",
      labelDefault: "Filters",
      labelKey: "filters",
      iconKey: "filter",
      toolPanel: "agFiltersToolPanel"
    },
    {
      id: "customStats",
      labelDefault: "Stats",
      labelKey: "customStats",
      iconKey: "customstats",
      toolPanel: "statsToolPanel"
    }
  ],
  position: "left",
  defaultToolPanel: "filters"
};

@connect(store => {
  return {
    moleculeAbstract: store.page.moleculeAbstract,
    totalData: store.results.totalData
  };
}) //the names given here will be the names of props
class Metabolite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metaboliteMetadata: [],
      modules: AllModules,
      lineage: [],
      data_arrived: false,
      tanimoto: false,
      columnDefs: [
        {
          headerName: "Molecule",
          field: "name",
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          //filter: 'taxonomyFilter',
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"]
        },
        {
          headerName: "Concentrations",
          field: "concentration",
          sortable: true,
          filter: "agNumberColumnFilter"
        },
        { headerName: "Error", field: "error", hide: true },
        {
          headerName: "Organism",
          field: "organism",
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Source Link",
          field: "source_link",

          cellRenderer: function(params) {
            if (params.value["source"] === "ecmdb") {
              return (
                '<a href="http://ecmdb.ca/compounds/' +
                params.value.id +
                '" target="_blank" rel="noopener noreferrer">' +
                "ECMDB" +
                "</a>"
              );
            } else {
              return (
                '<a href="http://www.ymdb.ca/compounds/' +
                params.value.id +
                '" target="_blank" rel="noopener noreferrer">' +
                "YMDB" +
                "</a>"
              );
            }
          }
        },

        {
          headerName: "Taxonomic Distance",
          field: "taxonomic_proximity",
          hide: true,
          filter: "taxonomyFilter"
        },
        {
          headerName: "Tanimoto Similarity",
          field: "tanimoto_similarity",
          hide: true,
          filter: "tanimotoFilter"
        },
        {
          headerName: "Growth Phase",
          field: "growth_phase",
          filter: "agTextColumnFilter",
          hide: true
        },
        {
          headerName: "Conditions",
          field: "growth_conditions",
          filter: "agTextColumnFilter",
          hide: true
        },
        {
          headerName: "Media",
          field: "growth_media",
          filter: "agTextColumnFilter",
          hide: true
        }
      ],

      rowData: null,
      rowSelection: "multiple",
      autoGroupColumnDef: {
        headerName: "Conc",
        field: "concentration",
        width: 200,
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: { checkbox: true }
      },
      frameworkComponents: {
        statsToolPanel: StatsToolPanel,
        taxonomyFilter: TaxonomyFilter,
        partialMatchFilter: PartialMatchFilter,
        tanimotoFilter: TanimotoFilter
      }
    };

    this.formatData = this.formatData.bind(this);
    //this.onFirstDataRendered = this.onFirstDataRendered.bind(this);
    //this.onRowSelected = this.onRowSelected.bind(this);
  }
  componentDidMount() {
    this.getDataFromApi();
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.match.params.abstract === "true")) {
      if (this.props.moleculeAbstract === true) {
        this.props.dispatch(abstractMolecule(false));
        let url =
          "/metabolite/" +
          this.props.match.params.molecule +
          "/" +
          this.props.match.params.organism +
          "/" +
          "true";
      }
    }

    if (
      this.props.match.params.molecule !== prevProps.match.params.molecule ||
      this.props.match.params.organism !== prevProps.match.params.organism ||
      this.props.match.params.abstract !== prevProps.match.params.abstract
    ) {
      this.setState({ metaboliteMetadata: [] });
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    let abs_default = false;
    if (this.props.match.params.abstract === "true") {
      abs_default = true;
    }

    getDataFromApi([
      "metabolites/concentration/?abstract=" +
        abs_default +
        "&species=" +
        this.props.match.params.organism +
        "&metabolite=" +
        this.props.match.params.molecule
    ])
      .then(response => {
        this.formatData(response.data);
      })
      .catch(err => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
      });
    getDataFromApi([
      "taxon",
      "canon_rank_distance_by_name/?name=" + this.props.match.params.organism
    ]).then(response => {
      //this.props.dispatch(setLineage(response.data));
      this.setState({ lineage: response.data });
    });

    //this.formatData([ [ { "accession": "ECMDB00285", "average_molecular_weight": "484.1411", "biocyc_id": "UTP", "cas_registry_number": "63-39-8", "cellular_locations": { "cellular_location": "Cytosol" }, "chebi_id": "15713", "chemical_formula": "C9H15N2O15P3", "chemspider_id": "5903", "concentrations": { "concentration": [ "8290.0", "3990.0", "2370.0", "663.0" ], "concentration_units": [ "uM", "uM", "uM", "uM" ], "error": [ "0.0", "0.0", "0.0", "0.0" ], "growth_media": [ "Gutnick minimal complete medium (4.7 g/L KH2PO4; 13.5 g/L K2HPO4; 1 g/L K2SO4; 0.1 g/L MgSO4-7H2O; 10 mM NH4Cl) with 4 g/L glucose", "Gutnick minimal complete medium (4.7 g/L KH2PO4; 13.5 g/L K2HPO4; 1 g/L K2SO4; 0.1 g/L MgSO4-7H2O; 10 mM NH4Cl) with 4 g/L glycerol", "Gutnick minimal complete medium (4.7 g/L KH2PO4; 13.5 g/L K2HPO4; 1 g/L K2SO4; 0.1 g/L MgSO4-7H2O; 10 mM NH4Cl) with 4 g/L acetate", "48 mM Na2HPO4, 22 mM KH2PO4, 10 mM NaCl, 45 mM (NH4)2SO4, supplemented with 1 mM MgSO4, 1 mg/l thiamine\u00b7HCl, 5.6 mg/l CaCl2, 8 mg/l FeCl3, 1 mg/l MnCl2\u00b74H2O, 1.7 mg/l ZnCl2, 0.43 mg/l CuCl2\u00b72H2O, 0.6 mg/l CoCl2\u00b72H2O and 0.6 mg/l Na2MoO4\u00b72H2O.  4 g/L Gluco" ], "growth_status": [ "Mid-Log Phase", "Mid-Log Phase", "Mid-Log Phase", "Stationary Phase, glucose limited" ], "growth_system": [ "Shake flask and filter culture", "Shake flask and filter culture", "Shake flask and filter culture", "Bioreactor, pH controlled, O2 and CO2 controlled, dilution rate: 0.2/h" ], "internal": [ null, null, null, null ], "molecules": [ "33160000", "15960000", "9480000", "2652000" ], "molecules_error": [ "0", "0", "0", "0" ], "reference": [ { "pubmed_id": "19561621", "reference_text": "Bennett, B. D., Kimball, E. H., Gao, M., Osterhout, R., Van Dien, S. J., Rabinowitz, J. D. (2009). \"Absolute metabolite concentrations and implied enzyme active site occupancy in Escherichia coli.\" Nat Chem Biol 5:593-599." }, { "pubmed_id": "19561621", "reference_text": "Bennett, B. D., Kimball, E. H., Gao, M., Osterhout, R., Van Dien, S. J., Rabinowitz, J. D. (2009). \"Absolute metabolite concentrations and implied enzyme active site occupancy in Escherichia coli.\" Nat Chem Biol 5:593-599." }, { "pubmed_id": "19561621", "reference_text": "Bennett, B. D., Kimball, E. H., Gao, M., Osterhout, R., Van Dien, S. J., Rabinowitz, J. D. (2009). \"Absolute metabolite concentrations and implied enzyme active site occupancy in Escherichia coli.\" Nat Chem Biol 5:593-599." }, { "pubmed_id": "17379776", "reference_text": "Ishii, N., Nakahigashi, K., Baba, T., Robert, M., Soga, T., Kanai, A., Hirasawa, T., Naba, M., Hirai, K., Hoque, A., Ho, P. Y., Kakazu, Y., Sugawara, K., Igarashi, S., Harada, S., Masuda, T., Sugiyama, N., Togashi, T., Hasegawa, M., Takai, Y., Yugi, K., Arakawa, K., Iwata, N., Toya, Y., Nakayama, Y., Nishioka, T., Shimizu, K., Mori, H., Tomita, M. (2007). \"Multiple high-throughput analyses monitor the response of E. coli to perturbations.\" Science 316:593-597." } ], "strain": [ "K12 NCM3722", "K12 NCM3722", "K12 NCM3722", "BW25113" ], "temperature": [ "37 oC", "37 oC", "37 oC", "37 oC" ] }, "creation_date": "2012-05-31 10:25:32 -0600", "description": "Uridine 5'-(tetrahydrogen triphosphate). A uracil nucleotide containing three phosphate groups esterified to the sugar moiety. Uridine triphosphate has the role of a source of energy or an activator of substrates in metabolic reactions, like that of adenosine triphosphate, but more specific. When Uridine triphosphate activates a substrate, UDP-substrate is usually formed and inorganic phosphate is released. (Wikipedia)", "enzymes": { "enzyme": [ { "gene_name": "pfkB", "name": "6-phosphofructokinase isozyme 2", "protein_url": "http://ecmdb.ca/proteins/P06999.xml", "uniprot_id": "P06999", "uniprot_name": "K6PF2_ECOLI" }, { "gene_name": "ndk", "name": "Nucleoside diphosphate kinase", "protein_url": "http://ecmdb.ca/proteins/P0A763.xml", "uniprot_id": "P0A763", "uniprot_name": "NDK_ECOLI" }, { "gene_name": "pfkA", "name": "6-phosphofructokinase isozyme 1", "protein_url": "http://ecmdb.ca/proteins/P0A796.xml", "uniprot_id": "P0A796", "uniprot_name": "K6PF1_ECOLI" }, { "gene_name": "pyrG", "name": "CTP synthase", "protein_url": "http://ecmdb.ca/proteins/P0A7E5.xml", "uniprot_id": "P0A7E5", "uniprot_name": "PYRG_ECOLI" }, { "gene_name": "rpoA", "name": "DNA-directed RNA polymerase subunit alpha", "protein_url": "http://ecmdb.ca/proteins/P0A7Z4.xml", "uniprot_id": "P0A7Z4", "uniprot_name": "RPOA_ECOLI" }, { "gene_name": "rpoZ", "name": "DNA-directed RNA polymerase subunit omega", "protein_url": "http://ecmdb.ca/proteins/P0A800.xml", "uniprot_id": "P0A800", "uniprot_name": "RPOZ_ECOLI" }, { "gene_name": "udk", "name": "Uridine kinase", "protein_url": "http://ecmdb.ca/proteins/P0A8F4.xml", "uniprot_id": "P0A8F4", "uniprot_name": "URK_ECOLI" }, { "gene_name": "rpoC", "name": "DNA-directed RNA polymerase subunit beta'", "protein_url": "http://ecmdb.ca/proteins/P0A8T7.xml", "uniprot_id": "P0A8T7", "uniprot_name": "RPOC_ECOLI" }, { "gene_name": "rpoB", "name": "DNA-directed RNA polymerase subunit beta", "protein_url": "http://ecmdb.ca/proteins/P0A8V2.xml", "uniprot_id": "P0A8V2", "uniprot_name": "RPOB_ECOLI" }, { "gene_name": "nrdG", "name": "Anaerobic ribonucleoside-triphosphate reductase-activating protein", "protein_url": "http://ecmdb.ca/proteins/P0A9N8.xml", "uniprot_id": "P0A9N8", "uniprot_name": "NRDG_ECOLI" }, { "gene_name": "galF", "name": "UTP--glucose-1-phosphate uridylyltransferase", "protein_url": "http://ecmdb.ca/proteins/P0AAB6.xml", "uniprot_id": "P0AAB6", "uniprot_name": "GALF_ECOLI" }, { "gene_name": "glmU", "name": "Bifunctional protein glmU", "protein_url": "http://ecmdb.ca/proteins/P0ACC7.xml", "uniprot_id": "P0ACC7", "uniprot_name": "GLMU_ECOLI" }, { "gene_name": "galU", "name": "UTP--glucose-1-phosphate uridylyltransferase_", "protein_url": "http://ecmdb.ca/proteins/P0AEP3.xml", "uniprot_id": "P0AEP3", "uniprot_name": "GALU_ECOLI" }, { "gene_name": "mazG", "name": "Protein mazG", "protein_url": "http://ecmdb.ca/proteins/P0AEY3.xml", "uniprot_id": "P0AEY3", "uniprot_name": "MAZG_ECOLI" }, { "gene_name": "glnD", "name": "[Protein-PII] uridylyltransferase", "protein_url": "http://ecmdb.ca/proteins/P27249.xml", "uniprot_id": "P27249", "uniprot_name": "GLND_ECOLI" }, { "gene_name": "dcd", "name": "Deoxycytidine triphosphate deaminase", "protein_url": "http://ecmdb.ca/proteins/P28248.xml", "uniprot_id": "P28248", "uniprot_name": "DCD_ECOLI" }, { "gene_name": "fpr", "name": "Ferredoxin--NADP reductase", "protein_url": "http://ecmdb.ca/proteins/P28861.xml", "uniprot_id": "P28861", "uniprot_name": "FENR_ECOLI" }, { "gene_name": "nrdD", "name": "Anaerobic ribonucleoside-triphosphate reductase", "protein_url": "http://ecmdb.ca/proteins/P28903.xml", "uniprot_id": "P28903", "uniprot_name": "NRDD_ECOLI" }, { "gene_name": "rdgB", "name": "Nucleoside-triphosphatase rdgB", "protein_url": "http://ecmdb.ca/proteins/P52061.xml", "uniprot_id": "P52061", "uniprot_name": "RDGB_ECOLI" }, { "gene_name": "adk", "name": "Adenylate kinase", "protein_url": "http://ecmdb.ca/proteins/P69441.xml", "uniprot_id": "P69441", "uniprot_name": "KAD_ECOLI" }, { "gene_name": "fldB", "name": "Flavodoxin-2", "protein_url": "http://ecmdb.ca/proteins/P0ABY4.xml", "uniprot_id": "P0ABY4", "uniprot_name": "FLAW_ECOLI" }, { "gene_name": "fldA", "name": "Flavodoxin-1", "protein_url": "http://ecmdb.ca/proteins/P61949.xml", "uniprot_id": "P61949", "uniprot_name": "FLAV_ECOLI" } ] }, "experimental_properties": null, "foodb_id": null, "general_references": { "reference": [ { "pubmed_id": "21097882", "reference_text": "Keseler, I. M., Collado-Vides, J., Santos-Zavaleta, A., Peralta-Gil, M., Gama-Castro, S., Muniz-Rascado, L., Bonavides-Martinez, C., Paley, S., Krummenacker, M., Altman, T., Kaipa, P., Spaulding, A., Pacheco, J., Latendresse, M., Fulcher, C., Sarker, M., Shearer, A. G., Mackie, A., Paulsen, I., Gunsalus, R. P., Karp, P. D. (2011). \"EcoCyc: a comprehensive database of Escherichia coli biology.\" Nucleic Acids Res 39:D583-D590." }, { "pubmed_id": "22080510", "reference_text": "Kanehisa, M., Goto, S., Sato, Y., Furumichi, M., Tanabe, M. (2012). \"KEGG for integration and interpretation of large-scale molecular data sets.\" Nucleic Acids Res 40:D109-D114." }, { "pubmed_id": "17765195", "reference_text": "van der Werf, M. J., Overkamp, K. M., Muilwijk, B., Coulier, L., Hankemeier, T. (2007). \"Microbial metabolomics: toward a platform with full metabolome coverage.\" Anal Biochem 370:17-25." }, { "pubmed_id": "18331064", "reference_text": "Winder, C. L., Dunn, W. B., Schuler, S., Broadhurst, D., Jarvis, R., Stephens, G. M., Goodacre, R. (2008). \"Global metabolic profiling of Escherichia coli cultures: an evaluation of methods for quenching and extraction of intracellular metabolites.\" Anal Chem 80:2939-2948." }, { "pubmed_id": "19561621", "reference_text": "Bennett, B. D., Kimball, E. H., Gao, M., Osterhout, R., Van Dien, S. J., Rabinowitz, J. D. (2009). \"Absolute metabolite concentrations and implied enzyme active site occupancy in Escherichia coli.\" Nat Chem Biol 5:593-599." }, { "pubmed_id": "17379776", "reference_text": "Ishii, N., Nakahigashi, K., Baba, T., Robert, M., Soga, T., Kanai, A., Hirasawa, T., Naba, M., Hirai, K., Hoque, A., Ho, P. Y., Kakazu, Y., Sugawara, K., Igarashi, S., Harada, S., Masuda, T., Sugiyama, N., Togashi, T., Hasegawa, M., Takai, Y., Yugi, K., Arakawa, K., Iwata, N., Toya, Y., Nakayama, Y., Nishioka, T., Shimizu, K., Mori, H., Tomita, M. (2007). \"Multiple high-throughput analyses monitor the response of E. coli to perturbations.\" Science 316:593-597." }, { "pubmed_id": "14719996", "reference_text": "Kunzelmann K, Mall M: Pharmacotherapy of the ion transport defect in cystic fibrosis: role of purinergic receptor agonists and other potential therapeutics. Am J Respir Med. 2003;2(4):299-309." }, { "pubmed_id": "15837087", "reference_text": "Erlinge D, Harnek J, van Heusden C, Olivecrona G, Jern S, Lazarowski E: Uridine triphosphate (UTP) is released during cardiac ischemia.  Int J Cardiol. 2005 Apr 28;100(3):427-33." }, { "pubmed_id": "10927039", "reference_text": "Oosterhuis GJ, Mulder AB, Kalsbeek-Batenburg E, Lambalk CB, Schoemaker J, Vermes I: Measuring apoptosis in human spermatozoa: a biological assay for semen quality? Fertil Steril. 2000 Aug;74(2):245-50." }, { "pubmed_id": "6734601", "reference_text": "Holstege A, Manglitz D, Gerok W: Depletion of blood plasma cytidine due to increased hepatocellular salvage in D-galactosamine-treated rats. Eur J Biochem. 1984 Jun 1;141(2):339-44." } ] }, "het_id": "UTP", "hmdb_id": "HMDB00285", "inchi": "InChI=1S/C9H15N2O15P3/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(24-8)3-23-28(19,20)26-29(21,22)25-27(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,21,22)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1", "inchikey": "PGAVKCOVUIYSFO-XVFCMESISA-N", "iupac_name": "({[({[(2R,3S,4R,5R)-5-(2,4-dioxo-1,2,3,4-tetrahydropyrimidin-1-yl)-3,4-dihydroxyoxolan-2-yl]methoxy}(hydroxy)phosphoryl)oxy](hydroxy)phosphoryl}oxy)phosphonic acid", "kegg_id": "C00075", "m2m_id": "M2MDB000117", "monisotopic_moleculate_weight": "483.968527356", "msds_url": null, "name": "Uridine triphosphate", "pathways": { "pathway": [ { "description": "The metabolism of pyrimidines begins with L-glutamine interacting with water molecule and a hydrogen carbonate through an ATP driven carbamoyl phosphate synthetase resulting in a hydrogen ion, an ADP, a phosphate, an L-glutamic acid and a carbamoyl phosphate. The latter compound interacts with an L-aspartic acid through a aspartate transcarbamylase resulting in a phosphate, a hydrogen ion and a N-carbamoyl-L-aspartate. The latter compound interacts with a hydrogen ion through a dihydroorotase resulting in the release of a water molecule and a 4,5-dihydroorotic acid. This compound interacts with an ubiquinone-1 through a dihydroorotate dehydrogenase, type 2 resulting in a release of an ubiquinol-1 and an orotic acid. The orotic acid then interacts with a phosphoribosyl pyrophosphate through a orotate phosphoribosyltransferase resulting in a pyrophosphate and an orotidylic acid. The latter compound then interacts with a hydrogen ion through an orotidine-5 '-phosphate decarboxylase, resulting in an release of carbon dioxide and an Uridine 5' monophosphate. The Uridine 5' monophosphate process to get phosphorylated by an ATP driven UMP kinase resulting in the release of an ADP and an Uridine 5--diphosphate.\nUridine 5-diphosphate can be metabolized in multiple ways in order to produce a Deoxyuridine triphosphate.\n        1.-Uridine 5-diphosphate interacts with a reduced thioredoxin through a ribonucleoside diphosphate reductase 1 resulting in the release of a water molecule and an oxidized thioredoxin and an dUDP. The dUDP is then phosphorylated by an ATP through a nucleoside diphosphate kinase resulting in the release of an ADP and a DeoxyUridine triphosphate.\n        2.-Uridine 5-diphosphate interacts with a reduced NrdH glutaredoxin-like protein through a Ribonucleoside-diphosphate reductase 1 resulting in a release of a water molecule, an oxidized NrdH glutaredoxin-like protein and a dUDP. The dUDP is then phosphorylated by an ATP through a nucleoside diphosphate kinase resulting in the release of an ADP and a DeoxyUridine triphosphate.\n        3.-Uridine 5-diphosphate is phosphorylated by an ATP-driven nucleoside diphosphate kinase resulting in an ADP and an Uridinetriphosphate. The latter compound interacts with a reduced flavodoxin through ribonucleoside-triphosphate reductase resulting in the release of an oxidized flavodoxin, a water molecule and a Deoxyuridine triphosphate\n        4.-Uridine 5-diphosphate is phosphorylated by an ATP-driven nucleoside diphosphate kinase resulting in an ADP and an Uridinetriphosphate    The uridine triphosphate interacts with a L-glutamine and a water molecule through an ATP driven CTP synthase resulting in an ADP, a phosphate, a hydrogen ion, an L-glutamic acid and a cytidine triphosphate. The cytidine triphosphate interacts with a reduced flavodoxin through a ribonucleoside-triphosphate reductase resulting in the release of a water molecule, an oxidized flavodoxin and a dCTP. The dCTP interacts with a water molecule and a hydrogen ion through a dCTP deaminase resulting in a release of an ammonium molecule and a Deoxyuridine triphosphate.\n        5.-Uridine 5-diphosphate is phosphorylated by an ATP-driven nucleoside diphosphate kinase resulting in an ADP and an Uridinetriphosphate The uridine triphosphate interacts with a L-glutamine and a water molecule through an ATP driven CTP synthase resulting in an ADP, a phosphate, a hydrogen ion, an L-glutamic acid and a cytidine triphosphate. The cytidine triphosphate then interacts spontaneously with a water molecule resulting in the release of a phosphate, a hydrogen ion and a CDP. The CDP then interacts with a reduced NrdH glutaredoxin-like protein through a ribonucleoside-diphosphate reductase 2 resulting in the release of a water molecule, an oxidized NrdH glutaredoxin-like protein and a dCDP. The dCDP is then phosphorylated through an ATP driven nucleoside diphosphate kinase resulting in an ADP and a dCTP. The dCTP interacts with a water molecule and a hydrogen ion through a dCTP deaminase resulting in a release of an ammonium molecule and a Deoxyuridine triphosphate.\n        6.-Uridine 5-diphosphate is phosphorylated by an ATP-driven nucleoside diphosphate kinase resulting in an ADP and an Uridinetriphosphate The uridine triphosphate interacts with a L-glutamine and a water molecule through an ATP driven CTP synthase resulting in an ADP, a phosphate, a hydrogen ion, an L-glutamic acid and a cytidine triphosphate. The cytidine triphosphate then interacts spontaneously with a water molecule resulting in the release of a phosphate, a hydrogen ion and a CDP. The CDP interacts with a reduced thioredoxin through a ribonucleoside diphosphate reductase 1 resulting in a release of a water molecule, an oxidized thioredoxin and a dCDP. The dCDP is then phosphorylated through an ATP driven nucleoside diphosphate kinase resulting in an ADP and a dCTP. The dCTP interacts with a water molecule and a hydrogen ion through a dCTP deaminase resulting in a release of an ammonium molecule and a Deoxyuridine triphosphate.\n\nThe deoxyuridine triphosphate then interacts with a water molecule through a nucleoside triphosphate pyrophosphohydrolase resulting in a release of a hydrogen ion, a phosphate and a dUMP. The dUMP then interacts with a methenyltetrahydrofolate through a thymidylate synthase resulting in a dihydrofolic acid and a 5-thymidylic acid. Then 5-thymidylic acid is then phosphorylated through a nucleoside diphosphate kinase resulting in the release of an ADP and thymidine 5'-triphosphate.", "kegg_map_id": "ec00240", "name": "Pyrimidine metabolism", "pathwhiz_id": "PW000942", "subject": "Metabolic" }, { "description": "The metabolism of starch and sucrose begins with D-fructose interacting with a D-glucose in a reversible reaction through a maltodextrin glucosidase resulting in a water molecule and a sucrose. D-fructose is phosphorylated through an ATP driven fructokinase resulting in the release of an ADP, a hydrogen ion and a Beta-D-fructofuranose 6-phosphate. This compound can also be introduced into the cytoplasm through either a mannose PTS permease or a hexose-6-phosphate:phosphate antiporter. \nThe Beta-D-fructofuranose 6-phosphate is isomerized through a phosphoglucose isomerase resulting in a Beta-D-glucose 6-phosphate. This compound can also be incorporated by glucose PTS permease or a hexose-6-phosphate:phosphate antiporter. \nThe beta-D-glucose 6 phosphate can also be produced by a D-glucose being phosphorylated by an ATP-driven glucokinase resulting in a ADP, a hydrogen ion and a Beta-D-glucose 6 phosphate. \n\nThe beta-D-glucose can produce alpha-D-glucose-1-phosphate  by two methods:\n1.-Beta-D-glucose is isomerized into an alpha-D-Glucose 6-phosphate and then interacts in a reversible reaction through a phosphoglucomutase-1 resulting in a alpha-D-glucose-1-phosphate.\n2.-Beta-D-glucose interacts with a putative beta-phosphoglucomutase resulting in a Beta-D-glucose 1-phosphate.  Beta-D-glucose 1-phosphate can be incorporated into the cytoplasm through a \nglucose PTS permease. This compound is then isomerized into a Alpha-D-glucose-1-phosphate\nThe beta-D-glucose can cycle back into a D-fructose by first interacting with D-fructose in a reversible reaction through a Polypeptide: predicted glucosyltransferase resulting in the release of a phosphate and a sucrose. The sucrose then interacts in a reversible reaction with a water molecule through a maltodextrin glucosidase resulting in a D-glucose and a D-fructose. \n\nAlpha-D-glucose-1-phosphate can produce glycogen in by two different sets of reactions:\n1.-Alpha-D-glucose-1-phosphate interacts with a hydrogen ion and an ATP through a glucose-1-phosphate adenylyltransferase resulting in a pyrophosphate and an ADP-glucose. The ADP-glucose then interacts with an amylose through a glycogen synthase resulting in the release of an ADP and an Amylose. The amylose then interacts with 1,4-\u03b1-glucan branching enzyme resulting in glycogen\n2.- Alpha-D-glucose-1-phosphate interacts with amylose through a maltodextrin phosphorylase resulting in a phosphate and a glycogen.\n\nAlpha-D-glucose-1-phosphate can also interacts with UDP-galactose through a galactose-1-phosphate uridylyltransferase resulting in a galactose 1-phosphate and a Uridine diphosphate glucose. The UDP-glucose then interacts with an alpha-D-glucose 6-phosphate through a trehalose-6-phosphate synthase resulting in a uridine 5'-diphosphate, a hydrogen ion and a Trehalose 6- phosphate. The latter compound can also be incorporated into the cytoplasm through a trehalose PTS permease. Trehalose interacts with a water molecule through a trehalose-6-phosphate phosphatase resulting in the release of a phosphate and an alpha,alpha-trehalose.The alpha,alpha-trehalose can also be obtained from glycogen being metabolized through a glycogen debranching enzyme resulting in a the alpha, alpha-trehalose. This compound ca then be hydrated through a cytoplasmic trehalase resulting in the release of an alpha-D-glucose and a beta-d-glucose.\n\nGlycogen is then metabolized by reacting with a phosphate through a glycogen phosphorylase resulting in a alpha-D-glucose-1-phosphate and a dextrin. The dextrin is then hydrated through a glycogen phosphorylase-limit dextrin \u03b1-1,6-glucohydrolase resulting in the release of a debranched limit dextrin and a maltotetraose. This compound can also be incorporated into the cytoplasm through a \nmaltose ABC transporter. The maltotetraose interacts with a phosphate through a maltodextrin phosphorylase releasing a alpha-D-glucose-1-phosphate and a maltotriose. The maltotriose can also be incorporated through a maltose ABC transporter. The maltotriose can then interact with water through a maltodextrin glucosidase resulting in a D-glucose and a D-maltose. D-maltose can also be incorporated through a \nmaltose ABC transporter \n\nThe D-maltose can then interact with a maltotriose through a amylomaltase resulting in a maltotetraose and a D-glucose. The D-glucose is then phosphorylated through an ATP driven glucokinase resulting in a hydrogen ion, an ADP and a Beta-D-glucose 6-phosphate", "kegg_map_id": "ec00500", "name": "Starch and sucrose metabolism", "pathwhiz_id": "PW000941", "subject": "Metabolic" }, { "description": "Galactose can be synthesized through two pathways: melibiose degradation involving an alpha galactosidase and lactose degradation involving a beta galactosidase. Melibiose is first transported inside the cell through the melibiose:Li+/Na+/H+ symporter. Once inside the cell, melibiose is degraded through alpha galactosidase  into an alpha-D-galactose and a beta-D-glucose. The beta-D-glucose is phosphorylated by a glucokinase to produce a beta-D-glucose-6-phosphate which can spontaneously be turned into a alpha D glucose 6 phosphate. This alpha D-glucose-6-phosphate is metabolized into a glucose -1-phosphate through a phosphoglucomutase-1. The glucose -1-phosphate is transformed into a uridine diphosphate glucose through UTP--glucose-1-phosphate uridylyltransferase. The product, uridine diphosphate glucose, can undergo a reversible reaction in which it can be turned into uridine diphosphategalactose through an UDP-glucose 4-epimerase.\nGalactose can also be produced by lactose degradation involving a lactose permease to uptake lactose from the environment and a beta-galactosidase to turn lactose into Beta-D-galactose. \nBeta-D-galactose can also be uptaken from the environment through a galactose proton symporter.\nGalactose is degraded through the following process:\nBeta-D-galactose is introduced into the cytoplasm through a galactose proton symporter, or it can be synthesized from an alpha lactose that is introduced into the cytoplasm through a lactose permease. Alpha lactose interacts with water through a beta-galactosidase resulting in a beta-D-glucose and beta-D-galactose. Beta-D-galactose is isomerized into D-galactose. D-Galactose undergoes phosphorylation through a galactokinase, hence producing galactose 1 phosphate. On the other side of the pathway, a gluose-1-phosphate (product of the interaction of alpha-D-glucose 6-phosphate with a phosphoglucomutase resulting in a alpha-D-glucose-1-phosphate, an isomer of Glucose 1-phosphate, or an isomer of Beta-D-glucose 1-phosphate) interacts with UTP and a hydrogen ion in order to produce a uridine diphosphate glucose. This is followed by the interaction of galactose-1-phosphate with an established amount of uridine diphosphate glucose through a galactose-1-phosphate uridylyltransferase, which in turn output a glucose-1-phosphate and a uridine diphosphate galactose. The glucose -1-phosphate is transformed into a uridine diphosphate glucose through UTP--glucose-1-phosphate uridylyltransferase. The product, uridine diphosphate glucose, can undergo a reversible reaction in which it can be turned into uridine diphosphategalactose through an  UDP-glucose 4-epimerase, and so the cycle can keep going as long as more lactose or galactose is imported into the cell", "kegg_map_id": "ec00052", "name": "Galactose metabolism", "pathwhiz_id": "PW000821", "subject": "Metabolic" }, { "description": null, "kegg_map_id": "ec00520", "name": "Amino sugar and nucleotide sugar metabolism", "pathwhiz_id": null, "subject": null }, { "description": null, "kegg_map_id": "ec00040", "name": "Pentose and glucuronate interconversions", "pathwhiz_id": null, "subject": null }, { "description": "E. coli lipid A is synthesized on the cytoplasmic surface of the inner membrane. The pathway can start from the fructose 6-phosphate that is either produced in the glycolysis and pyruvate dehydrogenase or be obtained from the interaction with D-fructose interacting with a mannose PTS permease. Fructose 6-phosphate interacts with L-glutamine through a D-fructose-6-phosphate aminotransferase resulting into a L-glutamic acid and a glucosamine 6-phosphate. The latter compound is isomerized through a phosphoglucosamine mutase resulting a glucosamine 1-phosphate. This compound is acetylated, interacting with acetyl-CoA through a bifunctional protein glmU resulting in a Coenzyme A, hydrogen ion and N-acetyl-glucosamine 1-phosphate. This compound interact with UTP and hydrogen ion through the bifunctional protein glmU resulting in a pyrophosphate and a UDP-N-acetylglucosamine. This compound interacts with (3R)-3-hydroxymyristoyl-[acp] through an UDP-N-acetylglucosamine acyltransferase resulting in a holo-[acp] and a UDP-3-O[(3R)-3-hydroxymyristoyl]-N-acetyl-alpha-D-glucosamine. This compound interacts with water through UDP-3-O-acyl-N-acetylglucosamine deacetylase resulting in an acetic acid and UDP-3-O-(3-hydroxymyristoyl)-\u03b1-D-glucosamine. The latter compound interacts with (3R)-3-hydroxymyristoyl-[acp] through \nUDP-3-O-(R-3-hydroxymyristoyl)-glucosamine N-acyltransferase releasing a hydrogen ion, a holo-acp and UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine. The latter compound is hydrolase by interacting with water and a UDP-2,3-diacylglucosamine hydrolase resulting in UMP, hydrogen ion and  2,3-bis[(3R)-3-hydroxymyristoyl]-\u03b1-D-glucosaminyl 1-phosphate. This last compound then interacts with a UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine through a lipid A disaccharide synthase resulting in a release of UDP, hydrogen ion and a lipid A disaccharide.  The lipid A disaccharide is phosphorylated by an ATP mediated \ntetraacyldisaccharide 4'-kinase resulting in the release of hydrogen ion and lipid IVA. \n A D-ribulose 5-phosphate is isomerized with D-arabinose 5-phosphate isomerase 2  to result in a D-arabinose 5-phosphate. This compounds interacts with water and phosphoenolpyruvic acid through a 3-deoxy-D-manno-octulosonate 8-phosphate synthase resulting in the release of phosphate and  3-deoxy-D-manno-octulosonate 8-phosphate. This compound interacts with water through a 3-deoxy-D-manno-octulosonate 8-phosphate phosphatase thus releasing a phosphate and a 3-deoxy-D-manno-octulosonate. The latter compound interacts with CTP through a 3-deoxy-D-manno-octulosonate cytidylyltransferase resulting in a pyrophosphate and \nCMP-3-deoxy-\u03b1-D-manno-octulosonate.\n\nCMP-3-deoxy-\u03b1-D-manno-octulosonate and lipid IVA interact with each other through a KDO transferase resulting in CMP, hydrogen ion and alpha-Kdo-(2-->6)-lipid IVA. The latter compound reacts with CMP-3-deoxy-\u03b1-D-manno-octulosonate through a KDO transferase resulting in a CMP, hydrogen ion, and a a-Kdo-(2->4)-a-Kdo-(2->6)-lipid IVA. The latter compound interacts with a dodecanoyl-[acp] lauroyl acyltransferase resulting in a holo-[acp] and a (KDO)2-(lauroyl)-lipid IVA. The latter compound reacts with a myristoyl-[acp] through a myristoyl-acyl carrier protein (ACP)-dependent acyltransferase resulting in a holo-[acp], (KDO)2-lipid A. The latter compound reacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase I resulting hydrogen ion, ADP, heptosyl-KDO2-lipid A. The latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase II resulting in ADP, hydrogen ion and (heptosyl)2-Kdo2-lipid A. The latter compound UDP-glucose interacts with (heptosyl)2-Kdo2-lipid A resulting in UDP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A. Glucosyl-(heptosyl)2-Kdo2-lipid A (Escherichia coli) is phosphorylated through an ATP-mediated lipopolysaccharide core heptose (I) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A-phosphate.\nThe latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through a lipopolysaccharide core heptosyl transferase III resulting in ADP, hydrogen ion, and  glucosyl-(heptosyl)3-Kdo2-lipid A-phosphate. The latter compound is phosphorylated through an ATP-driven lipopolysaccharide core heptose (II) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-alpha-D-galactose through a UDP-D-galactose:(glucosyl)lipopolysaccharide-1,6-D-galactosyltransferase resulting in a UDP, a hydrogen ion and a galactosyl-glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-glucose through a (glucosyl)LPS \u03b1-1,3-glucosyltransferase resulting in a hydrogen ion, a UDP and galactosyl-(glucosyl)2-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with UDP-glucose through a UDP-glucose:(glucosyl)LPS \u03b1-1,2-glucosyltransferase resulting in UDP, a hydrogen ion and galactosyl-(glucosyl)3-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with ADP-L-glycero-beta-D-manno-heptose  through a lipopolysaccharide core biosynthesis; heptosyl transferase IV; probably hexose transferase resulting in a Lipid A-core.\nA lipid A-core is then exported into the periplasmic space by a lipopolysaccharide ABC transporter.\n\nThe lipid A-core is then flipped to the outer surface of the inner membrane by the ATP-binding cassette (ABC) transporter, MsbA. An additional integral membrane protein, YhjD, has recently been implicated in LPS export across the IM. The smallest LPS derivative that supports viability in E. coli is lipid IVA. However, it requires mutations in either MsbA or YhjD, to suppress the normally lethal consequence of an incomplete lipid A . Recent studies with deletion mutants implicate the periplasmic protein LptA, the cytosolic protein LptB, and the IM proteins LptC, LptF, and LptG in the subsequent transport of nascent LPS to the outer membrane (OM), where the LptD/LptE complex flips LPS to the outer surface.", "kegg_map_id": "ec00540", "name": "Lipopolysaccharide biosynthesis", "pathwhiz_id": "PW000831", "subject": "Metabolic" }, { "description": null, "kegg_map_id": "ec02020", "name": "Two-component system", "pathwhiz_id": null, "subject": null }, { "description": null, "kegg_map_id": "eco01100", "name": "Metabolic pathways", "pathwhiz_id": null, "subject": null }, { "description": "The synthesis of amino sugars and nucleotide sugars  starts with the phosphorylation of N-Acetylmuramic acid (MurNac) through its transport from the periplasmic space to the cytoplasm. Once in the cytoplasm, MurNac and water undergo a reversible reaction through a N-acetylmuramic acid 6-phosphate etherase, producing a D-lactic acid and N-Acetyl-D-Glucosamine 6-phosphate. This latter compound can also be introduced into the cytoplasm through a phosphorylating PTS permase in the inner membrane that allows for the transport of N-Acetyl-D-glucosamine from the periplasmic space.  N-Acetyl-D-Glucosamine 6-phosphate can also be obtained from chitin dependent reactions. Chitin is hydrated through a bifunctional chitinase to produce chitobiose. This in turn gets hydrated by a beta-hexosaminidase to produce N-acetyl-D-glucosamine. The latter undergoes an atp dependent phosphorylation leading to the production of N-Acetyl-D-Glucosamine 6-phosphate.\n N-Acetyl-D-Glucosamine 6-phosphate is then be deacetylated in order to produce Glucosamine 6-phosphate through a N-acetylglucosamine-6-phosphate deacetylase. This compound can either be isomerized  or deaminated into Beta-D-fructofuranose 6-phosphate through a glucosamine-fructose-6-phosphate aminotransferase and a glucosamine-6-phosphate deaminase respectively. \nGlucosamine 6-phosphate undergoes a reversible reaction to glucosamine 1 phosphate through a phosphoglucosamine mutase. This compound is then acetylated through a bifunctional protein glmU to produce a N-Acetyl glucosamine 1-phosphate. \nN-Acetyl glucosamine 1-phosphate enters the nucleotide sugar synthesis by reacting with UTP and hydrogen ion through a bifunctional protein glmU releasing pyrophosphate and a Uridine diphosphate-N-acetylglucosamine.This compound can either be isomerized into a  UDP-N-acetyl-D-mannosamine or undergo a reaction with phosphoenolpyruvic acid through UDP-N-acetylglucosamine 1-carboxyvinyltransferase releasing a phosphate and a UDP-N-Acetyl-alpha-D-glucosamine-enolpyruvate.\nUDP-N-acetyl-D-mannosamine undergoes a NAD dependent dehydrogenation  through a UDP-N-acetyl-D-mannosamine dehydrogenase, releasing NADH, a hydrogen ion and a UDP-N-Acetyl-alpha-D-mannosaminuronate, This compound is then used in the production of enterobacterial common antigens. \nUDP-N-Acetyl-alpha-D-glucosamine-enolpyruvate is reduced through a NADPH dependent UDP-N-acetylenolpyruvoylglucosamine reductase, releasing a NADP and a UDP-N-acetyl-alpha-D-muramate. This compound is involved in the D-glutamine and D-glutamate metabolism.", "kegg_map_id": null, "name": "Amino sugar and nucleotide sugar metabolism I", "pathwhiz_id": "PW000886", "subject": "Metabolic" }, { "description": "The synthesis of amino sugars and nucleotide sugars  starts with the phosphorylation of N-Acetylmuramic acid (MurNac) through its transport from the periplasmic space to the cytoplasm. Once in the cytoplasm, MurNac and water undergo a reversible reaction through a N-acetylmuramic acid 6-phosphate etherase, producing a D-lactic acid and N-Acetyl-D-Glucosamine 6-phosphate. This latter compound can also be introduced into the cytoplasm through a phosphorylating PTS permase in the inner membrane that allows for the transport of N-Acetyl-D-glucosamine from the periplasmic space.  N-Acetyl-D-Glucosamine 6-phosphate can also be obtained from chitin dependent reactions. Chitin is hydrated through a bifunctional chitinase to produce chitobiose. This in turn gets hydrated by a beta-hexosaminidase to produce N-acetyl-D-glucosamine. The latter undergoes an atp dependent phosphorylation leading to the production of N-Acetyl-D-Glucosamine 6-phosphate.\n N-Acetyl-D-Glucosamine 6-phosphate is then be deacetylated in order to produce Glucosamine 6-phosphate through a N-acetylglucosamine-6-phosphate deacetylase. This compound is then deaminased into Beta-D-fructofuranose 6-phosphate through a glucosamine-6-phosphate deaminase.\n Beta-D-fructofuranose 6-phosphate is isomerized into a beta-D-glucose 6-phosphate through a glucose-6-phosphate isomerase. The compound is then isomerized by a putative beta-phosphoglucomutase to produce a beta-D-glucose 1-phosphate. This compound enters the nucleotide sugar metabolism through uridylation resulting in a UDP-glucose. UDP-glucose is then dehydrated through a UDP-glucose 6-dehydrogenase to produce a UDP-glucuronic acid. This compound undergoes a NAD dependent reaction through a bifunctional polymyxin resistance protein to produce UDP-Beta-L-threo-pentapyranos-4-ulose. This compound then reacts with L-glutamic acid through a UDP-4-amino-4-deoxy-L-arabinose--oxoglutarate aminotransferase to produce an oxoglutaric acid and UDP-4-amino-4-deoxy-beta-L-arabinopyranose\nThe latter compound interacts with a N10-formyl-tetrahydrofolate through a bifunctional polymyxin resistance protein ArnA, resulting in  a tetrahydrofolate, a hydrogen ion and a UDP-4-deoxy-4-formamido-beta-L-arabinopyranose, which in turn reacts with a product of the methylerythritol phosphate and polysoprenoid biosynthesis pathway, di-trans,octa-cis-undecaprenyl phosphate to produce a 4-deoxy-4-formamido-alpha-L-arabinopyranosyl ditrans, octacis-undecaprenyl phosphate.\n\nAlpha-D-glucose is introduced into the cytoplasm through a glucose PTS permease, which phosphorylates the compound in order to produce an alpha-D-glucose 6-phosphate. This compound is then modified through a phosphoglucomutase 1 to yield alpha-D-glucose 1-phosphate. This compound can either be adenylated to produce ADP-glucose or uridylylated to produce galactose 1-phosphate through glucose-1-phosphate adenyllyltransferase and galactose-1-phosphate uridylyltransferase respectively.", "kegg_map_id": null, "name": "Amino sugar and nucleotide sugar metabolism III", "pathwhiz_id": "PW000895", "subject": "Metabolic" }, { "description": "The colonic acid building blocks biosynthesis starts with a Beta-D-Glucose undergoing a transport reaction mediated by a glucose PTS permease. The permease phosphorylates the Beta-D-Glucose, producing a Beta-D-Glucose 6-phosphate. This compound can either change to an Alpha-D-Glucose 6-phosphate spontaneously or into a fructose 6-phosphate through a glucose-6-phosphate isomerase. The latter compound can also be present in E.coli through the interaction of D-fructose and a mannose PTS permease which phosphorylate the D-fructose. \nFructose 6-phosphate interacts in a reversible reaction with mannose-6-phosphate isomerase in order to produce a Alpha-D-mannose 6-phosphate. This compound can also be present in E.coli through the interaction of Alpha-D-mannose and a mannose PTS permease which phosphorylates the alpha-D-mannose. Alpha-D-mannose 6-phosphate interacts in a reversible reaction with a phosphomannomutase to produce a alpha-D-mannose 1-phosphate. This compound in turn with a hydrogen ion and gtp undergoes a reaction with a mannose-1-phosphate guanylyltransferase, releasing a pyrophosphate and producing a guanosine diphosphate mannose. Guanosine diphosphate mannose interacts with gdp-mannose 4,6-dehydratase releasing a water, and gdp-4-dehydro-6-deoxy-D-mannose. This compound in turn with hydrogen ion and NADPH interact with GDP-L-fucose synthase releasing NADP and producing a GDP-L-fucose.\nThe Alpha-D-Glucose 6-phosphate interacts in a reversible reaction with phosphoglucomutase-1 to produce a alpha-D-glucose 1-phosphate. This in turn with UTP and hydrogen ion interact with UTP--glucose-1-phosphate uridyleltransferase releasing a pyrophosphate and UDP-glucose.\nUDP-glucose can either interact with galactose-1-phosphate uridylyltransferase to produce a UDP-galactose or in turn with NAD and water interact with UDP-glucose 6-dehydrogenase releasing a NADH and a hydrogen ion and producing a UDP-glucuronate.\nGDP-L-fucose, UDP-glucose, UDP-galactose and UDP-glucuronate are sugars that need to be activated in the form of nucleotide sugar prior to their assembly into colanic acid, also known as M antigen. \nColanic acid is an extracellular polysaccharide which has been linked to a cluster of 19 genes(wca).", "kegg_map_id": null, "name": "colanic acid building blocks biosynthesis", "pathwhiz_id": "PW000951", "subject": "Metabolic" }, { "description": "The degradation of galactose, also known as Leloir pathway, requires 3 main enzymes once Beta-D-galactose has been converted to galactose through an Aldose-1-epimerase. These are:  galactokinase , galactose-1-phosphate uridylyltransferase and UDP-glucose 4-epimerase. Beta-D-galactose can be uptaken from the environment through a galactose proton symporter. It can also be produced by lactose degradation involving a lactose permease to uptake lactose from the environment and a beta-galactosidase to turn lactose into Beta-D-galactose. \nGalactose is degraded through the following process:\nBeta-D-galactose is introduced into the cytoplasm through a galactose proton symporter, or it can be synthesized from an alpha lactose that is introduced into the cytoplasm through a lactose permease. Alpha lactose interacts with water through a beta-galactosidase resulting in a beta-D-glucose and beta-D-galactose. Beta-D-galactose is isomerized into D-galactose. D-Galactose undergoes phosphorylation through a galactokinase, hence producing galactose 1 phosphate. On the other side of the pathway, a gluose-1-phosphate (product of the interaction of alpha-D-glucose 6-phosphate with a phosphoglucomutase resulting in a alpha-D-glucose-1-phosphate, an isomer of Glucose 1-phosphate, or an isomer of Beta-D-glucose 1-phosphate) interacts with UTP and a hydrogen ion in order to produce a uridine diphosphate glucose. This is followed by the interaction of galactose-1-phosphate with an established amount of uridine diphosphate glucose through a galactose-1-phosphate uridylyltransferase, which in turn output a glucose-1-phosphate and a uridine diphosphate galactose. The glucose -1-phosphate is transformed into a uridine diphosphate glucose through UTP--glucose-1-phosphate uridylyltransferase. The product, uridine diphosphate glucose, can undergo a reversible reaction in which it can be turned into uridine diphosphategalactose through an  UDP-glucose 4-epimerase, and so the cycle can keep going as long as more lactose or galactose is imported into the cell.", "kegg_map_id": null, "name": "galactose degradation/Leloir Pathway", "pathwhiz_id": "PW000884", "subject": "Metabolic" }, { "description": "Peptidoglycan is a net-like polymer which surrounds the cytoplasmic membrane of most bacteria and functions to maintain cell shape and prevent rupture due to the internal turgor.In E. coli K-12, the peptidoglycan consists of glycan strands of alternating subunits of N-acetylglucosamine (GlcNAc) and N-acetylmuramic acid (MurNAc) which are cross-linked by short peptides. The pathway for constructing this net involves two cell compartments: cytoplasm and periplasmic space. \nThe pathway starts with a beta-D-fructofuranose going through a mannose  PTS permease, phosphorylating the compund and producing a beta-D-fructofuranose 6 phosphate. This compound can be obtained from the glycolysis and pyruvate dehydrogenase or from an isomerization reaction of Beta-D-glucose 6-phosphate through a glucose-6-phosphate isomerase.The compound Beta-D-fructofuranose 6 phosphate and L-Glutamine react with a glucosamine fructose-6-phosphate aminotransferase, thus producing a glucosamine 6-phosphate  and a l-glutamic acid. The glucosamine 6-phosphate interacts with phosphoglucosamine mutase in a reversible reaction producing glucosamine-1P. Glucosamine-1p and acetyl coa undergo acetylation throuhg a bifunctional protein glmU releasing Coa and a hydrogen ion and producing a N-acetyl-glucosamine 1-phosphate. Glmu, being a bifunctional protein, follows catalyze the interaction of N-acetyl-glucosamine 1-phosphate, hydrogen ion and UTP into UDP-N-acetylglucosamine and pyrophosphate. UDP-N-acetylglucosamine then interacts with phosphoenolpyruvic acid and a UDP-N acetylglucosamine 1- carboxyvinyltransferase realeasing a phosphate and the compound UDP-N-acetyl-alpha-D-glucosamine-enolpyruvate. This compound undergoes a NADPH dependent reduction producing a UDP-N-acetyl-alpha-D-muramate through a UDP-N-acetylenolpyruvoylglucosamine reductase. UDP-N-acetyl-alpha-D-muramate and L-alanine react in an ATP-mediated ligation through a UDP-N-acetylmuramate-alanine ligase releasing an ADP, hydrogen ion, a phosphate and a UDP-N-acetylmuramoyl-L-alanine. This compound interacts with D-glutamic acid and ATP through  UDP-N-acetylmuramoylalanine-D-glutamate ligase releasing ADP, A phosphate and UDP-N-acetylmuramoyl-L-alanyl-D-glutamate. The latter compound then interacts with meso-diaminopimelate in an ATP mediated ligation through a UDP-N-acetylmuramoylalanine-D-glutamate-2,6-diaminopimelate ligase resulting in ADP, phosphate, hydrogen ion and UDP-N-Acetylmuramoyl-L-alanyl-D-gamma-glutamyl-meso-2,6-diaminopimelate. This compound in turn with D-alanyl-D-alanine react in an ATP-mediated ligation through UDP-N-Acetylmuramoyl-tripeptide-D-alanyl-D-alanine ligase to produce UDP-N-acetyl-alpha-D-muramoyl-L-alanyl-gama-D-glutamyl-meso-2,6-diaminopimeloyl-Dalanyl-D-alanine and hydrogen ion, ADP, phosphate. UDP-N-acetyl-alpha-D-muramoyl-L-alanyl-gama-D-glutamyl-meso-2,6-diaminopimeloyl-Dalanyl-D-alanine interacts with di-trans,octa-cis-undecaprenyl phosphate through a phospho-N-acetylmuramoyl-pentapeptide-transferase, resulting in UMP and Undecaprenyl-diphospho-N-acetylmuramoyl-L-alanyl-D-glutamyl-meso-2,6-diaminopimeloyl-D-alanyl-D-alanine which in turn reacts with a UDP-N-acetylglucosamine through a N-acetylglucosaminyl transferase to produce a hydrogen, UDP and ditrans,octacis-undecaprenyldiphospho-N-acetyl-(N-acetylglucosaminyl)muramoyl-L-alanyl-gamma-D-glutamyl-meso-2,6-diaminopimeloyl-D-alanyl-D-alanine. This compound ends the cytoplasmic part of the pathway. ditrans,octacis-undecaprenyldiphospho-N-acetyl-(N-acetylglucosaminyl)muramoyl-L-alanyl-gamma-D-glutamyl-meso-2,6-diaminopimeloyl-D-alanyl-D-alanine is transported through a lipi II flippase. Once in the periplasmic space, the compound reacts with a penicillin binding protein 1A prodducing a peptidoglycan dimer, a hydrogen ion, and UDP. The peptidoglycan dimer then reacts with a penicillin binding protein 1B  producing a peptidoglycan with D,D, cross-links and a D-alanine.", "kegg_map_id": null, "name": "peptidoglycan biosynthesis I", "pathwhiz_id": "PW000906", "subject": "Metabolic" }, { "description": "E. coli lipid A is synthesized on the cytoplasmic surface of the inner membrane. The pathway can start from the fructose 6-phosphate that is either produced in the glycolysis and pyruvate dehydrogenase or be obtained from the interaction with D-fructose interacting with a mannose PTS permease. Fructose 6-phosphate interacts with L-glutamine through a D-fructose-6-phosphate aminotransferase resulting into a L-glutamic acid and a glucosamine 6-phosphate. The latter compound is isomerized through a phosphoglucosamine mutase resulting a glucosamine 1-phosphate. This compound is acetylated, interacting with acetyl-CoA through a bifunctional protein glmU resulting in a Coenzyme A, hydrogen ion and N-acetyl-glucosamine 1-phosphate. This compound interact with UTP and hydrogen ion through the bifunctional protein glmU resulting in a pyrophosphate and a UDP-N-acetylglucosamine. This compound interacts with (3R)-3-hydroxymyristoyl-[acp] through an UDP-N-acetylglucosamine acyltransferase resulting in a holo-[acp] and a UDP-3-O[(3R)-3-hydroxymyristoyl]-N-acetyl-alpha-D-glucosamine. This compound interacts with water through UDP-3-O-acyl-N-acetylglucosamine deacetylase resulting in an acetic acid and UDP-3-O-(3-hydroxymyristoyl)-\u03b1-D-glucosamine. The latter compound interacts with (3R)-3-hydroxymyristoyl-[acp] through UDP-3-O-(R-3-hydroxymyristoyl)-glucosamine N-acyltransferase releasing a hydrogen ion, a holo-acp and UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine. The latter compound is hydrolase by interacting with water and a UDP-2,3-diacylglucosamine hydrolase resulting in UMP, hydrogen ion and 2,3-bis[(3R)-3-hydroxymyristoyl]-\u03b1-D-glucosaminyl 1-phosphate. This last compound then interacts with a UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine through a lipid A disaccharide synthase resulting in a release of UDP, hydrogen ion and a lipid A disaccharide. The lipid A disaccharide is phosphorylated by an ATP mediated tetraacyldisaccharide 4'-kinase resulting in the release of hydrogen ion and lipid IVA. A D-ribulose 5-phosphate is isomerized with D-arabinose 5-phosphate isomerase 2 to result in a D-arabinose 5-phosphate. This compounds interacts with water and phosphoenolpyruvic acid through a 3-deoxy-D-manno-octulosonate 8-phosphate synthase resulting in the release of phosphate and 3-deoxy-D-manno-octulosonate 8-phosphate. This compound interacts with water through a 3-deoxy-D-manno-octulosonate 8-phosphate phosphatase thus releasing a phosphate and a 3-deoxy-D-manno-octulosonate. The latter compound interacts with CTP through a 3-deoxy-D-manno-octulosonate cytidylyltransferase resulting in a pyrophosphate and CMP-3-deoxy-\u03b1-D-manno-octulosonate. CMP-3-deoxy-\u03b1-D-manno-octulosonate and lipid IVA interact with each other through a KDO transferase resulting in CMP, hydrogen ion and alpha-Kdo-(2-->6)-lipid IVA. The latter compound reacts with CMP-3-deoxy-\u03b1-D-manno-octulosonate through a KDO transferase resulting in a CMP, hydrogen ion, and a a-Kdo-(2->4)-a-Kdo-(2->6)-lipid IVA. The latter compound can either interact with a phosphoethanolamine resulting in a 1,2-diacyl-sn-glycerol and a phosphoethanolamine-Kdo2-lipid A which can be exported outside the cell, or it can interact with a dodecanoyl-[acp] lauroyl acyltransferase resulting in a holo-[acp] and a (KDO)2-(lauroyl)-lipid IVA. The latter compound reacts with a myristoyl-[acp] through a myristoyl-acyl carrier protein (ACP)-dependent acyltransferase resulting in a holo-[acp], (KDO)2-lipid A. The latter compound reacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase I resulting hydrogen ion, ADP, heptosyl-KDO2-lipid A. The latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase II resulting in ADP, hydrogen ion and (heptosyl)2-Kdo2-lipid A. The latter compound UDP-glucose interacts with (heptosyl)2-Kdo2-lipid A resulting in UDP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A. Glucosyl-(heptosyl)2-Kdo2-lipid A (Escherichia coli) is phosphorylated through an ATP-mediated lipopolysaccharide core heptose (I) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A-phosphate. The latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through a lipopolysaccharide core heptosyl transferase III resulting in ADP, hydrogen ion, and glucosyl-(heptosyl)3-Kdo2-lipid A-phosphate. The latter compound is phosphorylated through an ATP-driven lipopolysaccharide core heptose (II) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-alpha-D-galactose through a UDP-D-galactose:(glucosyl)lipopolysaccharide-1,6-D-galactosyltransferase resulting in a UDP, a hydrogen ion and a galactosyl-glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-glucose through a (glucosyl)LPS \u03b1-1,3-glucosyltransferase resulting in a hydrogen ion, a UDP and galactosyl-(glucosyl)2-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with UDP-glucose through a UDP-glucose:(glucosyl)LPS \u03b1-1,2-glucosyltransferase resulting in UDP, a hydrogen ion and galactosyl-(glucosyl)3-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with ADP-L-glycero-beta-D-manno-heptose through a lipopolysaccharide core biosynthesis; heptosyl transferase IV; probably hexose transferase resulting in a Lipid A-core. A lipid A-core is then exported into the periplasmic space by a lipopolysaccharide ABC transporter. The lipid A-core is then flipped to the outer surface of the inner membrane by the ATP-binding cassette (ABC) transporter, MsbA. An additional integral membrane protein, YhjD, has recently been implicated in LPS export across the IM. The smallest LPS derivative that supports viability in E. coli is lipid IVA. However, it requires mutations in either MsbA or YhjD, to suppress the normally lethal consequence of an incomplete lipid A . Recent studies with deletion mutants implicate the periplasmic protein LptA, the cytosolic protein LptB, and the IM proteins LptC, LptF, and LptG in the subsequent transport of nascent LPS to the outer membrane (OM), where the LptD/LptE complex flips LPS to the outer surface.", "kegg_map_id": null, "name": "lipopolysaccharide biosynthesis II", "pathwhiz_id": "PW001905", "subject": "Metabolic" }, { "description": "Anhydromuropeptides (mainly GlcNAc-1,6-anhMurNAc-L-Ala-\u03b3-D-Glu-DAP-D-Ala) are steadily released during growth by lytic transglycosylases and endopeptidases and imported back into the cytoplasm for recycling. During bacterial growth, a very large proportion of the peptidoglycan polymer is degraded and reused in a process termed cell wall recycling. For example, the Gram-negative bacterium Escherichia coli recovers about half of its cell wall within one generation.\nThe anhydromuropeptides are imported by the ampG-encoded muropeptide:H+ symporter. Once inside the cytoplasm, the anhydromuropeptides are hydrolyzed by N-acetylmuramoyl-L-alanine amidase (ampD), \u03b2-N-acetylhexosaminidase (nagZ) and L,D-carboxypeptidase A (ldcA), yielding N-acetyl-\u03b2-D-glucosamine, 1,6-anhydro-N-acetyl-\u03b2-muramate, L-alanyl-\u03b3-D-glutamyl-meso-diaminopimelate and D-alanine.\n1,6-anhydro-N-acetyl-\u03b2-muramate is phosphorylated by anhydro-N-acetylmuramic acid kinase (anmK) and then converted into N-acetyl-D-glucosamine 6-phosphate by N-acetylmuramic acid 6-phosphate etherase (murQ). This is a branch point, as this compound could be directed either for further degradation or for recycling into new peptidoglycan monomers, as described in this pathway. The final product of this pathway, UDP-N-acetyl-\u03b1-D-muramate, is one of the precursors for peptidoglycan biosynthesis.\nThe tripeptide L-alanyl-\u03b3-D-glutamyl-meso-diaminopimelate, which is generated by  muramoyltetrapeptide carboxypeptidase, can be degraded further, as described in muropeptide degradation. However, the vast majority is recycled by muropeptide ligase (mpl). This enzyme is a dedicated recycling enzyme that attaches the recovered Ala-Glu-DAP tripeptide to UDP-N-acetyl-\u03b1-D-muramate, thereby substituting three amino acid ligases of the peptidoglycan de novobiosynthetic pathway.\nAlthough exogenously provided 1,6-anhydro-N-acetyl-\u03b2-muramate can be taken up by Escherichia coli, it can not serve as the sole source of carbon for growth, suggesting that it may be toxic to the cell. (EcoCyc)", "kegg_map_id": null, "name": "1,6-anhydro-<i>N</i>-acetylmuramic acid recycling", "pathwhiz_id": "PW002064", "subject": "Metabolic" }, { "description": "E. coli lipid A is synthesized on the cytoplasmic surface of the inner membrane. The pathway can start from the fructose 6-phosphate that is either produced in the glycolysis and pyruvate dehydrogenase or be obtained from the interaction with D-fructose interacting with a mannose PTS permease. Fructose 6-phosphate interacts with L-glutamine through a D-fructose-6-phosphate aminotransferase resulting into a L-glutamic acid and a glucosamine 6-phosphate. The latter compound is isomerized through a phosphoglucosamine mutase resulting a glucosamine 1-phosphate. This compound is acetylated, interacting with acetyl-CoA through a bifunctional protein glmU resulting in a Coenzyme A, hydrogen ion and N-acetyl-glucosamine 1-phosphate. This compound interact with UTP and hydrogen ion through the bifunctional protein glmU resulting in a pyrophosphate and a UDP-N-acetylglucosamine. This compound interacts with (3R)-3-hydroxymyristoyl-[acp] through an UDP-N-acetylglucosamine acyltransferase resulting in a holo-[acp] and a UDP-3-O[(3R)-3-hydroxymyristoyl]-N-acetyl-alpha-D-glucosamine. This compound interacts with water through UDP-3-O-acyl-N-acetylglucosamine deacetylase resulting in an acetic acid and UDP-3-O-(3-hydroxymyristoyl)-\u03b1-D-glucosamine. The latter compound interacts with (3R)-3-hydroxymyristoyl-[acp] through \nUDP-3-O-(R-3-hydroxymyristoyl)-glucosamine N-acyltransferase releasing a hydrogen ion, a holo-acp and UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine. The latter compound is hydrolase by interacting with water and a UDP-2,3-diacylglucosamine hydrolase resulting in UMP, hydrogen ion and  2,3-bis[(3R)-3-hydroxymyristoyl]-\u03b1-D-glucosaminyl 1-phosphate. This last compound then interacts with a UDP-2-N,3-O-bis[(3R)-3-hydroxytetradecanoyl]-\u03b1-D-glucosamine through a lipid A disaccharide synthase resulting in a release of UDP, hydrogen ion and a lipid A disaccharide.  The lipid A disaccharide is phosphorylated by an ATP mediated \ntetraacyldisaccharide 4'-kinase resulting in the release of hydrogen ion and lipid IVA. \n A D-ribulose 5-phosphate is isomerized with D-arabinose 5-phosphate isomerase 2  to result in a D-arabinose 5-phosphate. This compounds interacts with water and phosphoenolpyruvic acid through a 3-deoxy-D-manno-octulosonate 8-phosphate synthase resulting in the release of phosphate and  3-deoxy-D-manno-octulosonate 8-phosphate. This compound interacts with water through a 3-deoxy-D-manno-octulosonate 8-phosphate phosphatase thus releasing a phosphate and a 3-deoxy-D-manno-octulosonate. The latter compound interacts with CTP through a 3-deoxy-D-manno-octulosonate cytidylyltransferase resulting in a pyrophosphate and \nCMP-3-deoxy-\u03b1-D-manno-octulosonate.\n\nCMP-3-deoxy-\u03b1-D-manno-octulosonate and lipid IVA interact with each other through a KDO transferase resulting in CMP, hydrogen ion and alpha-Kdo-(2-->6)-lipid IVA. The latter compound reacts with CMP-3-deoxy-\u03b1-D-manno-octulosonate through a KDO transferase resulting in a CMP, hydrogen ion, and a a-Kdo-(2->4)-a-Kdo-(2->6)-lipid IVA. The latter compound can either react with a palmitoleoyl-acp through a palmitoleoyl acyltransferase resulting in the release of a holo-acyl carriere protein and a Kdo2-palmitoleoyl-lipid IVa which in turn reacts with a myristoyl-acp through a myristoyl-acp dependent acyltransferase resulting in a release of a holo-acp and a Kdo2-lipid A, cold adapted, or it can interact with a dodecanoyl-[acp] lauroyl acyltransferase resulting in a holo-[acp] and a (KDO)2-(lauroyl)-lipid IVA. The latter compound reacts with a myristoyl-[acp] through a myristoyl-acyl carrier protein (ACP)-dependent acyltransferase resulting in a holo-[acp], (KDO)2-lipid A. The latter compound reacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase I resulting hydrogen ion, ADP, heptosyl-KDO2-lipid A. The latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through ADP-heptose:LPS heptosyltransferase II resulting in ADP, hydrogen ion and (heptosyl)2-Kdo2-lipid A. The latter compound UDP-glucose interacts with (heptosyl)2-Kdo2-lipid A resulting in UDP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A. Glucosyl-(heptosyl)2-Kdo2-lipid A (Escherichia coli) is phosphorylated through an ATP-mediated lipopolysaccharide core heptose (I) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)2-Kdo2-lipid A-phosphate.\nThe latter compound interacts with ADP-L-glycero-beta-D-manno-heptose through a lipopolysaccharide core heptosyl transferase III resulting in ADP, hydrogen ion, and  glucosyl-(heptosyl)3-Kdo2-lipid A-phosphate. The latter compound is phosphorylated through an ATP-driven lipopolysaccharide core heptose (II) kinase resulting in ADP, hydrogen ion and glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-alpha-D-galactose through a UDP-D-galactose:(glucosyl)lipopolysaccharide-1,6-D-galactosyltransferase resulting in a UDP, a hydrogen ion and a galactosyl-glucosyl-(heptosyl)3-Kdo2-lipid A-bisphosphate. The latter compound interacts with UDP-glucose through a (glucosyl)LPS \u03b1-1,3-glucosyltransferase resulting in a hydrogen ion, a UDP and galactosyl-(glucosyl)2-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with UDP-glucose through a UDP-glucose:(glucosyl)LPS \u03b1-1,2-glucosyltransferase resulting in UDP, a hydrogen ion and galactosyl-(glucosyl)3-(heptosyl)3-Kdo2-lipid A-bisphosphate. This compound then interacts with ADP-L-glycero-beta-D-manno-heptose  through a lipopolysaccharide core biosynthesis; heptosyl transferase IV; probably hexose transferase resulting in a Lipid A-core.\nA lipid A-core is then exported into the periplasmic space by a lipopolysaccharide ABC transporter.\n\nThe lipid A-core is then flipped to the outer surface of the inner membrane by the ATP-binding cassette (ABC) transporter, MsbA. An additional integral membrane protein, YhjD, has recently been implicated in LPS export across the IM. The smallest LPS derivative that supports viability in E. coli is lipid IVA. However, it requires mutations in either MsbA or YhjD, to suppress the normally lethal consequence of an incomplete lipid A . Recent studies with deletion mutants implicate the periplasmic protein LptA, the cytosolic protein LptB, and the IM proteins LptC, LptF, and LptG in the subsequent transport of nascent LPS to the outer membrane (OM), where the LptD/LptE complex flips LPS to the outer surface.", "kegg_map_id": null, "name": "lipopolysaccharide biosynthesis III", "pathwhiz_id": "PW002059", "subject": "Metabolic" }, { "description": "Peptidoglycan is a net-like polymer which surrounds the cytoplasmic membrane of most bacteria and functions to maintain cell shape and prevent rupture due to the internal turgor.In E. coli K-12, the peptidoglycan consists of glycan strands of alternating subunits of N-acetylglucosamine (GlcNAc) and N-acetylmuramic acid (MurNAc) which are cross-linked by short peptides. The pathway for constructing this net involves two cell compartments: cytoplasm and periplasmic space. The pathway starts with a beta-D-fructofuranose going through a mannose PTS permease, phosphorylating the compund and producing a beta-D-fructofuranose 6 phosphate. This compound can be obtained from the glycolysis and pyruvate dehydrogenase or from an isomerization reaction of Beta-D-glucose 6-phosphate through a glucose-6-phosphate isomerase.The compound Beta-D-fructofuranose 6 phosphate and L-Glutamine react with a glucosamine fructose-6-phosphate aminotransferase, thus producing a glucosamine 6-phosphate and a l-glutamic acid. The glucosamine 6-phosphate interacts with phosphoglucosamine mutase in a reversible reaction producing glucosamine-1P. Glucosamine-1p and acetyl coa undergo acetylation throuhg a bifunctional protein glmU releasing Coa and a hydrogen ion and producing a N-acetyl-glucosamine 1-phosphate. Glmu, being a bifunctional protein, follows catalyze the interaction of N-acetyl-glucosamine 1-phosphate, hydrogen ion and UTP into UDP-N-acetylglucosamine and pyrophosphate. UDP-N-acetylglucosamine then interacts with phosphoenolpyruvic acid and a UDP-N acetylglucosamine 1- carboxyvinyltransferase realeasing a phosphate and the compound UDP-N-acetyl-alpha-D-glucosamine-enolpyruvate. This compound undergoes a NADPH dependent reduction producing a UDP-N-acetyl-alpha-D-muramate through a UDP-N-acetylenolpyruvoylglucosamine reductase. UDP-N-acetyl-alpha-D-muramate and L-alanine react in an ATP-mediated ligation through a UDP-N-acetylmuramate-alanine ligase releasing an ADP, hydrogen ion, a phosphate and a UDP-N-acetylmuramoyl-L-alanine. This compound interacts with D-glutamic acid and ATP through UDP-N-acetylmuramoylalanine-D-glutamate ligase releasing ADP, A phosphate and UDP-N-acetylmuramoyl-L-alanyl-D-glutamate. The latter compound then interacts with meso-diaminopimelate in an ATP mediated ligation through a UDP-N-acetylmuramoylalanine-D-glutamate-2,6-diaminopimelate ligase resulting in ADP, phosphate, hydrogen ion and UDP-N-Acetylmuramoyl-L-alanyl-D-gamma-glutamyl-meso-2,6-diaminopimelate. This compound in turn with D-alanyl-D-alanine react in an ATP-mediated ligation through UDP-N-Acetylmuramoyl-tripeptide-D-alanyl-D-alanine ligase to produce UDP-N-acetyl-alpha-D-muramoyl-L-alanyl-gama-D-glutamyl-meso-2,6-diaminopimeloyl-Dalanyl-D-alanine and hydrogen ion, ADP, phosphate. UDP-N-acetyl-alpha-D-muramoyl-L-alanyl-gama-D-glutamyl-meso-2,6-diaminopimeloyl-Dalanyl-D-alanine interacts with di-trans,octa-cis-undecaprenyl phosphate through a phospho-N-acetylmuramoyl-pentapeptide-transferase, resulting in UMP and N-Acetylmuramoyl-L-alanyl-D-glutamyl-meso-2,6-diaminopimelyl-D-alanyl-D-alanine-diphosphoundecaprenol which in turn reacts with a UDP-N-acetylglucosamine through a N-acetylglucosaminyl transferase to produce a hydrogen, UDP and Undecaprenyl-diphospho-N-acetylmuramoyl-(N-acetylglucosamine)-L-alanyl-D-glutaminyl-meso-2,6-diaminopimeloyl-D-alanyl-D-alanine. This compound ends the cytoplasmic part of the pathway. Undecaprenyl-diphospho-N-acetylmuramoyl-(N-acetylglucosamine)-L-alanyl-D-glutaminyl-meso-2,6-diaminopimeloyl-D-alanyl-D-alanine is transported through a lipi II flippase. Once in the periplasmic space, the compound reacts with a penicillin binding protein 1A prodducing a peptidoglycan dimer, a hydrogen ion, and UDP. The peptidoglycan dimer then reacts with a penicillin binding protein 1B producing a peptidoglycan with D,D, cross-links and a D-alanine.", "kegg_map_id": null, "name": "peptidoglycan biosynthesis I 2", "pathwhiz_id": "PW002062", "subject": "Metabolic" }, { "description": "Lipopolysaccharide (LPS), a major outer membrane component, is composed of three domains: Lipid A; the core, which is an oligosaccharide consisting of an inner and outer region; and a distal repeating unit known as O-antigen.\nE. coli K12 is capable of producing an O-antigen when all the rfb genes are intact. The O-antigen is part of the lipopolysaccharide and is attached to the lipid A-core component, which is separately synthesized. The O-antigen is a repeat unit composed of four sugars: glucose, N-acetylglucosamine, galactose and rhamnose.\nThis pathway depicts the synthesis of three of these sugars. UDP-galactose is transformed from its pyranose form to its furanose form. dTTP glucose-1-phosphate is derivatized to dTDP-rhamnose. Fructose-6-phosphate gains an amino group, incorporates an acetate moiety and then acquires a nucleoside diphosphate resulting in UDP-N-acetyl-D-glucosamine.(EcoCyc)", "kegg_map_id": null, "name": "O-antigen building blocks biosynthesis", "pathwhiz_id": "PW002089", "subject": "Metabolic" }, { "ecocyc_pathway_id": "PWY0-166", "name": "pyrimidine deoxyribonucleotides <i>de novo</i> biosynthesis I" }, { "ecocyc_pathway_id": "NRI-PWY", "name": "Nitrogen Regulation Two-Component System" }, { "ecocyc_pathway_id": "PWY-5687-1", "name": "pyrimidine ribonucleotides interconversion" }, { "ecocyc_pathway_id": "UDPNAGSYN-PWY", "name": "UDP-<i>N</i>-acetyl-D-glucosamine biosynthesis I" }, { "ecocyc_pathway_id": "GALACTMETAB-PWY", "name": "galactose degradation I (Leloir pathway)" }, { "ecocyc_pathway_id": "COLANSYN-PWY", "name": "colanic acid building blocks biosynthesis" } ] }, "predicted_properties": { "property": [ { "kind": "logp", "source": "ALOGPS", "value": "-0.07" }, { "kind": "logs", "source": "ALOGPS", "value": "-1.76" }, { "kind": "solubility", "source": "ALOGPS", "value": "8.37e+00 g/l" } ] }, "property": [ { "kind": "logp", "source": "ChemAxon", "value": "-3.4" }, { "kind": "pka_strongest_acidic", "source": "ChemAxon", "value": "0.9" }, { "kind": "pka_strongest_basic", "source": "ChemAxon", "value": "-3.7" }, { "kind": "iupac", "source": "ChemAxon", "value": "({[({[(2R,3S,4R,5R)-5-(2,4-dioxo-1,2,3,4-tetrahydropyrimidin-1-yl)-3,4-dihydroxyoxolan-2-yl]methoxy}(hydroxy)phosphoryl)oxy](hydroxy)phosphoryl}oxy)phosphonic acid" }, { "kind": "average_mass", "source": "ChemAxon", "value": "484.1411" }, { "kind": "mono_mass", "source": "ChemAxon", "value": "483.968527356" }, { "kind": "smiles", "source": "ChemAxon", "value": "O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O" }, { "kind": "formula", "source": "ChemAxon", "value": "C9H15N2O15P3" }, { "kind": "inchi", "source": "ChemAxon", "value": "InChI=1S/C9H15N2O15P3/c12-5-1-2-11(9(15)10-5)8-7(14)6(13)4(24-8)3-23-28(19,20)26-29(21,22)25-27(16,17)18/h1-2,4,6-8,13-14H,3H2,(H,19,20)(H,21,22)(H,10,12,15)(H2,16,17,18)/t4-,6-,7-,8-/m1/s1" }, { "kind": "inchikey", "source": "ChemAxon", "value": "PGAVKCOVUIYSFO-XVFCMESISA-N" }, { "kind": "polar_surface_area", "source": "ChemAxon", "value": "258.92" }, { "kind": "refractivity", "source": "ChemAxon", "value": "85.18" }, { "kind": "polarizability", "source": "ChemAxon", "value": "35.37" }, { "kind": "rotatable_bond_count", "source": "ChemAxon", "value": "8" }, { "kind": "acceptor_count", "source": "ChemAxon", "value": "12" }, { "kind": "donor_count", "source": "ChemAxon", "value": "7" }, { "kind": "physiological_charge", "source": "ChemAxon", "value": "-3" }, { "kind": "formal_charge", "source": "ChemAxon", "value": "0" } ], "pubchem_compound_id": "6133", "reactions": { "ecocyc_id": [ null, "UDPKIN-RXN", "GLUC1PURIDYLTRANS-RXN", "CTPSYN-RXN", null, null, null, null, null, null, null, null, null, null, null, null, null, null, "CTPSYN-RXN", "GLUC1PURIDYLTRANS-RXN", "NAG1P-URIDYLTRANS-RXN", "UDPKIN-RXN", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ], "kegg_reaction_id": [ null, "R00156", "R00289", "R00573", "R00662", null, "R00156", "R00289", "R00416", "R00443", "R00516", "R00568", "R00571", "R00573", "R00662", "R00967", "R02023", "R03238", null, null, null, null, null, null, null, null, null, "R00573", "R04733", null, null, null, null, null, null, null, null ], "pw_reaction_id": [ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "PW_R002948", "PW_R003353", "PW_R003566", "PW_R003314", "PW_R003532", "PW_R003543", "PW_R003533", "PW_R006031" ], "reaction_text": [ "2 Flavodoxin reduced + 2 Hydrogen ion + Uridine triphosphate > Deoxyuridine triphosphate +2 flavodoxin semi oxidized + Water", "Adenosine triphosphate + Uridine 5'-diphosphate <> ADP + Uridine triphosphate", "Glucose 1-phosphate + Hydrogen ion + Uridine triphosphate <> Pyrophosphate + UDP-Glucose", "Adenosine triphosphate + L-Glutamine + Water + Uridine triphosphate > ADP + Cytidine triphosphate + L-Glutamate +2 Hydrogen ion + Phosphate", "Water + Uridine triphosphate > Hydrogen ion + Pyrophosphate + Uridine 5'-monophosphate", "N-Acetyl-glucosamine 1-phosphate + Hydrogen ion + Uridine triphosphate > Pyrophosphate + Uridine diphosphate-N-acetylglucosamine", "Adenosine triphosphate + Uridine 5'-diphosphate <> ADP + Uridine triphosphate", "Uridine triphosphate + Glucose 1-phosphate <> Pyrophosphate + UDP-Glucose", "Uridine triphosphate + Glucosamine-1P <> Pyrophosphate + Uridine diphosphate-N-acetylglucosamine", "Uridine triphosphate + RNA <> Pyrophosphate + RNA", "Uridine triphosphate + Cytidine <> Uridine 5'-diphosphate + Cytidine monophosphate", "Cytidine triphosphate + Water <> Uridine triphosphate + Ammonia", "Adenosine triphosphate + Uridine triphosphate + Ammonia <> ADP + Phosphate + Cytidine triphosphate", "Adenosine triphosphate + Uridine triphosphate + L-Glutamine + Water <> ADP + Phosphate + Cytidine triphosphate + L-Glutamate", "Uridine triphosphate + Water <> Uridine 5'-monophosphate + Pyrophosphate", "Uridine triphosphate + Uridine <> Uridine 5'-diphosphate + Uridine 5'-monophosphate", "Deoxyuridine triphosphate + Thioredoxin disulfide + Water <> Uridine triphosphate + Thioredoxin", "Uridine triphosphate + D-Tagatose 6-phosphate <> Uridine 5'-diphosphate + D-Tagatose 1,6-bisphosphate", "Adenosine triphosphate + Uridine triphosphate + L-Glutamine + Water > Hydrogen ion + ADP + Phosphate + Cytidine triphosphate + L-Glutamate", "Hydrogen ion + Glucose 1-phosphate + Uridine triphosphate > UDP-Glucose + Pyrophosphate", "Hydrogen ion + <i>N</i>-acetyl-&alpha;-D-glucosamine 1-phosphate + Uridine triphosphate > Uridine diphosphate-N-acetylglucosamine + Pyrophosphate", "Uridine 5'-diphosphate + Adenosine triphosphate > Uridine triphosphate + ADP", "Uridine triphosphate + Alpha-D-glucose 1-phosphate > Pyrophosphate + UDP-Glucose", "Uridine triphosphate + Alpha-D-glucose 1-phosphate > Pyrophosphate + UDP-Glucose", "Uridine triphosphate + N-acetyl-alpha-D-glucosamine 1-phosphate > Pyrophosphate + Uridine diphosphate-N-acetylglucosamine", "Uridine triphosphate + [protein-PII] > Pyrophosphate + uridylyl-[protein-PII]", "Adenosine triphosphate + Uridine triphosphate + Ammonia > ADP + Inorganic phosphate + Cytidine triphosphate", "Adenosine triphosphate + Uridine triphosphate + L-Glutamine + Water + Ammonia <> ADP + Phosphate + Cytidine triphosphate + L-Glutamate", "Uridine triphosphate + [Protein-PII] <> Pyrophosphate + Uridylyl-[protein-PII]", "Glucose 1-phosphate + Uridine triphosphate + Hydrogen ion + Uridine triphosphate > Pyrophosphate + UDP-Glucose", "\u03b2-D-glucose 1-phosphate + Uridine triphosphate + Hydrogen ion + Uridine triphosphate > UDP-Glucose + Pyrophosphate", "Alpha-D-glucose 1-phosphate + Uridine triphosphate + Hydrogen ion + Uridine triphosphate > Pyrophosphate + UDP-Glucose", "N-Acetyl-glucosamine 1-phosphate + Uridine triphosphate + Hydrogen ion + N-Acetyl-glucosamine 1-phosphate + Uridine triphosphate > Uridine diphosphate-N-acetylglucosamine + Pyrophosphate", "Uridine 5'-diphosphate + Adenosine triphosphate + Uridine 5'-diphosphate > Uridine triphosphate + Adenosine diphosphate + Uridine triphosphate + ADP", "Uridine triphosphate + a reduced flavodoxin + Uridine triphosphate > Water + an oxidized flavodoxin + Deoxyuridine triphosphate", "Uridine triphosphate + L-Glutamine + Water + Adenosine triphosphate + Uridine triphosphate > Adenosine diphosphate + Hydrogen ion + Phosphate + L-Glutamic acid + Cytidine triphosphate + ADP + L-Glutamate", "N-Acetyl-glucosamine 1-phosphate + Uridine triphosphate + Hydrogen ion > Uridine diphosphate-N-acetylglucosamine + Pyrophosphate" ] }, "smiles": "O[C@H]1[C@@H](O)[C@@H](O[C@@H]1COP(O)(=O)OP(O)(=O)OP(O)(O)=O)N1C=CC(=O)NC1=O", "spectra": { "spectrum": [ { "spectrum_id": "12936", "type": "Specdb::CMs" }, { "spectrum_id": "37402", "type": "Specdb::CMs" }, { "spectrum_id": "4844", "type": "Specdb::NmrOneD" }, { "spectrum_id": "4845", "type": "Specdb::NmrOneD" }, { "spectrum_id": "28958", "type": "Specdb::MsMs" }, { "spectrum_id": "28959", "type": "Specdb::MsMs" }, { "spectrum_id": "28960", "type": "Specdb::MsMs" }, { "spectrum_id": "35516", "type": "Specdb::MsMs" }, { "spectrum_id": "35517", "type": "Specdb::MsMs" }, { "spectrum_id": "35518", "type": "Specdb::MsMs" } ] }, "state": "Solid", "synonyms": { "synonym": [ "5'-UTP", "Uridine 5'-triphosphate", "Uridine 5'-triphosphoric acid", "Uridine mono(tetrahydrogen triphosphate)", "Uridine mono(tetrahydrogen triphosphoric acid)", "Uridine triphosphate", "Uridine triphosphoric acid", "Uridine-5'-triphosphate", "Uridine-5'-triphosphoric acid", "Uridine-triphosphate", "Uridine-triphosphoric acid", "Uteplex", "UTP" ] }, "synthesis_reference": "Kenner, G. W.; Todd, A. R.; Webb, R. F.; Weymouth, F. J.  Nucleotides. XXVIII. Synthesis of uridine 5'-triphosphate.    Journal of the Chemical Society  (1954),  46-52  2288-93.", "tanimoto_similarity": 1, "taxon_distance": 7, "traditional_iupac": "uridine 5'-triphosphoric acid", "transporters": { "enzyme": { "gene_name": "ndk", "name": "Nucleoside diphosphate kinase", "protein_url": "http://ecmdb.ca/proteins/P0A763.xml", "uniprot_id": "P0A763", "uniprot_name": "NDK_ECOLI" } }, "update_date": "2015-06-03 15:53:27 -0600", "version": "2.0", "wikipedia": "Uridine triphosphate" } ], [], [ [ "cellular organisms", "Eukaryota", "Opisthokonta", "Metazoa", "Eumetazoa", "Bilateria", "Deuterostomia", "Chordata", "Craniata", "Vertebrata", "Gnathostomata", "Teleostomi", "Euteleostomi", "Sarcopterygii", "Dipnotetrapodomorpha", "Tetrapoda", "Amniota", "Mammalia", "Theria", "Eutheria", "Boreoeutheria", "Euarchontoglires", "Primates", "Haplorrhini", "Simiiformes", "Catarrhini", "Hominoidea", "Hominidae", "Homininae", "Homo", "Homo sapiens" ] ] ])
  }

  formatData(data) {
    if (data != null) {
      var f_concentrations = [];

      let newMetaboliteMetadataDict = {};

      //this.props.dispatch(setLineage(data[2][0]));

      let tani = false;
      let a = "asdfa";
      for (var n = data[0].length; n > 0; n--) {
        if (data[0][n - 1].tanimoto_similarity < 1) {
          this.setState({ tanimoto: true });
          tani = true;
        } else {
          this.setState({ tanimoto: false });
          //this.props.dispatch(abstractMolecule(false))
        }

        var concs = data[0][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }

          let new_dict = newMetaboliteMetadataDict[data[0][n - 1].inchikey];
          if (!new_dict) {
            new_dict = {};
          }
          new_dict = {
            name: data[0][n - 1].name,
            kegg_id: data[0][n - 1].kegg_id,
            chebi_id: data[0][n - 1].chebi_id,
            inchi: data[0][n - 1].inchi,
            inchiKey: data[0][n - 1].inchikey,
            SMILES: data[0][n - 1].smiles,
            chemical_formula: data[0][n - 1].chemical_formula
          };

          newMetaboliteMetadataDict[data[0][n - 1].inchikey] = new_dict;

          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = "";
            var organism = "Escherichia coli";

            if (concs.growth_status[i] != null) {
              if (
                concs.growth_status[i].toLowerCase().indexOf("stationary") >= 0
              ) {
                growth_phase = "Stationary Phase";
              } else if (
                concs.growth_status[i].toLowerCase().indexOf("log") >= 0
              ) {
                growth_phase = "Log Phase";
              }
            }
            if ("strain" in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + " " + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[0][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_conditions: concs.growth_system[i],
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[0][n - 1].taxon_distance,
              tanimoto_similarity: data[0][n - 1].tanimoto_similarity,
              source_link: { source: "ecmdb", id: data[0][n - 1].m2m_id }
            });
          }
        }
      }

      for (var n = data[1].length; n > 0; n--) {
        if (data[1][n - 1].tanimoto_similarity < 1) {
          this.setState({ tanimoto: true });
          tani = true;
        }

        var concs = data[1][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }

          let new_dict = newMetaboliteMetadataDict[data[1][n - 1].inchikey];
          if (!new_dict) {
            new_dict = {};
          }
          new_dict = {
            name: data[1][n - 1].name,
            kegg_id: data[1][n - 1].kegg_id,
            chebi_id: data[1][n - 1].chebi_id,
            inchi: data[1][n - 1].inchi,
            inchiKey: data[1][n - 1].inchikey,
            SMILES: data[1][n - 1].smiles,
            chemical_formula: data[1][n - 1].chemical_formula
          };

          newMetaboliteMetadataDict[data[1][n - 1].inchikey] = new_dict;

          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = "";
            var organism = data[1][n - 1].species;
            if ("strain" in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + " " + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[1][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[1][n - 1].taxon_distance,
              tanimoto_similarity: data[1][n - 1].tanimoto_similarity,
              source_link: { source: "ymdb", id: data[1][n - 1].ymdb_id }
            });
          }
        }
      }
      if (tani) {
        //this.props.dispatch(abstractMolecule(true))
        this.setState({ tanimoto: true });
      } else {
        //this.props.dispatch(abstractMolecule(false))
        this.setState({ tanimoto: false });
      }

      let metaboliteMetadata = Object.keys(newMetaboliteMetadataDict).map(
        function(key) {
          return newMetaboliteMetadataDict[key];
        }
      );

      this.props.dispatch(setTotalData(f_concentrations));
      this.setState({
        data_arrived: true,
        metaboliteMetadata: metaboliteMetadata
        //displayed_data: f_concentrations
      });
    } else {
      //alert('Nothing Found');
    }
  }

  onFirstDataRendered(params) {
    //params.columnApi.autoSizeColumns(['concentration'])

    var allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    let selectedRows = [];
    for (var i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
      selectedRows.push(event.api.getSelectedNodes()[i].data);
    }
    this.props.dispatch(setSelectedData(selectedRows));
  }

  onFiltered(event) {
    event.api.deselectAll();
    this.props.dispatch(setSelectedData([]));
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  onClicked() {
    this.gridApi
      .getFilterInstance("taxonomic_proximity")
      .getFrameworkComponentInstance()
      .componentMethod2("Hello World!");
  }

  render() {
    const values = queryString.parse(this.props.location.search);

    if (
      this.state.metaboliteMetadata.length === 0 ||
      this.props.totalData == null
    ) {
      return (
        <div className="loader-full-content-container">
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="biochemical-entity-scene biochemical-entity-metabolite-scene">
        <MetadataSection
          metaboliteMetadata={this.state.metaboliteMetadata}
          abstract={this.state.tanimoto}
          molecule={this.props.match.params.molecule}
          organism={this.props.match.params.organism}
        />

        <div className="ag-chart ag-theme-balham">
          <AgGridReact
            modules={this.state.modules}
            frameworkComponents={this.state.frameworkComponents}
            columnDefs={this.state.columnDefs}
            sideBar={sideBar}
            rowData={this.props.totalData}
            gridOptions={{ floatingFilter: true }}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            rowSelection={this.state.rowSelection}
            groupSelectsChildren={true}
            suppressRowClickSelection={true}
            //autoGroupColumnDef={this.state.autoGroupColumnDef}
            //onGridReady={this.onGridReady}
            lineage={this.state.lineage}
            onSelectionChanged={this.onRowSelected.bind(this)}
            onFilterChanged={this.onFiltered.bind(this)}
            domLayout={"autoHeight"}
            domLayout={"autoWidth"}
            onGridReady={this.onGridReady}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default withRouter(Metabolite);
