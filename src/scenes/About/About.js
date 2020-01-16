// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import '~/scenes/Results/General.css';
import './About.css';

import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
import Typography from '@material-ui/core/Typography';

import lian from './images/lian.thumb.png';
import roth from './images/roth.thumb.png';
import karr from './images/karr.thumb.png';

import nih from './images/nih.svg';
import nibib from './images/nibib.svg';
import nigms from './images/nigms.svg';
import nsf from './images/nsf.svg';

import { SocialIcon } from 'react-social-icons';

import Grid from '@material-ui/core/Grid';

@connect(store => {
  return {};
}) //the names given here will be the names of props
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.getNewSearch = this.getNewSearch.bind(this);
  }

  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  render() {
    if (this.state.newSearch == true) {
      return <Redirect to={this.state.new_url} push />;
    }

    return (
      <div>
        <Header
          handleClick={this.getNewSearch}
        />

        <div className="content-container columns about">
          <div className="content-block table-of-contents">
            <h2 className="content-block-heading">Contents</h2>
            <ol className="content-block-content">
              <li>
                <Link>
                  <a href="#features">Features</a>
                </Link>
              </li>
              <li>
                <Link>
                  <a href="#data">Data Types</a>
                </Link>
              </li>
              <li>
                <Link>
                  <a href="#searching">Searching</a>
                </Link>
              </li>
              <li>
                <Link>
                  <a href="#team">Team</a>
                </Link>
              </li>
              <li>
                <Link>
                  <a href="#acknowledgements">Acknowledgements</a>
                </Link>
              </li>
              <li>
                <Link>
                  <a href="#source">Source Code</a>
                </Link>
              </li>
            </ol>
          </div>

          <div className="content-column">
            <div className="content-block section">
              <a id="features"></a>
              <h2 className="content-block-heading">
                1. Motivation and Features
              </h2>
              <div className="content-block-content">
                <p>Systems biology aims to understand how genotype influences phenotype. Mechanistic models, such as <a href="https://www.wholecell.org" target="_blank">whole-cell models</a>, are a promising tool for understanding the molecular determinants of behavior. However, it is difficult to obtain the large and varied data needed for mechanistic modeling. Although substantial data is already publicly available, the data is difficult to obtain because it is scattered across numerous databases and publications and described with different identifiers, units, and formats. In addition, there are few tools for finding data that is relevant to modeling a specific cell in a specific environment. These barriers impede mechanistic modeling.</p>
                <p>To accelerate cell modeling, we developed <i>Datanator</i>, a toolkit for systematically discovering data for modeling a specific cell in a specific environment. <i>Datanator</i> includes an integrated database of genomic and biochemical data about several aspects of cells, this web application for searching the database for data relevant to specific cells, and a REST API and Python library for programmatically aggregating data for large models. The web application enables investigators to search for experimental measurements of biochemical parameters (e.g. metabolite concentration, reaction rate, etc.) relevant to a specific cell (taxon, cell type) in a specific environment (e.g., temperature, pH, growth media, etc.). For each search, this web application displays a filterable and sortable list of relevant experimental measurements aggregated from a range of sources.</p>
              </div>
            </div>

            <div className="content-block section">
              <a id="data"></a>
              <h2 className="content-block-heading">
                2. Data Types and Sources
              </h2>
              <div className="content-block-content">
                <p>Currently, <i>Datanator</i> includes measured metabolite concentrations, protein abundances, and reaction rate parameters integrated from <a href={"http://ecmdb.ca/"}>ECMDB</a>, <a href={"https://pax-db.org/"}>PAX-DB</a>, <a href={"https://sabiork.h-its.org/"}>SABIO-RK</a>, and <a href={"http://www.ymdb.ca/"}>YMDB</a>. We aim to continually incorporate additional data from additional sources.</p>
              </div>
            </div>

            <div className="content-block section">
              <a id="searching"></a>
              <h2 className="content-block-heading">
                3. Searching and Filtering for Data About Specific Cells
              </h2>
              <div className="content-block-content">
                <p className="no-bottom-margin">To help investigators find data about specific cells in specific environments, <i>Datanator</i> provides multiple tools for searching and filtering the integrated database.</p>
                <ul>
                  <li>Full text search: Users can use the search form on the home page to identify metabolites, proteins, and reactions that they would like information.</li>
                  <li>Molecular similarity: Users can identify measurements of similar metabolites according to the <a href={"http://openbabel.org/docs/dev/Features/Fingerprints.html"}>tanitomo distance</a> of their structures. Users can identify measurements of similar proteins according to their <a href={"https://www.genome.jp/kegg/ko.html"}>orthology and sequence similarity</a>. Users can identify measurements of similar reactions according to their <a href={"https://en.wikipedia.org/wiki/Enzyme_Commission_number"}>Enzyme Classification</a>.</li>
                  <li>Phylogenetic similarity: Users can identify measurements observed in closely related taxa to their taxon of interest by filtering measurements according to their distance along the <a href={"https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi"}>NCBI Taxonomy tree</a>.</li>
                  <li>Environmental similarity: Users can filter for measurements from similar temperatures, pHs, and media conditions.</li>
                </ul>
              </div>
            </div>

            <div className="content-block section">
              <a id="team"></a>
              <h2 className="content-block-heading">
                4. Development Team
              </h2>
              <div className="content-block-content">
                <p><i>Datanator</i> was developed by the <a href={"https://www.karrlab.org/"}> Karr Lab</a> at the Icahn School of Medicine at Mount Sinai in New York, US.</p>
                <div className="developer-photos">
                  <div className="photo">
                    <img src={lian}/>
                    <p>Zhouyang Lian
                      <SocialIcon url="https://www.linkedin.com/in/zlian/" style={{ height: 15, width: 15 }}/>
                    </p>
                  </div>
                  <div className="photo">
                    <img src={roth}/>
                    <p>Yosef Roth
                      <SocialIcon url="https://www.linkedin.com/in/yosef-roth-a80a378a" style={{ height: 15, width: 15 }}/>
                    </p>
                  </div>
                  <div className="photo">
                    <img src={karr}/>
                    <p>Jonathan Karr
                      <SocialIcon url="https://www.linkedin.com/in/jonrkarr/" style={{ height: 15, width: 15 }}/>
                    </p>
                  </div>
                </div>
                <p>Datanator was also developed with Bilal Shaikh and Saahith Pochiraju.</p>
              </div>
            </div>

            <div className="content-block section">
              <a id="acknowledgements"></a>
              <h2 className="content-block-heading">
                5. Acknowledgements
              </h2>

              <div className="content-block-content">
                <p><i>Datanator</i> was developed with support from the <a href={"https://reproduciblebiomodels.org/"}>Center for Reproducible Biomodeling</a> from the National Institute of Bioimaging and Bioengineering and the National Institute of General Medical Sciences of the National Institutes of Health and the National Science Foundation (award P41EB023912). </p>
                <div className="funding-icons">
                  <img src={nih}/>
                  <img src={nibib}/>
                  <img src={nigms}/>
                  <img src={nsf}/>
                </div>
              </div>
            </div>

            <div className="content-block section">
              <a id="source"></a>
              <h2 className="content-block-heading">
                6. Source Code
              </h2>

              <div className="content-block-content">
                <p className="no-bottom-margin">
                  <i>Datanator</i> is available open-source from GitHub and is released under the <a href={"https://github.com/KarrLab/datanator/blob/master/LICENSE"}>MIT license</a>.
                </p>
                <ul>
                  <li>
                    <a href={"https://github.com/KarrLab/datanator"}>Datanator</a>
                  </li>
                  <li>
                    <a href={"https://github.com/KarrLab/datanator_frontend"}>Datanator Webpage</a>
                  </li>
                  <li>
                    <a href={"https://github.com/KarrLab/datanator_rest_api"}>Datanator Rest API</a>
                  </li>
                  <li>
                    <a href={"https://github.com/KarrLab/datanator_query_python"}>Datanator Python Interface</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(About);
