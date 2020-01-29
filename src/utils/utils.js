import React from "react";
import { min, max } from "mathjs";

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

function jsonToCsv(jsonData) {
  //If jsonData is not an object then JSON.parse will parse the JSON string in an Object
  const arrData = typeof jsonData != "object" ? JSON.parse(jsonData) : jsonData;
  let csv = "";
  const showLabel = true;

  //This condition will generate the Label/Header
  if (showLabel) {
    let row = "";

    //This loop will extract the label from 1st index of on array
    for (let index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ",";
    }
    row = row.slice(0, -1);
    //append Label row with line break
    csv += row + "\r\n";
  }

  //1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    let row = "";
    //2nd loop will extract each column and convert it in string comma-seprated
    for (let index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    //add a line break after each row
    csv += row + "\r\n";
  }

  if (csv === "") {
    // Todo: use better way to communicate error to user
    alert("Invalid data");
    return;
  }

  //this trick will generate a temp "a" tag
  const link = document.createElement("a");

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);

  return csv;
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

function range(numbers) {
  return [min(numbers), max(numbers)];
}

function roundToDecimal(value, decimals) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
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
  return formattedFormula.reduce(
    (acc, x) => (acc === null ? [x] : [acc, x]),
    null
  );
}

export { jsonToCsv, mode, range, roundToDecimal, formatChemicalFormula };
