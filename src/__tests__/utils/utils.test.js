import React from "react";
import { render } from "@testing-library/react";
import { shallow } from "enzyme";
import {
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
  castToArray
} from "~/utils/utils";

/* global jest, test, expect */

test("formatScientificNotation", () => {
  expect(formatScientificNotation(null)).toEqual(null);
  expect(formatScientificNotation(undefined)).toEqual(null);
  expect(formatScientificNotation(NaN)).toEqual(null);

  expect(formatScientificNotation(0)).toEqual("0.0");

  expect(formatScientificNotation(1)).toEqual("1.0");
  expect(formatScientificNotation(1.1)).toEqual("1.1");
  expect(formatScientificNotation(1.01)).toEqual("1.0");
  expect(shallow(formatScientificNotation(10.2)).text()).toEqual("1.0 × 101");
  expect(shallow(formatScientificNotation(13.2)).text()).toEqual("1.3 × 101");
  expect(shallow(formatScientificNotation(140.2)).text()).toEqual("1.4 × 102");

  expect(formatScientificNotation(-1)).toEqual("-1.0");
  expect(formatScientificNotation(-1.1)).toEqual("-1.1");
  expect(formatScientificNotation(-1.01)).toEqual("-1.0");
  expect(shallow(formatScientificNotation(-10.2)).text()).toEqual("-1.0 × 101");
  expect(shallow(formatScientificNotation(-13.2)).text()).toEqual("-1.3 × 101");
  expect(shallow(formatScientificNotation(-140.2)).text()).toEqual(
    "-1.4 × 102"
  );

  expect(formatScientificNotation(0.1)).toEqual("0.10");
  expect(shallow(formatScientificNotation(0.01)).text()).toEqual("1.0 × 10-2");
  expect(shallow(formatScientificNotation(0.012)).text()).toEqual("1.2 × 10-2");
  expect(shallow(formatScientificNotation(0.0132)).text()).toEqual(
    "1.3 × 10-2"
  );
  expect(shallow(formatScientificNotation(0.0001)).text()).toEqual(
    "1.0 × 10-4"
  );
  expect(shallow(formatScientificNotation(0.00015)).text()).toEqual(
    "1.5 × 10-4"
  );
  expect(shallow(formatScientificNotation(0.000104)).text()).toEqual(
    "1.0 × 10-4"
  );
  expect(shallow(formatScientificNotation(0.000105)).text()).toEqual(
    "1.1 × 10-4"
  );

  expect(formatScientificNotation(-0.1)).toEqual("-0.10");
  expect(shallow(formatScientificNotation(-0.01)).text()).toEqual(
    "-1.0 × 10-2"
  );
  expect(shallow(formatScientificNotation(-0.012)).text()).toEqual(
    "-1.2 × 10-2"
  );
  expect(shallow(formatScientificNotation(-0.0132)).text()).toEqual(
    "-1.3 × 10-2"
  );
  expect(shallow(formatScientificNotation(-0.0001)).text()).toEqual(
    "-1.0 × 10-4"
  );
  expect(shallow(formatScientificNotation(-0.00015)).text()).toEqual(
    "-1.5 × 10-4"
  );
  expect(shallow(formatScientificNotation(-0.000104)).text()).toEqual(
    "-1.0 × 10-4"
  );
  expect(shallow(formatScientificNotation(-0.000105)).text()).toEqual(
    "-1.1 × 10-4"
  );
});

test("formatChemicalFormula", () => {
  expect(formatChemicalFormula(null)).toEqual(null);

  let formula;

  formula = formatChemicalFormula("CHO");
  expect(formula).toHaveLength(3);
  expect(shallow(formula[0]).html()).toEqual("<span>C</span>");
  expect(shallow(formula[1]).html()).toEqual("<span>H</span>");
  expect(shallow(formula[2]).html()).toEqual("<span>O</span>");

  formula = formatChemicalFormula("C0H1O2N10");
  expect(formula).toHaveLength(3);
  expect(shallow(formula[0]).html()).toEqual("<span>H</span>");
  expect(shallow(formula[1]).html()).toEqual("<span>O<sub>2</sub></span>");
  expect(shallow(formula[2]).html()).toEqual("<span>N<sub>10</sub></span>");
});

test("dictOfArraysToArrayOfDicts", () => {
  let result;

  result = dictOfArraysToArrayOfDicts({ a: [1, 2, 3], b: [4, 5, 6], c: 7 });
  expect(result).toEqual([
    { a: 1, b: 4, c: 7 },
    { a: 2, b: 5 },
    { a: 3, b: 6 }
  ]);

  result = dictOfArraysToArrayOfDicts({ c: 7 });
  expect(result).toEqual([{ c: 7 }]);
});

test("upperCaseFirstLetter", () => {
  expect(upperCaseFirstLetter("a sentence")).toBe("A sentence");
  expect(upperCaseFirstLetter("A sentence")).toBe("A sentence");
});

test("scrollTo", () => {
  global.scrollTo = jest.fn(() => {});
  const el = render(<div></div>);
  expect(scrollTo(el.container)).toBe(undefined);
});

test("strCompare", () => {
  expect(strCompare("a", "a")).toBe(0);

  expect(strCompare("a", "A", false)).toBe(1);
  expect(strCompare("a", "A")).toBe(0);

  expect(strCompare("a", "b")).toBe(-1);
  expect(strCompare("b", "a")).toBe(1);
});

test("removeDuplicates", () => {
  expect(removeDuplicates(["b", "a", "c", "a"])).toEqual(["b", "a", "c"]);
  expect(removeDuplicates(["b", "a", "c", "A"])).toEqual(["b", "a", "c", "A"]);
  expect(
    removeDuplicates(["b", "a", "c", "a"], key => key.toLowerCase())
  ).toEqual(["b", "a", "c"]);
});

test("downloadData", () => {
  jest.spyOn(document, "createElement").mockImplementation(() => {
    const el = {
      download: null,
      href: null,
      removeEventListener: jest.fn(),
      click: () => {
        el.clickHandler();
      },
      clickHandler: null
    };
    el.addEventListener = (eventType, handler) => {
      el.clickHandler = handler;
    };
    return el;
  });
  expect(downloadData("test", "test.txt", "plain/text")).toBe(undefined);
});

test("parseHistoryLocationPathname", () => {
  expect(parseHistoryLocationPathname({ location: { pathname: "" } })).toEqual({
    route: undefined,
    query: null,
    organism: null
  });

  expect(parseHistoryLocationPathname({ location: { pathname: "/" } })).toEqual(
    {
      route: "",
      query: null,
      organism: null
    }
  );

  expect(
    parseHistoryLocationPathname({ location: { pathname: "/home" } })
  ).toEqual({
    route: "home",
    query: null,
    organism: null
  });

  expect(
    parseHistoryLocationPathname({ location: { pathname: "/search" } })
  ).toEqual({
    route: "search",
    query: null,
    organism: null
  });

  expect(
    parseHistoryLocationPathname({ location: { pathname: "/search/glucose" } })
  ).toEqual({
    route: "search",
    query: "glucose",
    organism: null
  });

  expect(
    parseHistoryLocationPathname({
      location: { pathname: "/search/glucose/Homo sapiens" }
    })
  ).toEqual({
    route: "search",
    query: "glucose",
    organism: "Homo sapiens"
  });

  expect(
    parseHistoryLocationPathname({ location: { pathname: "/search/ / /" } })
  ).toEqual({
    route: "search",
    query: null,
    organism: null
  });
});

test("getNumProperties", () => {
  expect(getNumProperties({})).toBe(0);
  expect(getNumProperties({ a: 1, b: 2 })).toBe(2);
  expect(getNumProperties({ a: 1, b: 2, c: 3, d: 4 })).toBe(4);
});

test("castToArray", () => {
  expect(castToArray(null)).toEqual([]);
  expect(castToArray(undefined)).toEqual([]);
  expect(castToArray("a")).toEqual(["a"]);
  expect(castToArray(["b"])).toEqual(["b"]);
});
