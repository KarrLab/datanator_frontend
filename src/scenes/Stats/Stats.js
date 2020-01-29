import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";

// import "./Stats.scss";

class Stats extends Component {
  render() {
    let scrollTo = el => {
      window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
    };

    return (
      <div className="content-container content-container-stats-scene">
        <h1 className="page-title">Statistics</h1>
        <div className="content-container-columns">
          <div className="overview-column">
            <div className="content-block table-of-contents">
              <h2 className="content-block-heading">Contents</h2>
              <div className="content-block-content">
                <ul>
                  <li>
                    <HashLink to="#section-1" scroll={scrollTo}>
                      Section 1
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#section-2" scroll={scrollTo}>
                      Section 2
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="#section-3" scroll={scrollTo}>
                      Section 3
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="content-column">
            <div className="content-block section" id="section-1">
              <h2 className="content-block-heading">Section 1</h2>
              <div className="content-block-content">Coming soon</div>
            </div>

            <div className="content-block section" id="section-2">
              <h2 className="content-block-heading">Section 2</h2>
              <div className="content-block-content">Coming soon</div>
            </div>

            <div className="content-block section" id="section-3">
              <h2 className="content-block-heading">Section 3</h2>
              <div className="content-block-content">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
