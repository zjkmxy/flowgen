import { compiler, beautify } from "..";
import "../test-matchers";

it("should handle single interface", async () => {
  const ts = `
interface User {
  firstName: string
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
  const result2 = compiler.compileDefinitionString(ts, {
    interfaceRecords: true,
  });
  expect(await beautify(result2)).toMatchSnapshot();
  expect(result2).toBeValidFlowTypeDeclarations();
});

it("should handle interface inheritance", async () => {
  const ts = `
interface User {
  firstName: string
}
interface SpecialUser extends User {
  nice: number
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
  const result2 = compiler.compileDefinitionString(ts, {
    interfaceRecords: true,
  });
  expect(await beautify(result2)).toMatchSnapshot();
  expect(result2).toBeValidFlowTypeDeclarations();

  const result3 = compiler.compileDefinitionString(ts, {
    interfaceRecords: true,
    inexact: false,
  });
  expect(await beautify(result3)).toMatchSnapshot();
  expect(result3).toBeValidFlowTypeDeclarations();
});

it("should handle interface merging", async () => {
  const ts = `
interface User {
  firstName: string
}
interface User {
  lastName: string
}
interface User {
  username: string
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
  const result2 = compiler.compileDefinitionString(ts, {
    interfaceRecords: true,
  });
  expect(await beautify(result2)).toMatchSnapshot();
  expect(result2).toBeValidFlowTypeDeclarations();
});

it("should handle all properties", async () => {
  const ts = `
interface Props {
  color: string;
  [key: string]: string;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

// The following version is not supported by Flow
// it("should handle all properties", async () => {
//   const ts = `
// interface Props {
//   "aria-label": string;
//   color: string;
//   [key: string]: string;
// }
// `;
//   const result = compiler.compileDefinitionString(ts);
//   expect(await beautify(result)).toMatchSnapshot();
//   expect(result).not.toBeValidFlowTypeDeclarations(); // unsupported-syntax
// });

it("should support readonly modifier", async () => {
  const ts = `
interface Helper {
  readonly name: string;
  readonly callback(): void;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should support call signature", async () => {
  const ts = `
  interface ObjectSchema<T> {}
  interface ObjectSchemaDefinition<T> {}
  declare interface ObjectSchemaConstructor {
    <T extends object>(fields?: ObjectSchemaDefinition<T>): ObjectSchema<T>;
    new (): ObjectSchema<{}>;
  }
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should remove this in call signature", async () => {
  const ts = `
interface Arc<This, Datum> {
  (this: This, d: Datum, ...args: any[]): string | null;
}

interface D<This, Datum> {
  new (this: This, d: Datum, ...args: any[]);
}

interface C<This, Datum> {
  (this: This, d: Datum, ...args: any[]);
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should remove generic defaults in call signature", async () => {
  const ts = `
interface AbstractLevelDOWN<K, V> {}
interface AbstractLevelDOWNConstructor {
    <K = any, V = any>(location: string): AbstractLevelDOWN<K, V>;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should support omitting generic defaults in types, classes, interfaces", async () => {
  const ts = `
interface Foo<T = symbol, U = number> {}
interface FooBar extends Foo {}
type Bar<T = number, U = string> = {}
class Baz<T = string, U = number> {}

declare var a: Foo
declare var b: Bar
declare var c: Baz

declare var d: Foo<any>
declare var e: Bar<any>
declare var f: Baz<any>
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should support optional methods", async () => {
  const ts = `
interface Example<State> {
  required<R>(value: any, state: State): true;
  optional?<R>(value: any, state: State): false;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle toString property name", async () => {
  const ts = `
interface A {
  toString(): string;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle untyped object binding pattern", async () => {
  const ts = `
interface ObjectBinding {
  (): void;
  ({}): void;
  ({ a, b }): void;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle untyped array binding pattern", async () => {
  const ts = `
interface ArrayBinding {
  (): void;
  ([]): void;
  ([ a, b ]): void;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle typed object binding pattern", async () => {
  const ts = `
interface ObjectBinding {
  (): void;
  ({}: any): void;
  ({ a, b }: { a: string, b: number }): void;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle typed array binding pattern", async () => {
  const ts = `
interface ArrayBinding {
  (): void;
  ([]: []): void;
  ([ a, b ]: [string, number]): void;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle mutli-extends pattern", async () => {
  const ts = `
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}
interface Square extends Shape, PenStroke {
  sideLength: number;
}
`;
  const result = compiler.compileDefinitionString(ts);
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
