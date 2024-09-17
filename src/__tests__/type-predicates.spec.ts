import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle user-defined type guards", async () => {
  const ts = `
declare type Fish = {};
declare type Bird = {};
declare function isFish(pet: Fish | Bird): pet is Fish;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
