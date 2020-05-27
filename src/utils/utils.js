import React from "react";

function matchAll(string, regex) {
  const matches = [];
  string.replace(regex, function() {
    const match = Array.prototype.slice.call(arguments, 0, -2);
    match.input = arguments[arguments.length - 1];
    match.index = arguments[arguments.length - 2];
    matches.push(match);
  });
  return matches;
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
      <span className="sci-notation">
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
  const formattedFormula = [];
  for (const match of matchAll(formula, regex)) {
    if (parseFloat(match[2]) === 0) {
      continue;
    }

    if (parseFloat(match[2]) === 1) {
      match[2] = "";
    }

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
        if (iEl > arrayOfDicts.length - 1) {
          arrayOfDicts.push({});
        }
        arrayOfDicts[iEl][key] = dictOfArrays[key][iEl];
      }
    } else {
      const iEl = 0;
      if (iEl > arrayOfDicts.length - 1) {
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

function scrollTo(el, offsetTop = -52) {
  window.scrollTo({ behavior: "smooth", top: el.offsetTop + offsetTop });
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

function downloadData(data, filename, mimeType) {
  const anchor = document.createElement("a");

  anchor.download = filename;

  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  anchor.href = url;

  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      anchor.removeEventListener("click", clickHandler);
    }, 150);
  };
  anchor.addEventListener("click", clickHandler, false);

  anchor.click();
}

function parseHistoryLocationPathname(history) {
  const pathRegex = /^(\/(.*?)(\/(.*?)(\/(.*?))?)?)?\/?$/;
  const match = history.location.pathname.match(pathRegex);
  let route = null;
  let query = null;
  let organism = null;
  if (match) {
    route = match[2];
    query = match[4] ? match[4].trim() || null : null;
    organism = match[6] ? match[6].trim() || null : null;
  }
  if (typeof organism === "string" && organism.toLowerCase() === "null") {
    organism = null;
  }
  return {
    route: route,
    query: query,
    organism: organism
  };
}

function getNumProperties(obj) {
  let size = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      size++;
    }
  }
  return size;
}

function castToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  } else {
    if (obj == null || obj === undefined) {
      return [];
    } else {
      return [obj];
    }
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isEmpty(element) {
  if (element instanceof Array) {
    if (element.length === 0) {
      return true;
    }
  } else {
    if (Object.keys(element).length === 0) {
      return true;
    }
  }
  return false;
}

function naturalSort(a, b) {
  return a.localeCompare(b, navigator.languages[0] || navigator.language, {
    caseFirst: "lower",
    numeric: true,
    ignorePunctuation: false
  });
}

export {
  formatScientificNotation,
  formatChemicalFormula,
  dictOfArraysToArrayOfDicts,
  upperCaseFirstLetter,
  scrollTo,
  strCompare,
  removeDuplicates,
  downloadData,
  parseHistoryLocationPathname,
  getNumProperties,
  castToArray,
  numberWithCommas,
  isEmpty,
  naturalSort
};
