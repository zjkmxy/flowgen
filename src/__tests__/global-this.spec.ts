import { compiler, beautify } from "..";
import "../test-matchers";

it("should not crash when getting globalThis in code", async () => {
  const ts = `import * as React from 'react';
export default class MenuStatefulContainer extends React.Component {
  handleItemClick: (
    event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) => void = () => {};
  render(): React.ReactNode { return undefined; };
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
