import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle exports", async () => {
  const ts = `
const Mdl = '';
export default Mdl
export { Mdl }
export { Mdl as newModule }
export { GeneratorOptions } from "@babel/generator";
export { GeneratorOptions as NewGeneratorOptions } from "@babel/generator";
export * from '@babel/types';
export * as t from "@babel/types";
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

test("should handle unnamed default export", async () => {
  const ts = `
export default function(): void;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
