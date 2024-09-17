import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle exported es module functions", async () => {
  const ts = `
class Action {}
class RouterState {}
class Store<T> {}
class SyncHistoryWithStoreOptions {}
class HistoryUnsubscribe {}

export function routerReducer(state?: RouterState, action?: Action): RouterState;
export function syncHistoryWithStore(history: History, store: Store<any>, options?: SyncHistoryWithStoreOptions): History & HistoryUnsubscribe;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle toString function overload", async () => {
  const ts = `export function toString(): void;
export function toString(e: number): void;
export function toString(b: string): void;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle default exported es module functions", async () => {
  const ts = `
class Action {}
class RouterState {}

export default function routerReducer(state?: RouterState, action?: Action): RouterState;`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle function overload es module functions", async () => {
  const ts = `
class Action {}
class RouterState {}

export function routerReducer(state?: RouterState, action?: Action): RouterState;
export function routerReducer(state?: RouterState): RouterState;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should remove this annotation from functions", async () => {
  const ts =
    "function addClickListener(onclick: (this: void, e: Event) => void): void;";
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should remove default parameters from functions", async () => {
  const ts =
    "function addClickListener<T = Error>(onclick: (e: Event) => void): T;";
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should not break with Promise return types - issue 156", async () => {
  const ts = "export declare const fn: () => Promise<void>;";
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
