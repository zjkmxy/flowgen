import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle boolean literals in type", async () => {
  const ts = `
  type MyFalsyType = string | false;
  type MyTruthyType = true | string;
  const foo = true;
`;

  const result = compiler.compileDefinitionString(ts, { quiet: true });

  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
