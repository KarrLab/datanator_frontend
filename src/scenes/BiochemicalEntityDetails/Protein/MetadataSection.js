import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, removeDuplicates } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";

function formatMetadata(rawData) {
  //console.log(rawData)
  let koNumber;
  let koName;
  const uniprotIdToTaxonDist = {};
  for (const rawDatum of rawData) {
    for (const doc of rawDatum.documents) {
      if ("ko_number" in doc) {
        koNumber = doc.ko_number;
      }
      if ("ko_name" in doc && doc.ko_name.length > 0) {
        koName = doc.ko_name[0];
      }
      if (doc.abundances !== undefined) {
        uniprotIdToTaxonDist[doc.uniprot_id] = rawDatum.distance;
      }
    }
  }

  const uniprotIds = removeDuplicates(Object.keys(uniprotIdToTaxonDist));
  uniprotIds.sort();
  return {
    koNumber: koNumber,
    koName: koName,
    uniprotIdToTaxonDist: uniprotIdToTaxonDist,
    uniprotIds: uniprotIds
  };
}

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  getMetadataUrl(query, organism) {
    return (
      "proteins/proximity_abundance/proximity_abundance_kegg/" +
      "?kegg_id=" +
      query +
      (organism ? "&anchor=" + organism : "") +
      "&distance=40" +
      "&depth=40"
    );
  }

  formatMetadataInner(rawData, organism) {
    let metadata = formatMetadata(rawData);

    this.setState({
      metadata: metadata
    });

    const title = upperCaseFirstLetter(metadata.koName);

    const sections = [{ id: "description", title: "Description" }];

    this.props["set-scene-metadata"]({
      title: title,
      organism: organism,
      metadataSections: sections,
      uniprotIdToTaxonDist: metadata.uniprotIdToTaxonDist
    });
  }

  render() {
    const metadata = this.state.metadata;

    const uniprotIds = metadata ? metadata.uniprotIds : [];

    const uniprotLinks = [];
    for (const uniprotId of uniprotIds) {
      uniprotLinks.push(
        <li key={uniprotId}>
          <a
            href={"https://www.uniprot.org/uniprot/" + uniprotId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {uniprotId}
          </a>
        </li>
      );
    }

    return (
      <div>
        <BaseMetadataSection
          entity-type="ortholog group"
          get-metadata-url={this.getMetadataUrl}
          format-metadata={this.formatMetadataInner.bind(this)}
          set-scene-metadata={this.props["set-scene-metadata"]}
        />

        {metadata && (
          <div>
            <div className="content-block" id="description">
              <h2 className="content-block-heading">Description</h2>
              <div className="content-block-content">
                <ul className="key-value-list link-list">
                  <li>
                    <b>Name:</b> {metadata.koName}
                  </li>
                  <li>
                    <b>KEGG Orthology id:</b>{" "}
                    <a
                      href={
                        "https://www.genome.jp/dbget-bin/www_bget?ko:" +
                        metadata.koNumber
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {metadata.koNumber}
                    </a>
                  </li>
                  <li>
                    <b>Proteins:</b>{" "}
                    <ul className="comma-separated-list">{uniprotLinks}</ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export { MetadataSection, formatMetadata };
