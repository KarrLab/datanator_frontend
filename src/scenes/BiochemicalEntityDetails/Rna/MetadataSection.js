import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static getMetadataUrl(query) {
    return (
      "/rna/halflife/get_info_by_protein_name/" +
      "?protein_name=" +
      query +
      "&_from=0" +
      "&size=1000"
    );
  }

  static processMetadata(rawData) {
    const processedData = {};

    processedData.geneName = rawData[0].gene_name;

    if (rawData[0].function) {
      processedData.proteinName = rawData[0].function;
    } else if (rawData[0].protein_name) {
      processedData.proteinName = rawData[0].protein_name;
    } else {
      processedData.proteinName = "Protein name not found";
    }

    return processedData;
  }

  static formatTitle(processedData) {
    let title = processedData.geneName;
    if (!title) {
      title = processedData.proteinName;
    }
    return upperCaseFirstLetter(title);
  }

  static formatMetadata(processedData) {
    const sections = [];

    if (processedData.geneName || processedData.proteinName) {
      sections.push({
        id: "description",
        title: "Description",
        content: (
          <ul className="key-value-list">
            {processedData.geneName && (
              <li>
                <b>Gene:</b> {processedData.geneName}
              </li>
            )}
            {processedData.proteinName && (
              <li>
                <b>Protein:</b> {processedData.proteinName}
              </li>
            )}
          </ul>
        )
      });
    }

    return sections;
  }

  render() {
    return (
      <BaseMetadataSection
        entity-type="RNA"
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
