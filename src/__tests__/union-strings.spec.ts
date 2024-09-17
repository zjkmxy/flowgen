import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle union strings", async () => {
  const ts = `
  interface MyObj {
    state?: "APPROVED" | "REQUEST_CHANGES" | "COMMENT" | "PENDING"
  }
  type CompletionsTriggerCharacter = '"' | "'";
`;

  const result = compiler.compileDefinitionString(ts, { quiet: true });

  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
