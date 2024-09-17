// jest.config.ts
import { type JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest'

const defaultPreset = createDefaultEsmPreset()

const jestConfig: JestConfigWithTsJest = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  ...defaultPreset,
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts",
    "!**/*.d.ts"
  ],
  transformIgnorePatterns: [
  ],
  preset: "ts-jest/presets/default-esm"
}

export default jestConfig
