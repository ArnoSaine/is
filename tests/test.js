import { create } from "@arnosaine/is";
import { strict as assert } from "node:assert";
import test from "node:test";

const values = {
  string: "a",
  array0: [],
  array1: ["a"],
  array3: ["a", "b", "c"],
  boolean: true,
};

const [, useIsSome] = create(() => values);
const [, useIsEvery] = create(() => values, undefined, { method: "every" });

const tests = [
  {
    param: "string",
    success: ["a", ["a"], ["a", "b"]],
    fail: ["b", [], ["b"], true, false],
  },
  {
    param: "array0",
    success: [],
    fail: ["a", "b", ["a"], ["b"], ["a", "b"], true, false],
    every: {
      success: [[]],
      fail: [],
    },
    some: {
      success: [],
      fail: [[]],
    },
  },
  {
    param: "array1",
    success: ["a", ["a"]],
    fail: ["b", ["b"], true, false],
    every: {
      success: [[]],
      fail: [["a", "b"]],
    },
    some: {
      success: [["a", "b"]],
      fail: [[]],
    },
  },
  {
    param: "array3",
    success: ["a", "b", ["a"], ["b"], ["a", "b"]],
    fail: ["x", ["x"], true, false],
    every: {
      success: [[]],
      fail: [["a", "x"]],
    },
    some: {
      success: [["a", "x"]],
      fail: [[]],
    },
  },
  {
    param: "boolean",
    success: [true, [true], [false, true], "x", [true, "x"]],
    fail: [false, [false], [], ["x"], [false, "x"]],
  },
];

const methods = [
  { method: "every", useIs: useIsEvery },
  { method: "some", useIs: useIsSome },
];

const outcomes = [
  { outcome: "success", expect: true },
  { outcome: "fail", expect: false },
];

const matrix = methods.flatMap((method) =>
  outcomes.map((outcome) => ({ ...method, ...outcome }))
);

matrix
  .flatMap(({ outcome, method, expect, useIs }) =>
    tests.map(({ param, ...test }) => ({
      param,
      expect,
      useIs,
      name: `${method} ${param} (${outcome})`,
      conditions: [...test[outcome], ...(test[method]?.[outcome] ?? [])],
    }))
  )
  .flatMap(({ conditions, name, param, expect, useIs }) =>
    conditions.map((condition) => ({
      name: `${name}: ${JSON.stringify(condition)}`,
      actual: useIs({ [param]: condition }),
      expect,
    }))
  )
  .forEach(({ name, actual, expect }) => {
    test(name, () => {
      assert.equal(actual, expect);
    });
  });
