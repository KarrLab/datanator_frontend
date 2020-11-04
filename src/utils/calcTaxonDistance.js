static calcTaxonomicDistance(taxonDistance, targetSpecies, measuredSpecies) {
    let distance = null;

    targetSpecies = targetSpecies.toLowerCase();
    measuredSpecies = measuredSpecies.toLowerCase();
    taxonDistance = Object.assign({}, taxonDistance);
    for (const key in taxonDistance) {
      taxonDistance[key.toLowerCase()] = taxonDistance[key];
    }

    if (
      targetSpecies === measuredSpecies ||
      measuredSpecies.startsWith(targetSpecies)
    ) {
      distance = 0;
    } else if (
      targetSpecies + "_canon_ancestors" in taxonDistance &&
      measuredSpecies + "_canon_ancestors" in taxonDistance
    ) {
      const toAncestors = taxonDistance[targetSpecies + "_canon_ancestors"];
      const fromAncestors = taxonDistance[measuredSpecies + "_canon_ancestors"];
      toAncestors.push(targetSpecies);
      fromAncestors.push(measuredSpecies);
      distance = 0;
      for (
        let iLineage = 0;
        iLineage < Math.min(toAncestors.length, fromAncestors.length);
        iLineage++
      ) {
        if (toAncestors[iLineage] !== fromAncestors[iLineage]) {
          distance = toAncestors.length - iLineage;
          break;
        }
      }
      toAncestors.pop();
      fromAncestors.pop();
    } else {
      distance = null;
    }