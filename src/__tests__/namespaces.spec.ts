import { compiler, beautify } from "..";
import "../test-matchers";

describe("should handle merging with other types", () => {
  describe("function", () => {
    test("interface", async () => {
      const ts = `
declare function test(foo: number): string;
namespace test {
  export interface Foo {
    bar: number
  }
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
      expect(result).toBeValidFlowTypeDeclarations();
    });

    test("type", async () => {
      const ts = `
declare function test(foo: number): string;
namespace test {
  export type Foo = {
    bar: number
  }
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
      expect(result).toBeValidFlowTypeDeclarations();
    });

    test("const", async () => {
      const ts = `
declare function test(foo: number): string;
namespace test {
  export const ok: number
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
      expect(result).toBeValidFlowTypeDeclarations();
    });
  });

  test("class", async () => {
    const ts = `
declare class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export declare class AlbumLabel { }
}
`;
    const result = compiler.compileDefinitionString(ts);
    expect(await beautify(result)).toMatchSnapshot();
    expect(result).toBeValidFlowTypeDeclarations();
  });

  test("enum", async () => {
    const ts = `
// TODO: implement enum merging
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4
}
namespace Color {
  export declare function mixColor(colorName: string): number;
}
`;
    const result = compiler.compileDefinitionString(ts);
    expect(await beautify(result)).toMatchSnapshot();
    expect(result).toBeValidFlowTypeDeclarations(); // TODO: prop-missing
  });
});

it("should handle namespaces", async () => {
  const ts = `
namespace test {
  export const ok: number
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle namespace merging", async () => {
  const ts = `
namespace test {
  export const ok: number
}
namespace test {
  export const error: string
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle namespace function merging", async () => {
  const ts = `
namespace test {
  declare function test(err: number): void
}
namespace test {
  declare function test(response: string): string
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle exported interfaces and types", async () => {
  const ts = `
namespace Example {
  export interface StoreModel<S> {}
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

it("should handle nested namespaces", async () => {
  const ts = `
import * as external from "external";

declare namespace E0 {
  type A = external.type;
  namespace U1 {
    declare interface S3 {
      a: string;
    }
  }
  namespace U1 {
    declare var e2: number;
    enum E2 {
      E = 1,
    }
    declare interface S3 {
      b: string;
    }
    namespace D1 {
      namespace S2 {
        declare interface S3 {
          b: string;
        }
        declare var n3: symbol;
        class N3 {}
      }
    }
    namespace DD1 {
      namespace S2 {
        declare interface S3 {
          e: number;
        }
      }
    }
  }
  namespace S1 {
    declare var m3: string;
  }
  declare var s1: string;
}
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations(); // cannot-resolve-module
});

describe("should handle nested namespace merging", () => {
  describe("function", () => {
    test("interface", async () => {
      const ts = `
namespace ns {
  declare function test(foo: number): string;
  namespace test {
    export interface Foo {
      bar: number
    }
  }
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
    });

    test("type", async () => {
      const ts = `
namespace ns {
  declare function test(foo: number): string;
  namespace test {
    export type Foo = {
      bar: number
    }
  }
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
    });

    test("const", async () => {
      const ts = `
namespace ns {
  declare function test(foo: number): string;
  namespace test {
    export const ok: number
  }
}
`;
      const result = compiler.compileDefinitionString(ts);
      expect(await beautify(result)).toMatchSnapshot();
    });
  });

  test("class", async () => {
    const ts = `
namespace ns {
  declare class Album {
    label: ns.Album.AlbumLabel;
  }
  namespace Album {
    export declare class AlbumLabel { }
  }
}
`;
    const result = compiler.compileDefinitionString(ts);
    expect(await beautify(result)).toMatchSnapshot();
  });

  test("enum", async () => {
    const ts = `
namespace ns {
  // TODO: implement enum merging inside namespaces
  enum Color {
    Red = 1,
    Green = 2,
    Blue = 4
  }
  namespace Color {
    export declare function mixColor(colorName: string): number;
  }
}
`;
    const result = compiler.compileDefinitionString(ts);
    expect(await beautify(result)).toMatchSnapshot();
  });
});

test("should handle qualified namespaces", async () => {
  const ts = `
declare namespace A.B {
  interface S<A> {
    readonly d: A;
    b: number;
}
  declare class D<S> {}
}

declare namespace A.B.C {
  declare class N<A> extends D<A> implements S<A> {
    a: string;
  }
}`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations(); // TODO: type-as-value
});

test("should handle global augmentation", async () => {
  const ts = `
declare global {
  interface Array<T> {}
}`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});

test("should handle import equals declaration", async () => {
  const ts = `
namespace A {
  export type B = string;
}
import hello = A.B;
`;
  const result = compiler.compileDefinitionString(ts, { quiet: true });
  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
