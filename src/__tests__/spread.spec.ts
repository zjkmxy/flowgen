import { compiler, beautify } from "..";
import "../test-matchers";

it("should use spread when performing union of object types", async () => {
  const ts = `
type Foo = { foo: number };
type Bar = { bar: string };
const combination: Foo & Bar;
`;

  // Inexact spread does not work with Flow 0.202, so we only run in exact mode.
  {
    const result = compiler.compileDefinitionString(ts, {
      quiet: true,
      inexact: false,
    });
    expect(await beautify(result)).toMatchSnapshot();
    expect(result).toBeValidFlowTypeDeclarations();
  }
});

it("should not insert spread when performing union of class types", async () => {
  const ts = `
class Foo {}
class Bar {}
const combination: Foo & Bar;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
