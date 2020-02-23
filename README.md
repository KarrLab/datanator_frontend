[![Test results](https://circleci.com/gh/KarrLab/datanator_frontend.svg?style=shield)](https://circleci.com/gh/KarrLab/datanator_frontend)
[![Test coverage](https://coveralls.io/repos/github/KarrLab/datanator_frontend/badge.svg)](https://coveralls.io/github/KarrLab/datanator_frontend)
[![Code analysis](https://api.codeclimate.com/v1/badges/11857e8791e9e9000039/maintainability)](https://codeclimate.com/github/KarrLab/datanator_frontend)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKarrLab%2Fdatanator_frontend.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKarrLab%2Fdatanator_frontend?ref=badge_shield)
![Analytics](https://ga-beacon.appspot.com/UA-86759801-1/datanator_frontend/README.md?pixel)

# Datanator-frontend
Web-based graphical user interface of [Datanator](https://datanator.info), a toolkit for discovering the data needed for modeling the biochemistry of cells.

## Contents
* [Overview](#overview)
* [Usage and installation](#usage-and-installation)
* [License](#license)
* [Development team](#development-team)
* [Questions and comments](#questions-and-comments)

## Overview
A central goal of synthetic biology is to rationally design organisms. Similarly, a central goal of precision medicine is to tailor therapy to each patient based on their unique genome. Many engineering fields use computer-aided design (CAD) tools driven by mechanistic models to efficiently design complex systems such as planes. Analogously, more comprehensive and more predictive models of biological systems, such as [whole-cell models](https://www.wholecell.org), are needed to help bioengineers and physicians design biomachines and medical therapy.

One of the biggest bottlenecks to achieving such models is collecting and aggregating the large amount of data needed for model construction and verification. Due to advances in genomics and increased emphasis on data sharing, there is now extensive data about a wide range of biochemical entities and processes such as data about metabolite concentrations, RNA and protein abundances, and reaction rates. However, it remains difficult to utilize this information for modeling because the data scattered across numerous databases and publications; the data is described using different formats, identifiers, and units; and there are inadequate tools for finding relevant data for modeling a specific biological system in a specific environment.

The *Datanator* toolkit seeks to address these problems for biochemical modeling by providing investigators an integrated database of molecular data and tools for discovering relevant data for modeling projects and other meta analyses. The *Datanator* toolkit is composed of the following packages:
- [*Datanator*](https://github.com/KarrLab/datanator): Tools for aggregating and integrating diverse data from diverse sources into a single dataset and searching these datasets
- [*Datanator-data*](https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator): An integrated dataset of data for modeling cellular biochemistry
- *Datanator-db*: MongoDB server for *Datanator-data*
- *Datanator-fulltext-db*: ElasticSearch server for *Datanator-data*
- [*Datanator-query-python*](https://github.com/KarrLab/datanator_query_python): Tools for querying *Datanator-db* and *Datanator-fulltext-db*
- [*Datanator-rest-api*](https://github.com/KarrLab/datanator_rest_api): REST interface for *Datanator-query-python*
- *Datanator-frontend*: This package, a web-based graphical user interface to *Datanator-db*.

This package provides a web-based graphical user interface to *Datanator-db*. A public, hosted version of the package is freely available at [https://datanator.info](https://datanator.info). The package provides investigators tools for browsing and searching *Datanator-db* to find data about biochemical entities of interest (e.g., metabolites, proteins, reactions). This includes tools for finding experimental observations from chemically and genetically similar entities (according to structural and sequence similarity) in phylogenetically similar organism (according to the NCBI Taxonomy tree) under similar enviromental conditions (e.g., temperature, pH). The package is implemented using [React](https://reactjs.org/).

## Packages and Tools
- [React](https://reactjs.org/docs/getting-started.html).
- [AG-grid](https://www.ag-grid.com/documentation-main/documentation.php) is used to generate the data tables.
- [FontAwesome](https://fontawesome.com/) is used for icons.
- [Axios](https://github.com/axios/axios) is used to make HTTP requests.
- [Jest](https://jestjs.io/) is used for unit tests.
- [Cypress](https://www.cypress.io/) is used for integration tests.

## Usage and installation

### Users: use the public, hosted deployment
We recommend that users use the public, hosted version of *Datanator-frontend* at [https://datanator.info](https://datanator.info).

### Developers: install and deploy *Datanator-frontend* locally
We recommend that developers install and run *Datanator-frontend* locally. Below are instructions for installing and running *Datanator-frontend* locally.

1. Install `git`
  ```
  apt-get install git
  ```

2. Install `npm`
  ```
  apt-get install npm
  ```

3. Clone this repository
  ```
  git clone https://github.com/karrlab/datanator_frontend
  ```

4. Install this package
  ```    
  cd /path/to/datanator_frontend
  npm install .
  ```

5. Launch a server. This will compile the application. As you make changes to the source code, the server will automatically incrementally compile the application and refresh your browser.
  ```
  npm start
  ```

6. Navigate your browser to [http://localhost:3000](http://localhost:3000/).

## License
This package is released under the [MIT license](LICENSE).

## Development team
This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York.

* Yosef Roth
* Yang Lian
* [Jonathan Karr](https://www.karrlab.org)

## Questions and comments
Please contact the [Karr Lab](info@karrlab.org) with any questions or comments.
