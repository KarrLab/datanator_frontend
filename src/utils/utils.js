import React from "react";

function matchAll(string, regex) {
  var matches = [];
  string.replace(regex, function() {
    var match = Array.prototype.slice.call(arguments, 0, -2);
    match.input = arguments[arguments.length - 1];
    match.index = arguments[arguments.length - 2];
    matches.push(match);
  });
  return matches;
}

function mode(numbers) {
  // as result can be bimodal or multi-modal,
  // the returned result is provided as an array
  // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
  let counts = [];
  let maxCount = 0;

  // count occurence of each number and determine maximum number of occurences
  for (const number of numbers) {
    counts[number] = (counts[number] || 0) + 1;
    if (counts[number] > maxCount) {
      maxCount = counts[number];
    }
  }

  // find all modes
  let modes = [];
  for (const number in counts) {
    if (counts[number] === maxCount) {
      modes.push(number);
    }
  }

  // sort modes
  modes.sort();

  // return modes
  return modes;
}

function formatScientificNotation(
  value,
  sciMagUpThresh = 1,
  sciMagDownThresh = 1,
  sciDecimals = 1,
  fixedDeminals = 1,
  minFixedDecimals = 0
) {
  if (value == null || isNaN(value) || value === undefined) return null;

  const absValue = Math.abs(value);
  const sign = Math.sign(value);
  const exp = Math.floor(Math.log10(absValue));

  if (
    absValue !== 0 &&
    (absValue > Math.pow(10, sciMagUpThresh) ||
      absValue < Math.pow(10, -sciMagDownThresh))
  ) {
    const sciVal = ((sign * absValue) / Math.pow(10, exp)).toFixed(sciDecimals);
    return (
      <span>
        {sciVal}&thinsp;&times;&thinsp;10<sup>{exp}</sup>
      </span>
    );
  } else if (absValue > 1 || absValue === 0) {
    return value.toFixed(fixedDeminals);
  } else {
    const decimals = Math.max(minFixedDecimals, fixedDeminals - exp);
    return value.toFixed(decimals);
  }
}

function formatChemicalFormula(formula) {
  if (!formula) {
    return null;
  }

  const regex = /([A-Z][a-z]?)([0-9]*)/g;
  let formattedFormula = [];
  for (const match of matchAll(formula, regex)) {
    formattedFormula.push(
      <span key={match[1]}>
        {match[1]}
        {match[2] && <sub>{match[2]}</sub>}
      </span>
    );
  }
  return formattedFormula;
}

function dictOfArraysToArrayOfDicts(dictOfArrays) {
  const arrayOfDicts = [];
  for (const key in dictOfArrays) {
    if (Array.isArray(dictOfArrays[key])) {
      for (let iEl = 0; iEl < dictOfArrays[key].length; iEl++) {
        if (iEl >= arrayOfDicts.length - 1) {
          arrayOfDicts.push({});
        }
        arrayOfDicts[iEl][key] = dictOfArrays[key][iEl];
      }
    } else {
      const iEl = 0;
      if (iEl >= arrayOfDicts.length - 1) {
        arrayOfDicts.push({});
      }
      arrayOfDicts[iEl][key] = dictOfArrays[key];
    }
  }

  return arrayOfDicts;
}

function upperCaseFirstLetter(string) {
  return (
    string.substring(0, 1).toUpperCase() + string.substring(1, string.length)
  );
}

function scrollTo(el) {
  window.scrollTo({ behavior: "smooth", top: el.offsetTop - 52 });
}

function strCompare(a, b, caseInsensitive = true) {
  if (caseInsensitive) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

function removeDuplicates(array, keyFunc = null) {
  const uniqueKeyVals = {};

  for (const el of array) {
    let key;
    if (keyFunc == null) {
      key = el;
    } else {
      key = keyFunc(el);
    }

    if (!(key in uniqueKeyVals)) {
      uniqueKeyVals[key] = el;
    }
  }

  return Object.values(uniqueKeyVals);
}

function sizeGridColumnsToFit(event, grid) {
  const gridApi = event.api;
  gridApi.sizeColumnsToFit();
  updateGridHorizontalScrolling(event, grid);
}

function updateGridHorizontalScrolling(event, grid) {
  const columnApi = event.columnApi;

  const gridRoot = grid.eGridDiv.getElementsByClassName("ag-root")[0];
  const gridWidth: number = gridRoot.offsetWidth;

  const displayedCols = columnApi.getAllDisplayedColumns();
  const numDisplayedCols: number = displayedCols.length;
  let totDisplayedColMinWidth = 0;
  for (const col of displayedCols) {
    totDisplayedColMinWidth += col.getActualWidth();
  }

  if (totDisplayedColMinWidth + 2 * (numDisplayedCols + 1) > gridWidth) {
    grid.gridOptions.suppressHorizontalScroll = false;
  } else {
    grid.gridOptions.suppressHorizontalScroll = true;
  }
}

function getBooleanValue(checkboxSelector) {
  return document.querySelector(checkboxSelector);
}

function only20YearOlds(params) {
  return params.node.data && params.node.data.age != 20;
}

function getParams() {
  return {
    allColumns: getBooleanValue("#allColumns"),
    columnGroups: getBooleanValue("#columnGroups"),
    columnKeys: getBooleanValue("#columnKeys"),
    onlySelected: getBooleanValue("#onlySelected"),
    onlySelectedAllPages: getBooleanValue("#onlySelectedAllPages"),
    shouldRowBeSkipped:
      getBooleanValue("#shouldRowBeSkipped") && only20YearOlds,
    skipFooters: getBooleanValue("#skipFooters"),
    skipGroups: getBooleanValue("#skipGroups"),
    skipHeader: getBooleanValue("#skipHeader"),
    skipPinnedTop: getBooleanValue("#skipPinnedTop"),
    skipPinnedBottom: getBooleanValue("#skipPinnedBottom")
  };
}

export {
  mode,
  formatScientificNotation,
  formatChemicalFormula,
  dictOfArraysToArrayOfDicts,
  upperCaseFirstLetter,
  scrollTo,
  strCompare,
  removeDuplicates,
  sizeGridColumnsToFit,
  updateGridHorizontalScrolling,
  getParams
};
