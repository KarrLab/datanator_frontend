const TAXONOMIC_PROXIMITY_TOOLTIP =
  "Number of ranks in the NCBI Taxonomy tree between the queried organism and its latest common ancestor with each measured organism.";
const CHEMICAL_SIMILARITY_TOOLTIP =
  "Tanimoto coefficient between the molecular structure of the queried metabolite and the structure of each measured metabolite. Identical molecules have coefficients of 1. Completely dissimilar molecules have coefficients of 0. Molecules with coefficients > 0.85 are often considered to be similar.";

export { TAXONOMIC_PROXIMITY_TOOLTIP, CHEMICAL_SIMILARITY_TOOLTIP };
