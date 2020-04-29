import React, { Component } from "react";
import PropTypes from "prop-types";
import { upperCaseFirstLetter } from "~/utils/utils";

export default class Pathways extends Component {
  static propTypes = {
    pathways: PropTypes.array.isRequired,
    "page-size": PropTypes.number.isRequired,
    "kegg-id-name": PropTypes.string.isRequired,
    "kegg-description-name": PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      pageCount: 1
    };
  }

  onClick() {
    this.setState({ pageCount: this.state.pageCount + 1 });
  }

  render() {
    const pathways = this.props.pathways;
    const displayedPathways = pathways.slice(
      0,
      this.state.pageCount * this.props["page-size"]
    );
    const numResults = pathways.length;
    const pageSize = this.props["page-size"];
    const numMore = Math.min(
      pageSize,
      numResults - pageSize * this.state.pageCount
    );

    return (
      <div className="content-container-search-results-scene content-block section">
        <div>
          <ul className="two-col-list link-list">
            {displayedPathways.map(el => {
              if (el[this.props["kegg-id-name"]]) {
                const map_id = el[this.props["kegg-id-name"]].substring(
                  2,
                  el[this.props["kegg-id-name"]].length
                );
                return (
                  <li key={el[this.props["kegg-description-name"]]}>
                    <a
                      href={
                        "https://www.genome.jp/dbget-bin/www_bget?map" + map_id
                      }
                      className="bulleted-list-item"
                      target="_blank"
                      rel="noopener noreferrer"
                      dangerouslySetInnerHTML={{
                        __html: upperCaseFirstLetter(
                          el[this.props["kegg-description-name"]]
                        )
                      }}
                    ></a>
                  </li>
                );
              } else {
                return (
                  <li key={el.name}>
                    <div
                      className="bulleted-list-item"
                      dangerouslySetInnerHTML={{
                        __html: upperCaseFirstLetter(
                          el[this.props["kegg-description-name"]]
                        )
                      }}
                    ></div>
                  </li>
                );
              }
            })}
          </ul>

          {pathways && numMore > 0 && (
            <button
              className="more-search-results-button"
              type="button"
              onClick={() => {
                this.onClick();
              }}
            >
              Load {pageSize} more of {pathways.length}
            </button>
          )}
        </div>
      </div>
    );
  }
}
