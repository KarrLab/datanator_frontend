import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import { Link } from "react-router-dom";
import KeggPathwaysMetadataSection from "../KeggPathwaysMetadataSection";

const DB_LINKS = [
  { label: "BRENDA", url: "https://www.brenda-enzymes.org/enzyme.php?ecno=" },
  { label: "ENZYME", url: "https://enzyme.expasy.org/EC/" },
  { label: "ExplorEnz", url: "https://www.enzyme-database.org/query.php?ec=" },
  {
    label: "IntEnz",
    url: "https://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec="
  },
  { label: "KEGG", url: "https://www.genome.jp/dbget-bin/www_bget?ec:" },
  {
    label: "MetaCyc",
    url: "http://biocyc.org/META/substring-search?type=REACTION&object="
  },
  { label: "SABIO-RK", url: "http://sabiork.h-its.org/newSearch?q=ecnumber:" }
];

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static getMetadataUrl(query) {
    if (query == null) {
      return;
    }

    const args = ["_from=0", "size=1000", "bound=tight"];

    const substratesProducts = query.split("-->");
    args.push(
      "substrates=" +
        substratesProducts[0].split(",").join(encodeURIComponent("|"))
    );
    if (substratesProducts.length >= 2) {
      args.push(
        "products=" +
          substratesProducts[1].split(",").join(encodeURIComponent("|"))
      );
    }

    return "reactions/kinlaw_by_name/?" + args.join("&");
  }

  static processMetadata(rawData) {
    const processedData = {};

    const reactionId = MetadataSection.getReactionId(rawData[0].resource);
    const ecNumber = MetadataSection.getEcNum(rawData[0].resource);
    const name = rawData[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
    const substrates = MetadataSection.getReactantNames(
      rawData[0].reaction_participant[0].substrate,
      "substrate"
    );
    const products = MetadataSection.getReactantNames(
      rawData[0].reaction_participant[1].product,
      "product"
    );
    processedData["reactionId"] = reactionId;
    processedData["substrates"] = substrates;
    processedData["products"] = products;
    if (ecNumber !== "-.-.-.-") {
      processedData["ecNumber"] = ecNumber;
    }

    if (rawData[0]["ec_meta"]) {
      if (rawData[0]["ec_meta"]["cofactor"]) {
        processedData["cofactor"] = rawData[0]["ec_meta"]["cofactor"];
      }
    }

    if (name) {
      const start = name[0].toUpperCase();
      const end = name.substring(1, name.length);
      processedData["enzyme"] = start + end;
    }
    if ("kegg_meta" in rawData[0]) {
      processedData["kegg_orthology_id"] =
        rawData[0]["kegg_meta"]["kegg_orthology_id"];
    }

    processedData["equation"] =
      MetadataSection.formatSide(substrates.map(part => part.name)) +
      " → " +
      MetadataSection.formatSide(products.map(part => part.name));

    if ("kegg_meta" in rawData[0]) {
      processedData["pathways"] = rawData[0].kegg_meta.kegg_pathway;
    }
    return processedData;
  }

  static formatTitle(processedData) {
    let title = processedData.enzyme;
    if (!title) {
      title = processedData.equation;
    }
    return upperCaseFirstLetter(title);
  }

  static formatMetadata(processedData, organism) {
    const sections = [];

    const partLinks = [];
    for (const sub of processedData.substrates) {
      if (sub.inchiKey) {
        let route = "/metabolite/" + encodeURIComponent(sub.inchiKey);
        if (organism) {
          route += "/" + organism;
        }
        partLinks.push(
          <Link key={"substrate-" + sub.name} to={route}>
            {sub.name}
          </Link>
        );
      } else {
        partLinks.push(sub.name);
      }
      partLinks.push(" + ");
    }
    if (processedData.substrates.length) {
      partLinks.pop();
    }

    partLinks.push(" → ");
    for (const prod of processedData.products) {
      if (prod.inchiKey) {
        let route = "/metabolite/" + encodeURIComponent(prod.inchiKey);
        if (organism) {
          route += "/" + organism;
        }
        partLinks.push(
          <Link key={"substrate-" + prod.name} to={route}>
            {prod.name}
          </Link>
        );
      } else {
        partLinks.push(prod.name);
      }
      partLinks.push(" + ");
    }
    if (processedData.products.length) {
      partLinks.pop();
    }

    // description
    const descriptions = [];
    if (processedData.enzyme) {
      if (processedData.kegg_orthology_id) {
        let route = "/gene/" + processedData.kegg_orthology_id;
        if (organism) {
          route += "/" + organism;
        }
        descriptions.push({
          label: "Enzyme",
          value: <Link to={route}>{processedData.enzyme}</Link>
        });
      } else {
        descriptions.push({ label: "Enzyme", value: processedData.enzyme });
      }
    }
    if (processedData.equation) {
      descriptions.push({ label: "Equation", value: partLinks });
    }
    if (processedData.cofactor) {
      descriptions.push({
        label: "Cofactor",
        value: (
          <Link
            to={
              "/metabolite/" +
              processedData.cofactor +
              "/" +
              (organism ? organism : "")
            }
          >
            {processedData.cofactor}
          </Link>
        )
      });
    }
    if (processedData.ecNumber) {
      descriptions.push({
        label: "EC code",
        value: (
          <a
            href={"https://enzyme.expasy.org/EC/" + processedData.ecNumber}
            target="_blank"
            rel="noopener noreferrer"
          >
            {processedData.ecNumber}
          </a>
        )
      });
    }
    if (descriptions) {
      sections.push({
        id: "description",
        title: "Description",
        content: (
          <ul className="key-value-list link-list">
            {descriptions.map(el => (
              <li key={el.label}>
                <b>{el.label}:</b> {el.value}
              </li>
            ))}
          </ul>
        )
      });
    }

    // database links
    if (processedData.ecNumber !== undefined) {
      const dbLinks = [];
      for (const dbLink of DB_LINKS) {
        dbLinks.push(
          <li key={dbLink.label}>
            <a
              href={dbLink.url + processedData.ecNumber}
              target="_blank"
              rel="noopener noreferrer"
              className="bulleted-list-item"
            >
              {dbLink.label}
            </a>
          </li>
        );
      }
      sections.push({
        id: "cross-refs",
        title: "Cross references",
        content: <ul className="three-col-list link-list">{dbLinks}</ul>
      });
    }

    if (processedData.pathways) {
      sections.push({
        id: "pathways",
        title: "Pathways",
        content: (
          <KeggPathwaysMetadataSection
            pathways={processedData.pathways}
            page-size={30}
            kegg-id-name={"kegg_pathway_code"}
            kegg-description-name={"pathway_description"}
          />
        )
      });
    }

    // return sections
    return sections;
  }

  static getReactionId(resources) {
    for (const resource of resources) {
      if (resource.namespace === "sabiork.reaction") {
        return resource.id;
      }
    }
  }

  static getEcNum(resources) {
    for (const resource of resources) {
      if (resource.namespace === "ec-code") {
        return resource.id;
      }
    }
  }

  static getReactantNames(reactants, reactant_type) {
    let structure_id = null;
    let name_id = null;
    if (reactant_type === "substrate") {
      structure_id = "substrate_structure";
      name_id = "substrate_name";
    } else if (reactant_type === "product") {
      structure_id = "product_structure";
      name_id = "product_name";
    }
    const molecules = [];
    for (const reactant of reactants) {
      const new_molecule = {
        name: null,
        inchiKey: null
      };
      new_molecule["name"] = reactant[name_id];
      if (reactant[structure_id]) {
        for (var i = reactant[structure_id].length - 1; i >= 0; i--) {
          if (reactant[structure_id][i]["format"] === "inchi") {
            new_molecule["inchiKey"] = reactant[structure_id][i]["InChI_Key"];
          }
        }
      }
      molecules.push(new_molecule);
    }
    return molecules;
  }

  static formatSide(parts) {
    return parts.join(" + ");
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="reaction"
        get-metadata-url={MetadataSection.getMetadataUrl}
        process-metadata={MetadataSection.processMetadata}
        format-title={MetadataSection.formatTitle}
        format-metadata={MetadataSection.formatMetadata}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { MetadataSection };
