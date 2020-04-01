import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import { Link } from "react-router-dom";

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
    args.push("substrates=" + substratesProducts[0].trim());
    if (substratesProducts.length >= 2) {
      args.push("products=" + substratesProducts[1].trim());
    }

    return "reactions/kinlaw_by_name/?" + args.join("&");
  }

  static processMetadata(rawData) {
    const processedData = {};

    const reactionId = MetadataSection.getReactionId(rawData[0].resource);
    const ecNumber = MetadataSection.getEcNum(rawData[0].resource);
    const name = rawData[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
    const substrates = MetadataSection.getSubstrateNames(
      rawData[0].reaction_participant[0].substrate
    );
    const products = MetadataSection.getProductNames(
      rawData[0].reaction_participant[1].product
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
      MetadataSection.formatSide(substrates) +
      " → " +
      MetadataSection.formatSide(products);

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

    const part_links = [];
    for (const sub of processedData.substrates) {
      let route = "/metabolite/" + sub;
      if (organism) {
        route += "/" + organism;
      }
      part_links.push(
        <Link key={"substrate-" + sub} to={route}>
          {sub}
        </Link>
      );
      part_links.push(" + ");
    }
    if (processedData.substrates.length) {
      part_links.pop();
    }
    part_links.push(" → ");
    for (const prod of processedData.products) {
      let route = "/metabolite/" + prod;
      if (organism) {
        route += "/" + organism;
      }
      part_links.push(
        <Link key={"product-" + prod} to={route}>
          {prod}
        </Link>
      );
      part_links.push(" + ");
    }
    if (processedData.products.length) {
      part_links.pop();
    }

    // description
    const descriptions = [];
    if (processedData.enzyme) {
      if (processedData.kegg_orthology_id) {
        let route = "/protein/" + processedData.kegg_orthology_id;
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
      descriptions.push({ label: "Equation", value: part_links });
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
          <ul className="two-col-list link-list">
            {processedData.pathways.map(el => {
              if (el.kegg_pathway_code) {
                const map_id = el.kegg_pathway_code.substring(
                  2,
                  el.kegg_pathway_code.length
                );
                return (
                  <li key={el.pathway_description}>
                    <a
                      href={
                        "https://www.genome.jp/dbget-bin/www_bget?map" + map_id
                      }
                      className="bulleted-list-item"
                      target="_blank"
                      rel="noopener noreferrer"
                      dangerouslySetInnerHTML={{
                        __html: upperCaseFirstLetter(el.pathway_description)
                      }}
                    ></a>
                  </li>
                );
              } else {
                return (
                  <li key={el.pathway_description}>
                    <div
                      className="bulleted-list-item"
                      dangerouslySetInnerHTML={{
                        __html: upperCaseFirstLetter(el.pathway_description)
                      }}
                    ></div>
                  </li>
                );
              }
            })}
          </ul>
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

  static getSubstrateNames(substrates) {
    const names = [];
    for (const substrate of substrates) {
      names.push(substrate.substrate_name);
    }
    return names;
  }

  static getProductNames(products) {
    const names = [];
    for (const product of products) {
      names.push(product.product_name);
    }
    return names;
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
