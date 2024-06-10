import { create, toBooleanValues } from "@arnosaine/is";
import React from "react";

const [Is] = create(() => ({
  string: "a",
  stringConst: "a" as const,
  array1: ["a"],
  array1Const: ["a"] as const,
  array3: ["a", "b", "c"],
  array3Const: ["a", "b", "c"] as const,
  boolean: true,
  booleanConst: true as const,
}));

create(() => ({
  // @ts-expect-error
  children: <></>,
  // @ts-expect-error
  fallback: <></>,
}));

<Is />;
<Is>children</Is>;
<Is fallback="fallback" />;
<Is fallback="fallback">children</Is>;

const knownString = "a" as const;
const unknownString = "x" as const;
const knownArray = ["a"] as const;
const unknownArray = ["x"] as const;
const knownBoolean = true as const;
const unknownBoolean = false as const;

<Is string={knownString} />;
<Is string={unknownString} />;
// @ts-expect-error
<Is string={knownBoolean} />;
// @ts-expect-error
<Is string={unknownBoolean} />;
<Is string={knownArray} />;
<Is string={unknownArray} />;

<Is stringConst={knownString} />;
// @ts-expect-error
<Is stringConst={unknownString} />;
// @ts-expect-error
<Is stringConst={knownBoolean} />;
// @ts-expect-error
<Is stringConst={unknownBoolean} />;
<Is stringConst={knownArray} />;
// @ts-expect-error
<Is stringConst={unknownArray} />;

<Is array1={knownString} />;
<Is array1={unknownString} />;
// @ts-expect-error
<Is array1={knownBoolean} />;
// @ts-expect-error
<Is array1={unknownBoolean} />;
<Is array1={knownArray} />;
<Is array1={unknownArray} />;

<Is array1Const={knownString} />;
// @ts-expect-error
<Is array1Const={unknownString} />;
// @ts-expect-error
<Is array1Const={knownBoolean} />;
// @ts-expect-error
<Is array1Const={unknownBoolean} />;
<Is array1Const={knownArray} />;
// @ts-expect-error
<Is array1Const={unknownArray} />;

<Is array3={knownString} />;
<Is array3={unknownString} />;
// @ts-expect-error
<Is array3={knownBoolean} />;
// @ts-expect-error
<Is array3={unknownBoolean} />;
<Is array3={knownArray} />;
<Is array3={unknownArray} />;

<Is array3Const={knownString} />;
// @ts-expect-error
<Is array3Const={unknownString} />;
// @ts-expect-error
<Is array3Const={knownBoolean} />;
// @ts-expect-error
<Is array3Const={unknownBoolean} />;
<Is array3Const={knownArray} />;
// @ts-expect-error
<Is array3Const={unknownArray} />;

// @ts-expect-error
<Is boolean={knownString} />;
// @ts-expect-error
<Is boolean={unknownString} />;
<Is boolean={knownBoolean} />;
<Is boolean={unknownBoolean} />;
// @ts-expect-error
<Is boolean={knownString} />;
// @ts-expect-error
<Is boolean={knownArray} />;

// @ts-expect-error
<Is booleanConst={knownString} />;
// @ts-expect-error
<Is booleanConst={unknownString} />;
<Is booleanConst={knownBoolean} />;
// @ts-expect-error
<Is booleanConst={unknownBoolean} />;
// @ts-expect-error
<Is booleanConst={knownString} />;
// @ts-expect-error
<Is booleanConst={knownArray} />;

// @ts-expect-error
<Is unknown />;

toBooleanValues(["a", "b", "c"] as const);
