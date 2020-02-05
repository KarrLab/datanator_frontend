import React, { Component } from "react";
import { withRouter } from "react-router";
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

  getMetadataUrl(query) {
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

  formatMetadata(rawData) {
    if (rawData != null) {
      const formattedData = {};

      const reactionId = MetadataSection.getReactionId(rawData[0].resource);
      const ecNumber = MetadataSection.getEcNum(rawData[0].resource);
      const name = rawData[0]["enzymes"][0]["enzyme"][0]["enzyme_name"];
      const substrates = MetadataSection.getSubstrateNames(
        rawData[0].reaction_participant[0].substrate
      );
      const products = MetadataSection.getProductNames(
        rawData[0].reaction_participant[1].product
      );
      formattedData["reactionId"] = reactionId;
      formattedData["substrates"] = substrates;
      formattedData["products"] = products;
      if (ecNumber !== "-.-.-.-") {
        formattedData["ecNumber"] = ecNumber;
      }

      if (name) {
        const start = name[0].toUpperCase();
        const end = name.substring(1, name.length);
        formattedData["name"] = start + end;
      }

      formattedData["equation"] =
        MetadataSection.formatSide(substrates) +
        " → " +
        MetadataSection.formatSide(products);

      this.setState({ metadata: formattedData });

      let title = formattedData.name;
      if (!title) {
        title = formattedData.equation;
      }
      title = upperCaseFirstLetter(title);

      const sections = [
        {
          id: "description",
          title: "Description"
        }
      ];

      this.props["set-scene-metadata"]({
        title: title,
        metadataSections: sections
      });
    }
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
    const metadata = this.state.metadata;

    const props = [];
    const dbLinks = [];
    if (metadata != null) {
      if (metadata.name) {
        props.push({ label: "Name", value: metadata.name });
      }
      if (metadata.equation) {
        props.push({ label: "Equation", value: metadata.equation });
      }
      if (metadata.ecNumber) {
        props.push({
          label: "EC number",
          value: (
            <a
              href={"https://enzyme.expasy.org/EC/" + metadata.ecNumber}
              target="_blank"
              rel="noopener noreferrer"
            >
              {metadata.ecNumber}
            </a>
          )
        });

        for (const dbLink of DB_LINKS) {
          dbLinks.push(
            <li key={dbLink.label}>
              <a
                href={dbLink.url + metadata.ecnumber}
                target="_blank"
                rel="noopener noreferrer"
                className="bulleted-list-item"
              >
                {dbLink.label}
              </a>
            </li>
          );
        }
      }
    }

    return (
      <div>
        <BaseMetadataSection
          entity-type="reaction"
          get-metadata-url={this.getMetadataUrl}
          format-metadata={this.formatMetadata.bind(this)}
          set-scene-metadata={this.props["set-scene-metadata"]}
        />

        {metadata && (
          <div>
            <div className="content-block" id="description">
              <h2 className="content-block-heading">Description</h2>
              <div className="content-block-content">
                <ul className="key-value-list link-list">
                  {props.map(el => (
                    <li key={el.label}>
                      <b>{el.label}:</b> {el.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {dbLinks.length > 0 && (
              <div className="content-block" id="properties">
                <h2 className="content-block-heading">Database Links</h2>
                <div className="content-block-content">
                  <ul className="three-col-list link-list">{dbLinks}</ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(MetadataSection);
