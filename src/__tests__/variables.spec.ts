import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle declares", async () => {
  const ts = `
declare const test: {a: number};
declare const foo: string, bar: number;

declare var baz: number;
declare var quuz: any, quuuz: string;

declare let quuuuz: number;
declare let quuuuuz: string, fox: number;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
