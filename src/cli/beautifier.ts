import prettier from "prettier";

export default async function beautify(str: string): Promise<string> {
  return await prettier.format(str, { parser: "flow" });
}
