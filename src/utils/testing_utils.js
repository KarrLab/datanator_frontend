function get_list_DOM_elements(wrapper, element_id, return_format = "html") {
  let testing_list_of_links = [];
  for (let i = 0; i < wrapper.find(element_id).length; i++) {
    if (return_format == "text") {
      testing_list_of_links.push(
        wrapper
          .find(element_id)
          .at(i)
          .text()
      );
    } else {
      testing_list_of_links.push(
        wrapper
          .find(element_id)
          .at(i)
          .html()
      );
    }
  }
  return testing_list_of_links;
}

function getSectionFromList(list, field_name, name) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][field_name] === name) {
      return list[i];
    }
  }
  return null;
}

export { get_list_DOM_elements, getSectionFromList };
