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
                <p> Systems biology aims to understand how genotype influences phenotype. Comprehensive mechanistic models, such as whole-cell models, can be used to explore cell dynamics. However, the data required to construct these models are contained across many different databases &mdash; often with inconsistent identifiers and formats. In addition, the time required to manually collect this data impedes the creation of large-scale models.</p> 
              </div>
              <div className="about_paragraph">
                <p>To accelerate <a href = "https://www.wholecell.org/">whole-cell modeling</a>, we developed <i>Datanator</i>, an integrated database and search engine. <i>Datanator</i> allows a modeler to input a desired biological parameter (e.g. molecular concentration, reaction rate, etc.) with desired search criteria (e.g. organism, environmental conditions, etc.), and <i>Datanator</i> returns a list of the most relevant observations.</p> 
              </div>
              <div className="about_paragraph">
                <p> <i>Datanator</i> integrates, proteomic data (Pax-DB), kinetic data (SABIO-RK), and metabolite
concentration data (ECMDB, YMDB). <i>Datanator</i> search engine can identify the most relevant
data from a combination of search criteria: genetic similarity (KEGG orthology), taxonomic
similarity (NCBI taxonomy), molecular similarity (tanitomo string comparison), reaction similarity
(EC number), and environmental similarity.
 </p> 
              </div>
            </div>

            <div>
             <div className="anchor">
              <a id="team"></a>
              </div>

              <Typography variant="h6" className={'green'}>
                2. Development Team
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
                3. Acknowledgements
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
                4. Source Code
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
