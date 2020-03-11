import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter, removeDuplicates } from "~/utils/utils";
import BaseMetadataSection from "../MetadataSection";
//import axios from "axios";
//import { getDataFromExternalApi, genApiErrorHandler } from "~/services/RestApi";

class MetadataSection extends Component {
  static propTypes = {
    "set-scene-metadata": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { metadata: null };
  }

  static getMetadataUrl(query, organism) {
    return (
      "kegg/get_meta/?kegg_ids=" + query
    );
  }

  static processMetadata(rawData) {
    let processedData = {};
    let koNumber;
    let koName;
    const uniprotIdToTaxonDist = {};

    /*
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
    */

    const uniprotIds = removeDuplicates(Object.keys(uniprotIdToTaxonDist));
    uniprotIds.sort();

    processedData.koName = rawData[0].definition.name[0]
    processedData.koNumber = "Kegg ID"
    processedData.other = { uniprotIdToTaxonDist: uniprotIdToTaxonDist }
    processedData.description = null;
    processedData.ec_code = rawData[0].definition.ec_code[0]
    processedData.pathways = rawData[0].kegg_pathway

    const url = "https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&gene=pfkA"
    let description = ""
    //let description_woo = getDataFromExternalApi([url], { headers: { 'Content-Type': 'application/json' }})
    //  .then(response => {
    //    processedData.description = response.data
    //    console.log(response.data)
    //  })

    //let the_data = axios.get(url, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    //    return(response.data)})
    //console.log(processedData.description )


    //console.log(axios.get("https://www.ebi.ac.uk/proteins/api/proteins?offset=0&size=1&gene=pfkA", { headers: { 'Content-Type': 'application/json' }}))


    return processedData
      //processedData: processedData,
      //koNumber: processedData.koNumber,
      //koName: processedData.koName,
      //uniprotIds: uniprotIds,
      //other: { uniprotIdToTaxonDist: uniprotIdToTaxonDist }

  }

  static formatTitle(processedData) {
    return upperCaseFirstLetter(processedData.koName);
  }

  static formatMetadata(processedData) {
    const sections = [];

    // description
    const descriptions = [];
    //console.log(processedData.processedData.description)

    descriptions.push({
      key: "Name",
      value: processedData.koName
    });

    descriptions.push({
      key: "KEGG Orthology ID",
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
      key: "EC Code",
      value: processedData.ec_code
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
          <div className="icon-description">
          {/*
            {structure && (
              <div className="entity-scene-icon-container">
                <LazyLoad>
                  <img
                    src={sprintf(
                      STRUCTURE_IMG_URL,
                      structure.type,
                      structure.value
                    )}
                    className="entity-scene-icon hover-zoom"
                    alt="Chemical structure"
                    aria-label="Chemical structure"
                    crossOrigin=""
                  />
                </LazyLoad>
              </div>
            )}
          */}

            <div>{
              "Description from Uniprot"}</div>
          </div>
        )
      });

    sections.push({
      id: "description2",
      title: "Names",
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

    // return sections
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
