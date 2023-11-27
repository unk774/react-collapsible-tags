import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import css from "rollup-plugin-import-css";

export default {
	input: "src/index.tsx",
	output: [
		{
			file: "lib/index.js",
			format: "esm",
			sourcemap: true,
		},
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript({ useTsconfigDeclarationDir: true, sourceMap: true}),
		css()
	],
	external: ["react", "react-dom"],
};