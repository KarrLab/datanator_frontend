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

The *Datanator* toolkit seeks to address these problems for biochemical modeling by providing investigators an integrated database of molecular data and tools for discovering relevant data for modeling projects and other meta analyses. Please see the [About](https://datanator.info/about) page for more information about the goals and features of *Datanator*.

The *Datanator* toolkit is composed of the following packages:
- [*Datanator*](https://github.com/KarrLab/datanator): Tools for aggregating and integrating diverse data from diverse sources into a single dataset and searching these datasets
- *Datanator-db*: MongoDB server for *Datanator-data*
- *Datanator-fulltext-db*: ElasticSearch server for *Datanator-data*
- [*Datanator-query-python*](https://github.com/KarrLab/datanator_query_python): Tools for querying *Datanator-db* and *Datanator-fulltext-db*
- [*Datanator-rest-api*](https://github.com/KarrLab/datanator_rest_api): REST interface for *Datanator-query-python*
- *Datanator-frontend*: This package, a web-based graphical user interface to *Datanator-db*.

This package provides a web-based graphical user interface to *Datanator-db*. A public, hosted version of the package is freely available at [https://datanator.info](https://datanator.info). The package provides investigators tools for browsing and searching *Datanator-db* to find data about biochemical entities of interest (e.g., metabolites, proteins, reactions). This includes tools for finding experimental observations from chemically and genetically similar entities (according to structural and sequence similarity) in phylogenetically similar organism (according to the NCBI Taxonomy tree) under similar enviromental conditions (e.g., temperature, pH). The package is implemented using [React](https://reactjs.org/).

## Development, testing, installation, and usage

### Users

#### Use the public, hosted deployment
We recommend that users use the public, hosted version of *Datanator-frontend* at [https://datanator.info](https://datanator.info).

#### Tutorial and FAQs
Please see the [Help](https://datanator.info/help) page for a tutorial and FAQs.

### Developers

#### Install and deploy *Datanator-frontend* locally
We recommend that developers install and run *Datanator-frontend* locally. Below are instructions for installing and running *Datanator-frontend* locally.

1. Install `git`
  ```
  apt-get install git
  ```

2. Install `npm`
  ```
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
  ~/.nvm/nvm.sh install v8.17.0
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

#### Test *Datanator-frontend*
1. Run the unit tests
  ```
  npm run test-unit-coverage
  ```

2. Run the integration tests
  ```
  npm run test-integration-run
  ```
  
#### Lint and pretty print *Datanator-frontend*
1. Lint CSS
  ```
  npm run lint-style
  ```

2. Lint JavaScript
  ```
  npm run lint-js
  ```

3. Lint JSON
  ```
  npm run lint-json
  ```

4. Lint SVG
  ```    
  npm run lint-svg
  ```
  
#### Build *Datanator-frontend* for deployment
  ```
  NODE_ENV=production npm run build
  ```
  
## Implementation
*Datanator-frontend* is implemented as a Single Page Application (SPA) using the following packages:
- [React](https://reactjs.org/): framework for the application
- [Axios](https://github.com/axios/axios): HTTP requests
- [history](https://github.com/ReactTraining/history): browser history
- [Blueprint](https://blueprintjs.com/): UI components
- [Material-UI](https://material-ui.com/): UI components
- [AG-grid](https://www.ag-grid.com/): data tables
- [Chart.js](https://www.chartjs.org/): charts
- [bruit.io](https://bruit.io/): feedback form
- [FontAwesome](https://fontawesome.com/): icons

The following tools were used to test *Datanator-frontend*:
- [cypress](https://www.cypress.io/): integration testing
- [depcheck](https://github.com/depcheck/depcheck): dependency checking
- [Enzyme](https://airbnb.io/enzyme): testing utilities
- [ESLint](https://eslint.org/): JavaScript linting
- [Jest](https://jestjs.io/): unit testing
- [jsonlint](https://github.com/zaach/jsonlint): JSON linting
- [stylelint](https://stylelint.io/): CSS/SCSS linting
- [svglint](https://www.npmjs.com/package/svglint): SVG linting

### File organization
This repository is organized as follows:

- `config`/: React configuration
- `integration-tests/`:  
  - `fixtures/`: fixtures for the integration tests
  - `plugins/`: cypress configuration
  - `support/`: cypress configuration
  - `tests/`: integration tests implemented using cypress and organized parallel to the source code
- `public/`: static files such as the favicon and sitemap
- `scripts/`: scripts for managing the application such as starting and stopping a test server
- `src/`
  - `components/` - common components used by multiple pages
    - `ErrorDialog/` - dialog for displaying errors
    - `FeedbackForm/` - form to collected feedback from users
    - `Footer/` - footer on the bottom of each webpage
    - `Header/` - header on the top of each webpage
    - `SearchForm/` - search form on homepage and in the header
  - `scenes/` - code to render the individual webpages
    - `Home/` - the home page
    - `SearchResults/` - page which display the results of a search
    - `BiochemicalEntityDetails/` - the pages which display metadata and experimental observations about a biochemical entity
    - `About/` - page with general information about *Datanator* such as the motivation for the application and the team which implemented it
    - `Help/` - page with a tutorial and FAQs
    - `Stats/` - page which summarizes the contents of *Datanator*'s database
    - `Error404/` - page which is displayed when a user requests and undefined route
  - `services/`
  - `__tests__/` - unit tests implemented using Jest
  - `utils/` - miscellaneous helper functions (e.g. removing duplicates, formatting numbers in scientific notation, etc.)
  - `colors.scss`: common colors for the application
  - `index.js`: entrypoint for the application which handles all routes
  - `index.scss`: commmon styles for the application
  - `index.mobile.scss`: styles for mobile devices
  - `react-app-env.d.ts`: React configuration
  - `setupTests.js`: Jest configuration
- `.env`: default environment variables
- `CODE_OF_CONDUCT`: code of conduct
- `cypress.json`: cypress configuration
- `LICENSE`: license
- `LICENSE-THIRD-PARTY`: summary of the licenses of the dependencies
- `package.json`: package configuration
- `README`: overview of the application

### Organization of the CSS styles
- The common styles used by multiple components and scenes are contained in `src/index.scss`.
- The styles for individual components and scenes are defined in separated files within the directories in which the components and scenes are defined (e.g., `src/scenes/Home/Home.scss`). The styles for the individual components and scenes are isolated from each other through the use of unique CSS classes for each component/scene.

### Naming conventions
*Datanator-frontend* uses the following naming conventions:
- Directory, file, and class names: `UpperCamelCase`
- Variable and method namse: `lowerCamelCase`
- CSS class names: `lower-hyphen-case`
  
## Development and deployment workflow
1. Create a Git new branch
2. Commit code to the new branch
3. Push the branch to GitHub
4. GitHub will automatically trigger [CircleCI](https://circleci.com/gh/KarrLab/datanator_frontend) to run the unit test, integration tests, and other static analyses
5. Use [Coveralls](https://coveralls.io/github/KarrLab/datanator_frontend) to review the coverage of the tests
6. As needed, add additional tests and fix any failing tests
7. Once the new code passes the tests and has high coverage, create a [pull request](https://github.com/KarrLab/datanator_frontend/compare) to merge the new branch into the master branch
7. One of the main developers will review the pull request and request changes as necessary
9. Once any necessary changes have been made, one of the main developers will approve the pull request
10. GitHub will automatically trigger [CircleCI](https://circleci.com/gh/KarrLab/datanator_frontend) to run the unit test, integration tests, and other static analyses for the master branch
11. Once the CircleCI build succeeds, https://datanator.info will automatically be updated to the latest revision of the master branch

## Contributing to *Datanator*
We welcome contributions to *Datanator* via Git pull requests. Please contact the developers to coordinate potential contributions, and please see above for information about how to submit pull requests.

## License
This package is released under the [MIT license](LICENSE). The licenses of the third party dependencies are summarized in [LICENSE-THIRD-PARTY](LICENSE-THIRD-PARTY).

## Citing Datanator
Roth YD, Lian Z, Pochiraju S, Shaikh B & Karr JR. Datanator: an integrated database of molecular data for quantitatively modeling cellular behavior. bioRxiv, 2020.08.06.240051 (2020). DOI: [10.1101/2020.08.06.240051](https://doi.org/10.1101/2020.08.06.240051).

## Development team
This package was developed by the [Karr Lab](https://www.karrlab.org) at the Icahn School of Medicine at Mount Sinai in New York by the following individuals:

* [Yosef Roth](https://www.linkedin.com/in/yosef-roth-a80a378a)
* [Yang Lian](https://www.linkedin.com/in/zlian/)
* [Jonathan Karr](https://www.karrlab.org)
* [Saahith Pochiraju](https://www.linkedin.com/in/saahithpochiraju/)
* [Bilal Shaikh](https://www.linkedin.com/in/bilalshaikh42/)
* Balazs Szigeti

## Questions and comments
Please submit an [issue](https://github.com/KarrLab/datanator_frontend/issues/new), or contact the [Karr Lab](info@karrlab.org) with any questions or comments.

## Acknowledgements
Datanator was developed with support from the [Center for Reproducible Biomedical Modeling](https://reproduciblebiomodels.org) from the National Institute of Bioimaging and Bioengineering and the National Institute of General Medical Sciences of the National Institutes of Health and the National Science Foundation (awards P41EB023912 and R35GM119771).

![Image nih](/src/scenes/About/images/nih.svg) ![Image nibib](/src/scenes/About/images/nibib.svg) ![Image nigms](/src/scenes/About/images/nigms.svg) ![Image nsf](/src/scenes/About/images/nsf.svg)

