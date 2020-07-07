import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BaseMetadataSection from "../MetadataSection";
import { LoadExternalContent, LoadContent } from "../LoadContent";
import KeggPathwaysMetadataSection from "../KeggPathwaysMetadataSection";
import { naturalSort, isKeggOrthologyId } from "~/utils/utils";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired,
  };

  static blankResponse = "No description available.";

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static processDescriptionFromUniprot(query, uniprotData) {
    if (
      uniprotData == null ||
      uniprotData.length === 0 ||
      uniprotData[0] == null
    ) {
      return MetadataSection.blankResponse;
    }

    uniprotData = uniprotData[0];

    let comments = null;
    if (
      uniprotData.comments &&
      uniprotData.comments.length &&
      uniprotData.comments[0] &&
      uniprotData.comments[0].text &&
      uniprotData.comments[0].text.length
    ) {
      comments = uniprotData.comments[0].text[0].value;
    }

    let response;
    if (isKeggOrthologyId(query)) {
      if (comments) {
        response = comments;
      } else {
        response = MetadataSection.blankResponse;
      }
    } else {
      const properties = [];

      // gene
      let geneName = null;
      let geneUrl = null;
      if (uniprotData.gene && uniprotData.gene.length && uniprotData.gene[0]) {
        if (uniprotData.gene[0].name && uniprotData.gene[0].name.value) {
          geneName = uniprotData.gene[0].name.value;
        } else if (
          uniprotData.gene[0].olnNames &&
          uniprotData.gene[0].olnNames[0]
        ) {
          if (uniprotData.gene[0].olnNames[0].value) {
            geneName = uniprotData.gene[0].olnNames[0].value;
          } else if (
            uniprotData.gene[0].olnNames[0].evidences &&
            uniprotData.gene[0].olnNames[0].evidences.length
          ) {
            geneName = uniprotData.gene[0].olnNames[0].value;
            geneUrl = uniprotData.gene[0].olnNames[0].evidences[0].source.url;
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
        uniprotData.organism &&
        uniprotData.organism.names &&
        uniprotData.organism.names.length &&
        uniprotData.organism.names[0] &&
        uniprotData.organism.names[0].value
      ) {
        properties.push({
          key: "Organism",
          value: (
            <a
              href={
                "https://www.ncbi.nlm.nih.gov/taxonomy/" +
                uniprotData.organism.taxonomy
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {uniprotData.organism.names[0].value.split("(")[0].trim()}
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
      if (uniprotData.sequence && uniprotData.sequence.sequence) {
        const seq = uniprotData.sequence.sequence;
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
      } else {
        response = MetadataSection.blankResponse;
      }
    }

    return response;
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

      const equation =
        formatSide(substrateNames) + " → " + formatSide(productNames);
      const ecMeta = reaction["ec_meta"];
      let route =
        "/reaction/" +
        substrateIds.join(",") +
        "-->" +
        productIds.join(",") +
        "/";
      if (organism) {
        route += organism + "/";
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
              <a
                href={"https://enzyme.expasy.org/EC/" + ecMeta["ec_number"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ecMeta["ec_number"]}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return formattedResults.map((result) => {
      return result.content;
    });
  }

  static getMetadataUrl(query) {
    if (isKeggOrthologyId(query)) {
      return "kegg/get_meta/?kegg_ids=" + query;
    } else {
      return "proteins/meta/meta_combo/?uniprot_id=" + query;
    }
  }

  static processMetadata(query, organism, rawData) {
    if (isKeggOrthologyId(query)) {
      return MetadataSection.processKeggOrthologGroupMetadata(
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

  static processKeggOrthologGroupMetadata(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return;
    }

    let processedData = {};

    processedData.title = rawData[0].definition.name[0];
    processedData.koNumber = rawData[0].kegg_orthology_id;
    processedData.uniprotId = null;
    processedData.description = null;
    processedData.ecCode = rawData[0].definition.ec_code[0];
    processedData.pathways = rawData[0].kegg_pathway;
    if (rawData[0].gene_name[0].match(/^(\d+SrRNA|tRNA-[A-Z][a-z]+)$/)) {
      processedData.descriptionUrl = null;
    } else {
      processedData.descriptionUrl =
        "https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&gene=" +
        rawData[0].gene_name[0];
    }

    processedData.relatedLinksUrl =
      "proteins/related/related_reactions_by_kegg/?ko=" +
      rawData[0].kegg_orthology_id;

    return processedData;
  }

  static processUniProtProteinMetadata(query, organism, rawData) {
    if (!Array.isArray(rawData)) {
      return;
    }

    let processedData = {};

    processedData.title = rawData[0].protein_name.split("(")[0].trim();
    processedData.koNumber = null;
    processedData.uniprotId = query;
    processedData.description = null;
    processedData.ecCode = rawData[0].ec_number;
    processedData.pathways = [];
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
              format-results={(uniprotData) => {
                return MetadataSection.processDescriptionFromUniprot(
                  query,
                  uniprotData
                );
              }}
              error-message={MetadataSection.blankResponse}
            />
          </div>
        ),
      });
    }

    const crossRefs = [];

    if (processedData.koNumber != null) {
      crossRefs.push({
        key: "KEGG orthology",
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
        ),
      });
    } else {
      crossRefs.push({
        key: "KEGG orthology",
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

    if (processedData.pathways) {
      if (processedData.pathways.length > 0) {
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
          ),
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
