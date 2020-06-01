function getListDomElements(wrapper, elementId, return_format = "html") {
  let testingListOfLinks = [];
  for (let i = 0; i < wrapper.find(elementId).length; i++) {
    if (return_format == "text") {
      testingListOfLinks.push(wrapper.find(elementId).at(i).text());
    } else {
      testingListOfLinks.push(wrapper.find(elementId).at(i).html());
    }
  }
  return testingListOfLinks;
}

function getSectionFromList(list, fieldName, name) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][fieldName] === name) {
      return list[i];
    }
  }
  return null;
}

export { getListDomElements, getSectionFromList };
