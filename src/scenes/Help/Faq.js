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
              Why are mRNAs and proteins grouped by{" "}
              <a
                href={"https://www.genome.jp/kegg/ko.html"}
                target="_blank"
                rel="noopener noreferrer"
              >
                ortholog groups
              </a>{" "}
              rather than by gene names or UniProt ids?
            </div>
            <div className="faq-a">
              <p>
                To help researchers find relevant data in the face of sparse
                measurements, one of the goals of <i>Datanator</i> is to help
                users find potentially relevant measurements of similar
                molecular biology (e.g., similar metabolites, RNA, proteins,
                reactions) in similar organisms (e.g., neighboring taxa) and
                environmental conditions (e.g., similar temperature, pH). For
                mRNA and proteins, this is achieved by displaying measurements
                of the mRNA/protein of interest, as well as measurements of
                orthologous mRNAs/proteins.
              </p>
              <p>
                <i>Datanator</i> uses KEGG&apos;s ortholog groups because they
                have wide taxonomic coverage and are available in a
                machine-readable format.
              </p>
              <p>
                <i>Datanator</i> uses orthology rather than gene names to
                identify similar mRNAs/proteins because gene names are not
                consistent across organisms (similar genes can have different
                names, and genes with similar names can have dissimilar
                sequences). Similarly, <i>Datanator</i> uses orthology rather
                than UniProt ids because each UniProt id only refers to a single
                gene in a single organism.
              </p>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Why does the metabolite concentration data table display data for
              biomolecules that were not queried (e.g., ADP is displayed in the
              page for ATP)?
            </div>
            <div className="faq-a">
              <p>
                To help researchers find relevant data in the face of sparse
                measurements, <i>Datanator</i> displays measurements of the
                queried metabolite, as well as measurements of structurally
                similar metabolites.
              </p>
              <p>
                <i>Datanator</i> uses the{" "}
                <a
                  href={
                    "http://openbabel.org/docs/dev/Features/Fingerprints.html"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanimoto coefficient
                </a>{" "}
                to evaluate the structural similarity of metabolites. By
                default, <i>Datanator</i> displays measurements of metabolites
                that have Tanimoto coefficients of 0.65 or higher. The
                &quot;Chemical similarity&quot; filter can be used to narrow the
                displayed measurements to measurements of highly similar
                metabolites (Tanimoto coefficient near 1).
              </p>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can <i>Datanator</i> help me find data measured in similar
              cell types?
            </div>
            <div className="faq-a">
              <p>
                <i>Datanator</i> aims to help users leverage all available
                metadata to find data relevant to a specific species, genetic
                variant, and cell type. Note, this is limited by the metadata
                reported by the original authors and the primary databases that{" "}
                <i>Datanator</i> integrates.
              </p>

              <p>
                All of <i>Datanator</i>&apos;s data tables provide information
                about the organism in which each measurement was conducted. This
                information can be filtered to find data measured in closely
                related organisms.
              </p>

              <p>
                In addition, the measurements in the protein abundance table can
                be filtered by tissue type and the measurements in the reaction
                rate constants table can be filtered by whether the measurement
                was conducted in a wildtype or mutant strain.
              </p>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can <i>Datanator</i> help me find data measured in similar
              experimental conditions?
            </div>
            <div className="faq-a">
              <p>
                <i>Datanator</i> aims to help users leverage all available
                metadata to find data relevant to a specific experimental
                condition. Note, this is limited by the metadata reported by the
                original authors and the primary databases that <i>Datanator</i>{" "}
                integrates.
              </p>
              <p>
                The measurements in the metabolite concentration table can be
                filtered by growth media, growth phase, and growth conditions.
                The measurements in the reaction rate constants table can be
                filtered by pH and temperature.
              </p>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              What kinds of models or other analyses does <i>Datanator</i>{" "}
              facilitate?
            </div>
            <div className="faq-a">
              <ul className="vertically-spaced">
                <li>
                  <i>Datanator</i> can help investigators find genomic and
                  biochemical data to identify the <b>initial conditions</b> and{" "}
                  <b>rate parameters</b> of{" "}
                  <b>continuous and stochastic dynamical models</b>. In turn,
                  this can help investigators construct more comprehensive and
                  more accurate models.
                </li>
                <li>
                  <i>Datanator</i> can help investigators improve
                  <b>constraint-based models</b> of metabolism by helping
                  investigators find enzyme abundances and reaction velocities
                  to <b>bound the fluxes</b> of chemical transformation and
                  transport reactions.
                </li>
                <li>
                  <i>Datanator</i> can help investigators modify{" "}
                  <b>
                    models to capture other organisms, tissues, and cell types
                  </b>{" "}
                  by helping investigators find data to re-calibrate model
                  parameters. In turn, this can help investigators compare
                  organisms, tissues, and cell types.
                </li>
                <li>
                  <i>Datanator</i> can also help investigators conduct
                  <b>data-driven meta-analyses</b> of molecular biology. For
                  example, the <i>Datanator</i> database can be used to conduct
                  multi-dimensional analyses of an individual organism or
                  conduct comparative analyses of multiple organisms.
                </li>
              </ul>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              What modeling tasks does <i>Datanator</i> facilitate?
            </div>
            <div className="faq-a">
              <i>Datanator</i> can help modelers accomplish several tasks:
              <ul className="vertically-spaced">
                <li>
                  <i>Datanator</i> can help modelers <b>design</b> the scope and
                  granularity of a model by helping modelers assess the data
                  available for calibration and validation.
                </li>
                <li>
                  <i>Datanator</i> can help modelers find data to{" "}
                  <b>calibrate</b> the parameters of a model.
                </li>
                <li>
                  <i>Datanator</i> can help modelers find independent data to{" "}
                  <b>validate</b> the predictions of a model.
                </li>
              </ul>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              Can I programmatically access the data in <i>Datanator</i>?
            </div>
            <div className="faq-a">
              <i>Datanator</i>&apos;s REST{" "}
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
              <p>
                <i>Datanator&apos;s</i> data is available via the{" "}
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
                . Please see the{" "}
                <a
                  href="https://open.quiltdata.com/b/karrlab/packages/karrlab/datanator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  README
                </a>{" "}
                for the package for more information about using the package.
              </p>
              <p>
                In addition, users can use the
                <a
                  href={"https://github.com/KarrLab/datanator"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <i>Datanator</i> software
                </a>{" "}
                to construct their own version of
                <i>Datanator&apos;s</i> dataset. This will download the data
                from the primary sources and parse, normalize, and integrate the
                data into a single database.
              </p>
            </div>
          </div>

          <div className="faq">
            <div className="faq-q">
              How can I cite <i>Datanator</i>?
            </div>
            <div className="faq-a">
              We aim to submit an article for publication and to a pre-printer
              server in 2020. Please check back later for more information.
            </div>
          </div>

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
              We would love to work together to integrate data for biomodeling.
              Please{" "}
              <HashLink to="#contact" scroll={scrollTo}>
                contact us
              </HashLink>{" "}
              to discuss how to get involved.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Faq;
