import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
import { LoadExternalData } from "../LoadExternalData";
import LazyLoad from "react-lazyload";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static processUniprotApi(uniprot_data) {
    let response = "";
    if (uniprot_data.length > 0) {
      response = uniprot_data[0].comments[0].text[0].value;
    } else {
      response = "No description found";
    }
    return response;
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
    processedData.description_url =
      "https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&gene=" +
      rawData[0].gene_name[0];

    return processedData;
  }

  static formatTitle(processedData) {
    return upperCaseFirstLetter(processedData.koName);
  }

  static formatMetadata(processedData) {
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

    sections.push({
      id: "description",
      title: "Description",
      content: (
        <div>
          <LazyLoad>
            <LoadExternalData
              url={processedData.description_url}
              processor={MetadataSection.processUniprotApi}
            />
          </LazyLoad>
        </div>
      )
    });

    sections.push({
      id: "cross_references",
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

    if (processedData.pathways.length > 0) {
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
export { MetadataSection };
