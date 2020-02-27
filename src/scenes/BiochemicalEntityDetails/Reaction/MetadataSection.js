import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";

const DB_LINKS = [
  { label: "Brenda", url: "https://www.brenda-enzymes.org/enzyme.php?ecno=" },
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
    const substratesProducts = query.split("-->");
    const substrates = substratesProducts[0].trim();
    const products = substratesProducts[1].trim();

    return (
      "reactions/kinlaw_by_name/" +
      "?substrates=" +
      substrates +
      "&products=" +
      products +
      "&_from=0" +
      "&size=1000" +
      "&bound=tight"
    );
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

    if (name) {
      const start = name[0].toUpperCase();
      const end = name.substring(1, name.length);
      processedData["name"] = start + end;
    }

    processedData["equation"] =
      MetadataSection.formatSide(substrates) +
      " → " +
      MetadataSection.formatSide(products);
    return processedData;
  }

  static formatTitle(processedData) {
    let title = processedData.name;
    if (!title) {
      title = processedData.equation;
    }
    return upperCaseFirstLetter(title);
  }

  static formatMetadata(processedData) {
    const sections = [];

    // description
    const descriptions = [];
    if (processedData.name) {
      descriptions.push({ label: "Name", value: processedData.name });
    }
    if (processedData.equation) {
      descriptions.push({ label: "Equation", value: processedData.equation });
    }
    if (processedData.ecNumber) {
      descriptions.push({
        label: "EC number",
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
    if (processedData.ecnumber !== undefined) {
      const dbLinks = [];
      for (const dbLink of DB_LINKS) {
        dbLinks.push(
          <li key={dbLink.label}>
            <a
              href={dbLink.url + processedData.ecnumber}
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
        id: "links",
        title: "Database links",
        content: <ul className="three-col-list link-list">{dbLinks}</ul>
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
