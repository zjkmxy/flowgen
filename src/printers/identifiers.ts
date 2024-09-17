// Please add only built-in type references

import * as printers from "./index";
import { opts } from "../options";
import { withEnv } from "../env";
import ts from "typescript";

const Record = ([key, value]: [any, any], isInexact = opts().inexact) => {
  const valueType = printers.node.printType(value);

  switch (key.kind) {
    case ts.SyntaxKind.LiteralType:
      return `{ ${printers.node.printType(key)}: ${valueType}${
        isInexact ? ", ..." : ""
      }}`;
    case ts.SyntaxKind.UnionType:
      if (key.types.every(t => t.kind === ts.SyntaxKind.LiteralType)) {
        const fields = key.types.reduce((acc, t) => {
          acc += `${printers.node.printType(t)}: ${valueType},\n`;
          return acc;
        }, "");
        return `{ ${fields}${isInexact ? "..." : ""}}`;
      }
    // Fallthrough
    default:
      return `{[key: ${printers.node.printType(key)}]: ${valueType}${
        isInexact ? ", ..." : ""
      }}`;
  }
};

type IdentifierResult = string | ((...args: any[]) => any);

const identifiers: { [name: string]: IdentifierResult } = {
  ReadonlyArray: "$ReadOnlyArray",
  ReadonlySet: "$ReadOnlySet",
  ReadonlyMap: "$ReadOnlyMap",
  Readonly: "$ReadOnly",
  RegExpMatchArray: "RegExp$matchResult",
  NonNullable: "$NonMaybeType",  // NonNullable is also accepted.
  Partial: "Partial",
  Required: "Required",
  ReturnType: "ReturnType",
  Record: "Record", // Note that Record is different from indexed object.
  Omit: "Omit",
  Pick: "Pick",
  Exclude: "Exclude",
  Extract: "Extract",
  Parameters: "Parameters",
  ThisParameterType: "ThisParameterType",
  OmitThisParameter: "OmitThisParameter",
};

export const print = withEnv<any, [string], IdentifierResult>((env, kind) => {
  if (env.classHeritage) return kind;
  return Object.prototype.hasOwnProperty.call(identifiers, kind)
    ? identifiers[kind]
    : kind;
});
