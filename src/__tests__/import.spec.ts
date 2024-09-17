import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle dynamic imports", async () => {
  const ts = `
// whole module
type A = import('react');

// type alias inside module
type B = import('react').ReactNode;

// generic type alias inside module, with type arguments
type C = import('react').ComponentType<{}>;

// class inside module
type D = import('zlib').Zlib;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle imports from odd names", async () => {
  const ts = `
type A = import('..');
type B = import('@!-/./');
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  // expect(result).toBeValidFlowTypeDeclarations(); // would need actual modules at those names
});

it("should handle import nested in type arguments of import", async () => {
  // In other words, test that our visitor for this feature didn't forget to
  // visit the type arguments in the case where it's rewriting something.
  const ts = `
type A = import("react").ComponentType<import("react").ComponentType<any>>;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle import in an imported file", async () => {
  // There once was a bug where transformers wouldn't get run on the second
  // (or later) file in a list like this.  Test that the transformer
  // implementing this feature does indeed run there.
  const results = compiler.compileDefinitionFiles(
    [
      "src/__tests__/snippet/import-import-type.ts",
      "src/__tests__/snippet/import-type.ts",
    ],
    { quiet: false },
  );
  for (const result of results) {
    expect(await beautify(result[1])).toMatchSnapshot(result[0]);
  }
});
