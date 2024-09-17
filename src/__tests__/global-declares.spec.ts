import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle declared interfaces", async () => {
  const ts = `
declare interface ICustomMessage {
  method(test: string): void;
  otherMethod(literal: "A"|"B"): void;
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
