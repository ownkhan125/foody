import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals"),{"rules": {
    "react/function-component-definition": "off", // Disable the rule
    "react-hooks/rules-of-hooks": "off" // Disable hooks rule (optional, be cautious)
  }}];

export default eslintConfig;
