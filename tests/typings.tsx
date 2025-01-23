import type * as RemixNode from "@remix-run/node";
import * as RemixReact from "@remix-run/react";
import React, { ReactNode } from "react";
import type * as ReactRouter from "react-router";
import {
  create,
  createFromLoader,
  HasUnknownKeys,
  toBooleanValues,
} from "../src/main";

function test<T>(x: T) {
  return x;
}

const array3 = ["a", "b", "c"];
const array3Const = ["a", "b", "c"] as const;

const [Is] = createFromLoader(() => ({
  string: "a",
  stringConst: "a" as const,
  stringConstB: "a" as "a" | "b" | "c",
  array1: ["a"],
  array1Const: ["a"] as const,
  array3,
  array3Const,
  boolean: true,
  booleanConst: true as const,
}));

create(() => ({
  // @ts-expect-error
  children: <></>,
  // @ts-expect-error
  fallback: <></>,
}));

const routerAction = (_args: ReactRouter.ActionFunctionArgs) => {};
const routerLoader = (_args: ReactRouter.LoaderFunctionArgs) => {};
const routerClientAction = (_args: ReactRouter.ClientActionFunctionArgs) => {};
const routerClientLoader = (_args: ReactRouter.ClientLoaderFunctionArgs) => {};
const action = (_args: RemixNode.ActionFunctionArgs) => {};
const loader = (_args: RemixNode.LoaderFunctionArgs) => {};
const clientAction = (_args: RemixReact.ClientActionFunctionArgs) => {};
const clientLoader = (_args: RemixReact.ClientLoaderFunctionArgs) => {};
const error = (_args: number) => {};

createFromLoader((args) => {
  new URL(args.request.url);

  routerAction(args);
  routerLoader(args);
  routerClientAction(args);
  routerClientLoader(args);
  action(args);
  loader(args);
  clientAction(args);
  clientLoader(args);
  // @ts-expect-error
  error(args);

  return {};
});

<Is />;
<Is>
  <></>
</Is>;
<Is fallback={<></>} />;
<Is fallback={<></>}>
  <></>
</Is>;
<Is string="foo" fallback={<></>}>
  <></>
</Is>;

const knownString = "a" as const;
const unknownString = "x" as const;
const knownArray = ["a"] as const;
const knownArrayB = ["a", "b"] as const;
const unknownArray = ["x"] as const;
const unknownArrayB = ["a", "x"] as const;
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
<Is stringConst={knownArrayB} />;
// @ts-expect-error
<Is stringConst={unknownArray} />;
// @ts-expect-error
<Is stringConst={unknownArrayB} />;

<Is stringConstB={knownString} />;
// @ts-expect-error
<Is stringConstB={unknownString} />;
// @ts-expect-error
<Is stringConstB={knownBoolean} />;
// @ts-expect-error
<Is stringConstB={unknownBoolean} />;
<Is stringConstB={knownArray} />;
<Is stringConstB={knownArrayB} />;
// @ts-expect-error
<Is stringConstB={unknownArray} />;
// @ts-expect-error
<Is stringConstB={unknownArrayB} />;

<Is array1={knownString} />;
<Is array1={unknownString} />;
// @ts-expect-error
<Is array1={knownBoolean} />;
// @ts-expect-error
<Is array1={unknownBoolean} />;
<Is array1={knownArray} />;
<Is array1={knownArrayB} />;
<Is array1={unknownArray} />;
<Is array1={unknownArrayB} />;

<Is array1Const={knownString} />;
// @ts-expect-error
<Is array1Const={unknownString} />;
// @ts-expect-error
<Is array1Const={knownBoolean} />;
// @ts-expect-error
<Is array1Const={unknownBoolean} />;
<Is array1Const={knownArray} />;
// @ts-expect-error
<Is array1Const={knownArrayB} />;
// @ts-expect-error
<Is array1Const={unknownArray} />;
// @ts-expect-error
<Is array1Const={unknownArrayB} />;

<Is array3={knownString} />;
<Is array3={unknownString} />;
// @ts-expect-error
<Is array3={knownBoolean} />;
// @ts-expect-error
<Is array3={unknownBoolean} />;
<Is array3={knownArray} />;
<Is array3={knownArrayB} />;
<Is array3={unknownArray} />;
<Is array3={unknownArrayB} />;

<Is array3Const={knownString} />;
// @ts-expect-error
<Is array3Const={unknownString} />;
// @ts-expect-error
<Is array3Const={knownBoolean} />;
// @ts-expect-error
<Is array3Const={unknownBoolean} />;
<Is array3Const={knownArray} />;
<Is array3Const={knownArrayB} />;
// @ts-expect-error
<Is array3Const={unknownArray} />;
// @ts-expect-error
<Is array3Const={unknownArrayB} />;

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
<Is boolean={knownArrayB} />;
// @ts-expect-error
<Is boolean={unknownArray} />;
// @ts-expect-error
<Is boolean={unknownArrayB} />;

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
<Is booleanConst={knownArray3} />;
// @ts-expect-error
<Is booleanConst={unknownArray} />;
// @ts-expect-error
<Is booleanConst={unknownArray3} />;

// @ts-expect-error
<Is unknown />;

test<Record<string, true>>(toBooleanValues(array3));
test<Record<string, true>>(toBooleanValues(array3Const));
test<Record<"a" | "b" | "c", true>>(toBooleanValues(array3));
test<Record<"a" | "b" | "c", true>>(toBooleanValues(array3Const));
test<Record<"x", true>>(toBooleanValues(array3));
// @ts-expect-error
test<Record<"x", true>>(toBooleanValues(array3Const));

let unknownValueName = "boolean";

const [Has] = createFromLoader(() => ({
  [unknownValueName]: true,
}));

<Has />;
<Has>
  <></>
</Has>;
<Has a />;
<Has a>
  <></>
</Has>;
<Has x />;
<Has x>
  <></>
</Has>;

const [Has2] = createFromLoader(() => toBooleanValues(array3));

<Has2 />;
<Has2>
  <></>
</Has2>;
<Has2 a />;
<Has2 a>
  <></>
</Has2>;
<Has2 x />;
<Has2 x>
  <></>
</Has2>;

const [Has3] = createFromLoader(() => toBooleanValues(array3Const));

<Has3 />;
<Has3>
  <></>
</Has3>;
<Has3 a />;
<Has3 a>
  <></>
</Has3>;
<Has3
  // @ts-expect-error
  x
/>;
<Has3
  // @ts-expect-error
  x
>
  <></>
</Has3>;

type ObjectWithKnownKeys = { a: boolean };
type ObjectWithUnknownKeys = { [x: string]: boolean };
type RecordWithKnownKeys = Record<"a", boolean>;
type RecordWithUnknownKeys = Record<string, boolean>;

test<HasUnknownKeys<ObjectWithKnownKeys>>(false);
test<HasUnknownKeys<ObjectWithUnknownKeys>>(true);
test<HasUnknownKeys<RecordWithKnownKeys>>(false);
test<HasUnknownKeys<RecordWithUnknownKeys>>(true);

type Props = {
  [key: string]: boolean;
  // @ts-expect-error
  children: //
  ReactNode;
};

// @ts-expect-error
const props: Props = {
  x: true,
  children: <></>,
};

test<Props>(props);
