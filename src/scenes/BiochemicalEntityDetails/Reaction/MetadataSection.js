import React, { Component } from "react";
import PropTypes from "prop-types";

const DB_LINKS = [
  { label: "Brenda", url: "https://www.brenda-enzymes.org/enzyme.php?ecno=" },
  { label: "ENZYME", url: "https://enzyme.expasy.org/EC/" },
  { label: "ExplorEnz", url: "https://www.enzyme-database.org/query.php?ec=" },
  {
    label: "IntEnz",
    url: "https://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec="
  },
  { label: "KEGG", url: "https://www.genome.jp/dbget-bin/www_bget?ec:" },
  {
    label: "MetaCyc",
    url: "http://biocyc.org/META/substring-search?type=REACTION&object="
  },
  { label: "SABIO-RK", url: "http://sabiork.h-its.org/newSearch?q=ecnumber:" }
];

class MetadataSection extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    const metadata = this.props.metadata;

    if (metadata == null) {
      return <div></div>;
    } else {
      const props = [];
      const dbLinks = [];
      if (metadata.name) {
        props.push({ label: "Name", value: metadata.name });
      }
      if (metadata.equation) {
        props.push({ label: "Equation", value: metadata.equation });
      }
      if (metadata.ecNumber) {
        props.push({
          label: "EC number",
          value: (
            <a
              href={"https://enzyme.expasy.org/EC/" + metadata.ecNumber}
              target="_blank"
              rel="noopener noreferrer"
            >
              {metadata.ecNumber}
            </a>
          )
        });

        for (const dbLink of DB_LINKS) {
          dbLinks.push(
            <li key={dbLink.label}>
              <a
                href={dbLink.url + metadata.ecnumber}
                target="_blank"
                rel="noopener noreferrer"
                className="bulleted-list-item"
              >
                {dbLink.label}
              </a>
            </li>
          );
        }
      }

      return (
        <div>
          <div className="content-block" id="properties">
            <h2 className="content-block-heading">Properties</h2>
            <div className="content-block-content">
              <ul className="key-value-list link-list">
                {props.map(el => (
                  <li key={el.label}>
                    <b>{el.label}:</b> {el.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {dbLinks.length > 0 && (
            <div className="content-block" id="properties">
              <h2 className="content-block-heading">Database Links</h2>
              <div className="content-block-content">
                <ul className="three-col-list link-list">{dbLinks}</ul>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

export { MetadataSection };
