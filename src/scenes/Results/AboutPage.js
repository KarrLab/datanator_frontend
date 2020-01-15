// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import './General.css';


import { getSearchData } from '~/services/MongoApi';
import { formatReactionMetadata } from '~/scenes/Results/get_reaction_rows';
import { formatProteinMetadata } from '~/scenes/Results/get_protein_rows';
import { formatMetaboliteMetadata } from '~/scenes/Results/get_metabolite_rows';


import {Helmet} from "react-helmet";
import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
const queryString = require('query-string');









const url = "reaction/data/?substrates=AMP,ATP%20&products=%20ADP&substrates_inchi=ZKHQWZAMYRWXGA-KQYNXXCUSA-J,UDMBCSSLTHHNCD-KQYNXXCUSA-N&products_inchi=XTWYTFMLZFPYCI-KQYNXXCUSA-N"
//const results = [["ATP Synthetase1 ", "ATP + AMP ==> ADP", url], ["ATP Synthetase2 ", "ATP + AMP ==> ADP", url]]
const resultss = [{primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}, {primary_text: "ATP Synthetase1 ", secondary_text: "ATP + AMP ==> ADP", url:url}]

const results = [{primary_text: "some name",
products: [ "D-Glucose", "Phosphate" ],
reactionID: "796",
secondary_text: "D-Glucose 6-phosphate + H2O ==> Phosphate + D-Glucose",
substrates:  [ "H2O", "D-Glucose 6-phosphate" ],
url: "&substrates_inchi=XLYOFNOQVPJJNP-UHFFFAOYSA-N,NBSCHQHZLSJFNQ-GASJEMHNSA-N&products_inchi=WQZGKKKJIJFFOK-GASJEMHNSA-N,NBIIXXVUZAFLBC-UHFFFAOYSA-N"}]
@connect(store => {
  return {};
}) //the names given here will be the names of props
class AboutPage extends Component {
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

   


    return (


      <div>

      <Helmet>
          <meta charSet="utf-8" />
          <title>Datanator: Molecular data for integrative research</title>
          <meta name="description" content="Web application for simulating kinetic models of biological processes and visually analyzing their results" />
          <meta name="keywords" content="biomodel, biochemical, molecular, cell, simulate, visualize, reproducible, standards, CellML, SBML, SED-ML, Vega" />
          <meta name="language" content="EN"/>
          <meta name="copyright" content="Center for Reproducible Biomedical Modeling" />
          <meta name="author" content="Center for Reproducible Biomedical Modeling, info@reproduciblebiomodels.org" />
          <meta name="reply-to" content="info@reproduciblebiomodels.org" />
          <meta name="url" content="https://www.biosimulations.org"/>
          <meta name="identifier-URL" content="https://www.biosimulations.org"/>
      </Helmet>


      
      <Header 
        handleClick={this.getNewSearch}
      />


      <div className="general">
      <style>{'body { background-color: #f7fdff; }'}</style>
      <Grid md={3}>
      <div className="contents" style={{
            marginLeft: -20,
          }}>
        <h3>Contents</h3>
      <ol>
      <li><Link>
          <a href={'/about#purpose'}>{"Features"} </a>
      </Link></li>
      <li><Link>
          <a href={'/about#data'}>{"Data Types"} </a>
      </Link></li>
      <li><Link>
          <a href={'/about#team'}>{"Team"} </a>
      </Link></li>
      <li><Link>
          <a href={'/about#acknowledgements'}>{"Acknowledgements"} </a>
      </Link></li>
      <li><Link>
          <a href={'/about#source_and_license'}>{"Source Code and License"} </a>
      </Link></li>
      </ol>
      </div>
      </Grid>
      <div className="google results">
       <Grid md={6}>
            <div>
              <div className="anchor" >
              <a id="purpose"></a>
              </div><Typography variant="h6" className={'green'}>
                1. Motivation and Features
              </Typography>

              <div className="about_paragraph">
<p>Systems biology aims to understand how genotype influences phenotype. Mechanistic models, such as <a href="https://www.wholecell.org" target="_blank">whole-cell models</a>, are a promising tool for understanding the molecular determinants of behavior. However, it is difficult to obtain the large and varied data needed for mechanistic modeling. Although substantial data is already publicly available, the data is difficult to obtain because it is scattered across numerous databases and publications and described with different identifiers, units, and formats. In addition, there are few tools for finding data that is relevant to modeling a specific cell in a specific environment. These barriers impede mechanistic modeling.</p>
              </div>
              <div className="about_paragraph">
<p>To accelerate cell modeling, we developed <i>Datanator</i>, a toolkit for systematically discovering data for modeling a specific cell in a specific environment. <i>Datanator</i> includes an integrated database of genomic and biochemical data about several aspects of cells, this web application for searching the database for data relevant to specific cells, and a REST API and Python library for programmatically aggregating data for large models. The web application enables investigators to search for experimental measurements of biochemical parameters (e.g. metabolite concentration, reaction rate, etc.) relevant to a specific cell (taxon, cell type) in a specific environment (e.g., temperature, pH, growth media, etc.). For each search, this web application displays a filterable and sortable list of relevant experimental measurements aggregated from a range of sources.</p>
              </div>
            </div>


            <div>
              <div className="anchor" >
              <a id="data"></a>
              </div><Typography variant="h6" className={'green'}>
                2. Data Types and Sources
              </Typography>
              <div className="about_paragraph">
                  <p>Currently, <i>Datanator</i> includes measured metabolite concentrations, protein abundances, and reaction rate parameters integrated from <a href={"http://ecmdb.ca/"}>ECMDB</a>, <a href={"https://pax-db.org/"}>PAX-DB</a>, <a href={"https://sabiork.h-its.org/"}>SABIO-RK</a>, and <a href={"http://www.ymdb.ca/"}>YMDB</a>. We aim to continually incorporate additional data from additional sources.</p>
              </div>
            </div>




            <div>
             <div className="anchor">
              <a id="team"></a>
              </div>

              <Typography variant="h6" className={'green'}>
                3. Development Team
              </Typography>

              <div className="about_paragraph">
                <p> <i>Datanator</i> was developed by the <a href={"https://www.karrlab.org/"}> Karr Lab</a> at the Icahn School of Medicine at Mount Sinai in New York, US.</p>
              </div>
              <div className="about_paragraph">
                <ol>
                <li>
                  Jonathan Karr
                </li><li>
                  Zhouyang Lian
                </li><li>
                  Saahith Pochiraju
                </li><li>
                  Yosef Roth
                </li><li>
                  Bilal Shaikh
                </li>
                </ol>

              </div>
            </div>

            <div>
             <div className="anchor">
              <a id="acknowledgements"></a>
              </div>
              <Typography variant="h6" className={'green'}>
                4. Acknowledgements
              </Typography>

              <div className="about_paragraph">
               <p> <i>Datanator</i> was developed with support from the Center for Reproducible Biomodeling Modeling from the National Institute of Bioimaging and Bioengineering and the National Institute of General Medical Sciences of the National Institutes of Health and the National Science Foundation (award P41EB023912) </p>
              </div>


            </div>


            <div>
             <div className="anchor">
              <a id="source_and_license"></a>
              </div>
              <Typography variant="h6" className={'green'}>
                5. Source Code
              </Typography>

              <div className="about_paragraph">
               <p>
                 
                 <i>Datanator</i> is available open-source from <a href={"https://github.com/KarrLab/datanator"} >GitHub</a> and is released under the <a href={"https://github.com/KarrLab/datanator/blob/master/LICENSE"}>MIT license</a>.
               </p>
              </div>


            </div>



        </Grid>
        </div>




      </div>
      </div>
      )
     
  }
}

export default withRouter(AboutPage);
