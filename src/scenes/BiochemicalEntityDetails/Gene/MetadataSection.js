import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BaseMetadataSection from "../MetadataSection";
import { LoadExternalContent, LoadContent } from "../LoadContent";
import { naturalSort, isOrthoDbId } from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  static blankResponse = "No description available.";

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static processDescriptionFromUniprot(query, data) {
    if (data == null || data.length === 0) {
      return MetadataSection.blankResponse;
    }

    for (const datum of data) {
      if (datum == null) {
        continue;
      }

      let response = null;

      let comments = null;
      if (
        datum.comments &&
        datum.comments.length &&
        datum.comments[0] &&
        datum.comments[0].text &&
        datum.comments[0].text.length
      ) {
        comments = datum.comments[0].text[0].value;
      }

      if (isOrthoDbId(query)) {
        if (comments) {
          response = comments;
        }
      } else {
        const properties = [];

        // gene
        let geneName = null;
        let geneUrl = null;
        if (datum.gene && datum.gene.length && datum.gene[0]) {
          if (datum.gene[0].name && datum.gene[0].name.value) {
            geneName = datum.gene[0].name.value;
          } else if (datum.gene[0].olnNames && datum.gene[0].olnNames[0]) {
            if (datum.gene[0].olnNames[0].value) {
              geneName = datum.gene[0].olnNames[0].value;
            } else if (
              datum.gene[0].olnNames[0].evidences &&
              datum.gene[0].olnNames[0].evidences.length
            ) {
              geneName = datum.gene[0].olnNames[0].value;
              geneUrl = datum.gene[0].olnNames[0].evidences[0].source.url;
            }
          }
        }

        if (geneName != null) {
          if (geneUrl != null) {
            properties.push({
              key: "Gene",
              value: (
                <a href={geneUrl} target="_blank" rel="noopener noreferrer">
                  {geneName}
                </a>
              ),
            });
          } else {
            properties.push({
              key: "Gene",
              value: geneName,
            });
          }
        }

        // organism
        if (
          datum.organism &&
          datum.organism.names &&
          datum.organism.names.length &&
          datum.organism.names[0] &&
          datum.organism.names[0].value
        ) {
          properties.push({
            key: "Organism",
            value: (
              <a
                href={
                  "https://www.ncbi.nlm.nih.gov/taxonomy/" +
                  datum.organism.taxonomy
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {datum.organism.names[0].value.split("(")[0].trim()}
              </a>
            ),
          });
        }

        // comments
        if (comments) {
          properties.push({
            key: "Comments",
            value: comments,
          });
        }

        // sequence
        if (datum.sequence && datum.sequence.sequence) {
          const seq = datum.sequence.sequence;
          const aaPerLine = 115;
          const formattedSeq = [];
          for (
            let iLine = 0;
            iLine < Math.ceil(seq.length / aaPerLine);
            iLine++
          ) {
            formattedSeq.push(
              <li key={iLine}>
                {seq.slice(
                  iLine * aaPerLine,
                  Math.min((iLine + 1) * aaPerLine, seq.length)
                )}
              </li>
            );
          }

          properties.push({
            key: <span>Sequence ({seq.length} aa)</span>,
            value: <ul className="sequence">{formattedSeq}</ul>,
          });
        }

        if (properties.length) {
          response = (
            <ul className="key-value-list link-list">
              {properties.map((property) => {
                return (
                  <li key={property.key}>
                    <b>{property.key}</b>: {property.value}
                  </li>
                );
              })}
            </ul>
          );
        }
      }

      if (response != null) {
        return response;
      }
    }

    return MetadataSection.blankResponse;
  }

  static processRelatedReactions(organism, relatedReactions) {
    const formattedResults = [];

    for (const reaction of relatedReactions) {
      const id = reaction.kinlaw_id;
      const formattedResult = {};
      formattedResults.push(formattedResult);

      let substrateIds = null;
      let productIds = null;
      for (const participant of reaction.reaction_participant) {
        if ("substrate_aggregate" in participant) {
          substrateIds = participant.substrate_aggregate;
          substrateIds.sort();
        } else if ("product_aggregate" in participant) {
          productIds = participant.product_aggregate;
          productIds.sort();
        }
      }

      const substrateNames = reaction.substrates[0].map(
        (substrate) => substrate.substrate_name
      );
      const productNames = reaction.products[0].map(
        (product) => product.product_name
      );
      substrateNames.sort(naturalSort);
      productNames.sort(naturalSort);

      let equation =
        formatSide(substrateNames) + " → " + formatSide(productNames);

      let route =
        "/reaction/" +
        substrateIds.join(",") +
        "-->" +
        productIds.join(",") +
        "/";
      if (organism) {
        route += organism + "/";
      }

      let title;
      let name;
      let ecNumber;
      if ("ec_meta" in reaction) {
        const ecMeta = reaction["ec_meta"];
        title = ecMeta["ec_name"];
        name = ecMeta["ec_name"];
        ecNumber = ecMeta["ec_number"];
      } else {
        title = equation;
        name = equation;
        equation = null;
        ecNumber = null;
      }

      formattedResult["title"] = title;
      formattedResult["content"] = (
        <div key={id} className="subsection">
          <div className="subsection-title">
            <Link to={route}>{name}</Link>
          </div>
          {ecNumber != null && (
            <div className="subsection-description">
              <div>{equation}</div>
              <div>
                EC:{" "}
                <a
                  href={"https://enzyme.expasy.org/EC/" + ecNumber}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ecNumber}
                </a>
              </div>
            </div>
          )}
        </div>
      );
    }

    return formattedResults.map((result) => {
      return result.content;
    });
  }

  getMetadataUrl(query) {
    if (isOrthoDbId(query)) {
      return "kegg/get_meta/?kegg_ids=" + query;
    } else {
      return "proteins/meta/meta_combo/?uniprot_id=" + query;
    }
  }

  static processMetadata(query, organism, rawData) {
    if (isOrthoDbId(query)) {
      return MetadataSection.processOrthoDbGroupMetadata(
        query,
        organism,
        rawData
      );
    } else {
      return MetadataSection.processUniProtProteinMetadata(
        query,
        organism,
        rawData
      );
    }
  }

  static processOrthoDbGroupMetadata(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return;
    }

    let processedData = {};

    processedData.title = rawData[0].orthodb_name;
    processedData.orthoDbId = query;
    processedData.uniprotId = null;
    processedData.description = null;
    processedData.ecCode = null;
    processedData.descriptionUrl =
      "https://www.ebi.ac.uk/proteins/api/proteins/OrthoDB:" +
      query +
      "?offset=0&size=10";

    // Todo: check this works after updating KEGG -> OrthoDB
    processedData.relatedLinksUrl = null;
    // processedData.relatedLinksUrl =
    //  "proteins/related/related_reactions_by_kegg/?ko=" +
    //  processedData.orthoDbId;

    return processedData;
  }

  static processUniProtProteinMetadata(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return;
    }

    let processedData = {};

    processedData.title = rawData[0].protein_name.split("(")[0].trim();
    processedData.orthoDbId = null;
    processedData.uniprotId = query;
    processedData.description = null;
    processedData.ecCode = rawData[0].ec_number;
    processedData.descriptionUrl =
      "https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&accession=" +
      query;
    processedData.relatedLinksUrl =
      "proteins/related/related_reactions_by_uniprot/?uniprot_id=" + query;

    return processedData;
  }

  static formatTitle(processedData) {
    return processedData.title;
  }

  static formatMetadata(query, organism, processedData) {
    const sections = [];

    sections.push({
      id: "id",
      title: "Id",
      content: query,
    });

    if (processedData.descriptionUrl) {
      sections.push({
        id: "description",
        title: "Description",
        content: (
          <div>
            <LoadExternalContent
              url={processedData.descriptionUrl}
              format-results={(data) => {
                return MetadataSection.processDescriptionFromUniprot(
                  query,
                  data
                );
              }}
              error-message={MetadataSection.blankResponse}
            />
          </div>
        ),
      });
    }

    const crossRefs = [];

    if (processedData.orthoDbId != null) {
      crossRefs.push({
        key: "OrthoDB",
        value: (
          <a
            href={"https://www.orthodb.org/?query=" + processedData.orthoDbId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {processedData.orthoDbId}
          </a>
        ),
      });
    } else {
      crossRefs.push({
        key: "OrthoDB",
        value: "None",
      });
    }
    if (processedData.uniprotId != null) {
      crossRefs.push({
        key: "UniProt",
        value: (
          <a
            href={"https://www.uniprot.org/uniprot/" + processedData.uniprotId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            {processedData.uniprotId}
          </a>
        ),
      });
    }

    sections.push({
      id: "cross-refs",
      title: "Cross references",
      content: (
        <ul className="key-value-list link-list">
          {crossRefs.map((desc) => {
            return (
              <li key={desc.key}>
                <b>{desc.key}</b>: {desc.value}
              </li>
            );
          })}
        </ul>
      ),
    });

    if (processedData.relatedLinksUrl != null) {
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
        ),
      });
    } else {
      sections.push({
        id: "reactions",
        title: "Reactions",
        content: "No data is available.",
      });
    }

    return sections;
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="ortholog group"
        get-metadata-url={this.getMetadataUrl}
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
