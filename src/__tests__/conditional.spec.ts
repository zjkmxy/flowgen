import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle exported interfaces", async () => {
  const ts = `export function add<T extends string | number>(a: T, b: T): T extends string ? string : number;`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
