import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle basic keywords", async () => {
  const ts = `
declare interface A {
  bar: string
}

export declare const ok: number
  `;

  const result = compiler.compileDefinitionString(ts, {
    quiet: true,
    asModule: "test",
  });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle basic keywords  cll", async () => {
  const ts = `
  declare module 'test' {
    interface A {
      bar: string
    }
    export const ok: number
  }`;

  const result = compiler.compileDefinitionString(ts, {
    quiet: true,
    asModule: "test",
  });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
