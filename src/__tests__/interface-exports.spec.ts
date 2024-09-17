import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle exported interfaces", async () => {
  const ts = `export interface UnaryFunction<T, R> {
    (source: T): R;
  }
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle exported interfaces within a module", async () => {
  const ts = `declare module "my-module" {
    export interface UnaryFunction<T, R> {
      (source: T): R;
    }
  }
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
