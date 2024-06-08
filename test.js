import { create } from "@arnosaine/is";
import { strict as assert } from "node:assert";
import test from "node:test";

const values = {
  string: "a",
  array1: ["a"],
  array3: ["a", "b", "c"],
  boolean: true,
};

const [, useIs] = create(() => values);

[
  {
    name: "string",
    success: ["a", ["a"], ["a", "b"]],
    fail: ["b", [], ["b"], false],
  },
  {
    name: "array1",
    success: ["a", [], ["a"]],
    fail: ["b", ["b"], ["a", "b"], false],
  },
  {
    name: "array3",
    success: ["a", "b", ["a"], [], ["b"], ["a", "b"]],
    fail: ["x", ["x"], ["a", "x"], false],
  },
  {
    name: "boolean",
    success: [true, [true], [false, true], "x", [true, "x"]],
    fail: [false, [false], [], ["x"], [false, "x"]],
  },
].forEach(({ name, success, fail }) => {
  success.forEach((condition) =>
    test(`${name}: ${condition}`, () => {
      assert(useIs({ [name]: condition }));
    })
  );
  fail.forEach((condition) =>
    test(`${name}: ${condition}`, () => {
      assert(!useIs({ [name]: condition }));
    })
  );
});
