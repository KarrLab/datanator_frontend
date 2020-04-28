import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  upperCaseFirstLetter,
  strCompare,
  formatEntityForUrl
} from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import { LoadExternalContent, LoadContent } from "../LoadContent";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static processDescriptionFromUniprot(uniprotData) {
    let response = "No description available.";
    if (
      uniprotData &&
      uniprotData.length &&
      uniprotData[0] &&
      uniprotData[0].comments &&
      uniprotData[0].comments.length &&
      uniprotData[0].comments[0] &&
      uniprotData[0].comments[0].text &&
      uniprotData[0].comments[0].text.length
    ) {
      response = uniprotData[0].comments[0].text[0].value;
    }

    return response;
  }

  static processRelatedReactions(organism, relatedReactions) {
    const formattedResults = {};

    for (const reaction of relatedReactions) {
      const id = reaction.kinlaw_id;
      let formattedResult = formattedResults[id];
      if (!formattedResult) {
        formattedResult = {};
        formattedResults[id] = formattedResult;
      }

      const substrates = [];
      const products = [];
      for (const substrate of reaction.substrates[0]) {
        substrates.push(substrate.substrate_name);
      }
      for (const product of reaction.products[0]) {
        products.push(product.product_name);
      }

      const equation = formatSide(substrates) + " → " + formatSide(products);
      const ecMeta = reaction["ec_meta"];
      let route =
        "/reaction/" +
        formatParticipantForUrl(substrates) +
        "-->" +
        formatParticipantForUrl(products);
      if (organism) {
        route += "/" + organism;
      }

      formattedResult["title"] = ecMeta["ec_name"];
      formattedResult["content"] = (
        <div key={id} className="subsection">
          <div className="subsection-title">
            <Link to={route}>{ecMeta["ec_name"]}</Link>
          </div>
          <div className="subsection-description">
            <div>{equation}</div>
            <div>
              EC:{" "}
              <a href={"https://enzyme.expasy.org/EC/" + ecMeta["ec_number"]}>
                {ecMeta["ec_number"]}
              </a>
            </div>
          </div>
        </div>
      );
    }

    const sortedResults = Object.values(formattedResults);
    sortedResults.sort((a, b) => {
      return strCompare(a.title, b.title);
    });
    return sortedResults.map(result => {
      return result.content;
    });
  }

  static getMetadataUrl(query) {
    return "kegg/get_meta/?kegg_ids=" + query;
  }

  static processMetadata(rawData) {
    let processedData = {};

    processedData.koName = rawData[0].definition.name[0];
    processedData.koNumber = rawData[0].kegg_orthology_id;
    processedData.description = null;
    processedData.ecCode = rawData[0].definition.ec_code[0];
    processedData.pathways = rawData[0].kegg_pathway;
    processedData.descriptionUrl =
      "https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&gene=" +
      rawData[0].gene_name[0];

    processedData.relatedLinksUrl =
      "proteins/related/related_reactions/?ko=" + rawData[0].kegg_orthology_id;

    return processedData;
  }

  static formatTitle(processedData) {
    return upperCaseFirstLetter(processedData.koName);
  }

  static formatMetadata(processedData, organism) {
    const sections = [];

    const descriptions = [];

    descriptions.push({
      key: "KEGG",
      value: (
        <a
          href={
            "https://www.genome.jp/dbget-bin/www_bget?ko:" +
            processedData.koNumber
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          {processedData.koNumber}
        </a>
      )
    });
    if (processedData.ecCode !== undefined) {
      descriptions.push({
        key: "EC code",
        value: (
          <a
            href={"https://enzyme.expasy.org/EC/" + processedData.ecCode}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {processedData.ecCode}
          </a>
        )
      });
    }

    sections.push({
      id: "description",
      title: "Description",
      content: (
        <div>
          <LoadExternalContent
            url={processedData.descriptionUrl}
            format-results={MetadataSection.processDescriptionFromUniprot}
          />
        </div>
      )
    });

    sections.push({
      id: "cross-refs",
      title: "Cross references",
      content: (
        <ul className="key-value-list link-list">
          {descriptions.map(desc => {
            return (
              <li key={desc.key}>
                <b>{desc.key}</b>: {desc.value}
              </li>
            );
          })}
        </ul>
      )
    });

    sections.push({
      id: "reactions",
      title: "Reactions",
      content: (
        <div>
          <LoadContent
            url={processedData.relatedLinksUrl}
            format-results={MetadataSection.processRelatedReactions.bind(
              null,
              organism
            )}
          />
        </div>
      )
    });

    if (processedData.pathways) {
      if (processedData.pathways.length > 0) {
        processedData.pathways.sort((a, b) => {
          return strCompare(a.pathway_description, b.pathway_description);
        });
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
                          "https://www.genome.jp/dbget-bin/www_bget?map" +
                          map_id
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
    }
    return sections;
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="ortholog group"
        get-metadata-url={MetadataSection.getMetadataUrl}
        process-metadata={MetadataSection.processMetadata}
        format-title={MetadataSection.formatTitle}
        format-metadata={MetadataSection.formatMetadata}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}

function formatSide(parts) {
  return parts.join(" + ");
}

export { MetadataSection };
