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

function formatScientificNotation(value) {
  const absValue = Math.abs(value);
  const sign = Math.sign(value);
  const exp = Math.floor(Math.log10(absValue));

  if (
    absValue !== 0 &&
    (absValue > Math.pow(10, 1) || absValue < Math.pow(10, -1))
  ) {
    const sciVal = ((sign * absValue) / Math.pow(10, exp)).toFixed(1);
    return (
      <span>
        {sciVal}&thinsp;&times;&thinsp;10<sup>{exp}</sup>
      </span>
    );
  } else {
    const decimals = 1 - Math.max(0, exp);
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

export {
  mode,
  formatScientificNotation,
  formatChemicalFormula,
  dictOfArraysToArrayOfDicts,
  upperCaseFirstLetter,
  scrollTo,
  strCompare
};
