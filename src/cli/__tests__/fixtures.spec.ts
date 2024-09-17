import compiler from "../compiler";
import beautify from "../beautifier";
import "../../test-matchers";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("handles the danger.d.ts correctly", async () => {
  const dangerDTS = fs.readFileSync(
    `${__dirname}/fixtures/danger.d.ts`,
    "utf8",
  );
  const result = compiler.compileDefinitionString(dangerDTS, { quiet: true });

  expect(await beautify(result)).toMatchSnapshot();
  expect(result).toBeValidFlowTypeDeclarations();
});
