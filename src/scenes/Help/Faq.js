import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { scrollTo } from "~/utils/utils";

import "./Help.scss";

class Faq extends Component {
  render() {
    return (
      <div className="content-block section" id="faq">
        <h2 className="content-block-heading">Frequently asked questions</h2>
        <div className="content-block-content">
          <div className="faq">
            <div className="faq-q">
              How can I contribute data to <i>Datanator</i>?
            </div>
            <div className="faq-a">
              Please{" "}
              <HashLink to="#contact" scroll={scrollTo}>
                contact us
              </HashLink>{" "}
              to discuss how to integrate your data into <i>Datanator</i>. We
              are particularly interested in molecular data about metabolites,
              DNA, RNA, proteins, complexes, and reactions such as RNA
              abundance, protein half-lives, and RNA and protein modification
              and localization.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can I contribute to the development of <i>Datanator</i>?
            </div>
            <div className="faq-a">
              We would love to work together to aggregate for biomodeling.
              Please{" "}
              <HashLink to="#contact" scroll={scrollTo}>
                contact us
              </HashLink>{" "}
              to discuss how to get involved.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can I cite <i>Datanator</i>?
            </div>
            <div className="faq-a">
              We aim to submit an article for publication and to a pre-printer
              server in 2020. Please check back later this year for more
              information.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Why are mRNAs and proteins grouped by{" "}
              <a
                href={"https://www.genome.jp/kegg/ko.html"}
                target="_blank"
                rel="noopener noreferrer"
              >
                KEGG ortholog groups
              </a>{" "}
              rather than by gene names or UniProt ids?
            </div>
            <div className="faq-a">
              To help researchers find relevant data in the face of sparse
              measurements, one of the goals of <i>Datanator</i> is to help
              users find potentially relevant measurements of similar molecular
              biology (e.g., similar metabolites, RNA, proteins, reactions) in
              similar organisms (e.g., neighboring taxa) and environmental
              conditions (e.g., similar temperature, pH). For mRNA and proteins,
              this is achieved by displaying measurements of the mRNA/protein of
              interest, as well as measurements of orthologous mRNAs/proteins.{" "}
              <i>Datanator</i> uses KEGG&apos;s ortholog groups because they
              have wide taxonomic coverage and are available in a
              machine-readable format.
              <i>Datanator</i> uses orthology rather than gene names to identify
              similar mRNAs/proteins because gene names are not consistent
              across organisms (similar genes can have different names, and
              genes with similar names can have dissimilar sequences).
              Similarly, <i>Datanator</i> uses orthology rather than UniProt ids
              because each UniProt id only refers to a single gene in a single
              organism.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Why does the metabolite concentration data table display data for
              biomolecules that were not queried (e.g. ADP is displayed in the
              page for ATP)?
            </div>
            <div className="faq-a">
              To help researchers find relevant data in the face of sparse
              measurements, <i>Datanator</i> displays measurements of the
              queried metabolite, as well as measurements of structurally
              similar metabolites. <i>Datanator</i> uses the{" "}
              <a
                href={
                  "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Tanimoto coefficient
              </a>{" "}
              to evaluate the structural similarity of metabolites. By default,{" "}
              <i>Datanator</i> displays measurements of metabolites that have
              Tanimoto coefficients of 0.65 or higher. The &quot;Chemical
              similarity&quot; filter can be used to narrow the displayed
              measurements to measurements of highly similar metabolites
              (Tanimoto coefficient near 1).
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can <i>Datanator</i> help me find data from similar cell
              types?
            </div>
            <div className="faq-a">
              All the data contain information about the experimental organism,
              which allows the user to filter by phylogenetic similarity to any
              target organism. Protein abundance data allows the user to filter
              by tissue type. Rate constants data allows the user to filter by
              whether the genome is wildtype or mutant.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can <i>Datanator</i> help me find data from similar
              experimental conditions?
            </div>
            <div className="faq-a">
              Metabolite concentration data allows the user to filter by growth
              media, growth phase, and growth conditions. Reaction rate
              constants data allows users to filter by pH and temperature.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              What kinds of models or other analyses does <i>Datanator</i>
              facilitate?
            </div>
            <div className="faq-a">
              <ul>
                <li>
                  <i>Datanator</i> can help investigators find genomic and
                  biochemical data to identify the initial conditions and rate
                  parameters of continuous and stochastic dynamical models. In
                  turn, this can help investigators construct more comprehensive
                  and more accurate models.
                </li>
                <li>
                  <i>Datanator</i> can help investigators improve
                  constraint-based models of metabolism by helping investigators
                  find enzyme abundances and reaction velocities to constrain
                  the predicted fluxes of chemical transformation and transport
                  reactions.
                </li>
                <li>
                  <i>Datanator</i> can help investigators modify models to
                  capture other organisms, tissues, and cell types by helping
                  investigators find data to re-calibrate model parameters. In
                  turn, this can help investigators compare organisms, tissues,
                  and cell types.
                </li>
                <li>
                  <i>Datanator</i> can also help investigators conduct
                  data-driven meta-analyses of molecular biology. For example,
                  the <i>Datanator</i> database can be used to conduct
                  multi-dimensional analyses of an individual organism or
                  conduct comparative analyses of multiple organisms.
                </li>
              </ul>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can I use <i>Datanator</i> to help build models?
            </div>
            <div className="faq-a">
              <i>Datanator</i> can be used to:
              <ol>
                <li>
                  Search for a biochemical entity (metabolite, RNA, protein, or
                  reaction)
                </li>
                <li>
                  Filter for potentially relevant measurements of similar
                  entities in similar cells and similar environments
                </li>
                <li>
                  Review the potentially relevant measurements to determine the
                  relevant measurements
                </li>
                <li>Analyze the distribution of relevant measurements</li>
                <li>
                  Export molecular data for model construction and validation
                </li>
              </ol>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Can I programmatically access the data in <i>Datanator</i>?
            </div>
            <div className="faq-a">
              Yes, our REST{" "}
              <a
                href={"https://api.datanator.info/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                API
              </a>{" "}
              can be used to programmatically access <i>Datanator</i>. Please
              see the{" "}
              <a
                href={"https://api.datanator.info/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                documentation
              </a>{" "}
              for more information.
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Can I download <i>Datanator&apos;s</i> data?
            </div>
            <div className="faq-a">
              Yes, <i>Datanator&apos;s</i> data is available from the{" "}
              <a
                href={
                  "https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator/"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                datanator
              </a>{" "}
              Quilt data package. The data is released under the Creative
              Commons Attribution-NonCommercial-NoDerivatives 4.0 (CC BY-NC-ND
              4.0){" "}
              <a
                href={
                  "https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator/tree/latest/LICENSE"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                license
              </a>
              . Please see the README for the package for more information. In
              addition, users can use the
              <a
                href={"https://github.com/KarrLab/datanator"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i>Datanator</i> software
              </a>{" "}
              to construct their own version of
              <i>Datanator&apos;s</i> dataset. This will download the data from
              the primary sources and parse, normalize, and integrate the data
              into a single database.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Faq;
