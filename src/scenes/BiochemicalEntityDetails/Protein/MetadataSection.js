import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, removeDuplicates } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";

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

  processMetadata(rawData) {
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
      uniprotIds: uniprotIds,
      other: { uniprotIdToTaxonDist: uniprotIdToTaxonDist }
    };
  }

  formatTitle(processedData) {
    return upperCaseFirstLetter(processedData.koName);
  }

  formatMetadata(processedData) {
    const sections = [];

    // description
    const descriptions = [];

    descriptions.push({
      key: "Name",
      value: processedData.koName
    });

    descriptions.push({
      key: "KEGG Orthology id",
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

    if (processedData.uniprotIds) {
      const uniprotLinks = [];
      for (const uniprotId of processedData.uniprotIds) {
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
      descriptions.push({
        key: "Proteins",
        value: <ul className="comma-separated-list">{uniprotLinks}</ul>
      });
    }

    sections.push({
      id: "description",
      title: "Description",
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

    // return sections
    return sections;
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="ortholog group"
        get-metadata-url={this.getMetadataUrl}
        process-metadata={this.processMetadata}
        format-title={this.formatTitle}
        format-metadata={this.formatMetadata}
        set-scene-metadata={this.props["set-scene-metadata"]}
      />
    );
  }
}
export { MetadataSection };
