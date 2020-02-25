import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";

function formatMetadata(rawData) {
  const formattedData = {};

  formattedData.geneName = rawData[0].gene_name;

  if (rawData[0].function) {
    formattedData.proteinName = rawData[0].function;
  } else if (rawData[0].protein_name) {
    formattedData.proteinName = rawData[0].protein_name;
  } else {
    formattedData.proteinName = "Protein Name not Found";
  }

  return formattedData;
}

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  getMetadataUrl(query) {
    return (
      "/rna/halflife/get_info_by_protein_name/" +
      "?protein_name=" +
      query +
      "&_from=0" +
      "&size=1000"
    );
  }

  formatMetadataInner(rawData, organism) {
    const formattedData = formatMetadata(rawData);

    this.setState({ metadata: formattedData });

    let title = formattedData.geneName;
    if (!title) {
      title = formattedData.proteinName;
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
      organism: organism,
      metadataSections: sections
    });
  }

  render() {
    const metadata = this.state.metadata;

    return (
      <div>
        <BaseMetadataSection
          entity-type="RNA"
          get-metadata-url={this.getMetadataUrl}
          format-metadata={this.formatMetadataInner.bind(this)}
          set-scene-metadata={this.props["set-scene-metadata"]}
        />

        {metadata && (
          <div>
            <div className="content-block" id="description">
              <h2 className="content-block-heading">Description</h2>
              <div className="content-block-content">
                {(metadata.geneName || metadata.proteinName) && (
                  <ul className="key-value-list">
                    {metadata.geneName && (
                      <li>
                        <b>Gene:</b> {metadata.geneName}
                      </li>
                    )}
                    {metadata.proteinName && (
                      <li>
                        <b>Protein:</b> {metadata.proteinName}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { MetadataSection, formatMetadata };
