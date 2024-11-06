import path from "path";
import { Configuration } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: Configuration = {
	entry: {
		background: "./src/background.ts",
		content: "./src/content.ts",
		popup: "./src/popup.ts",
		injectNoteScript: "./src/injectNoteScript.ts",
		allNotes: "./src/allNotes.ts",
		dash: "./src/dash.ts",
		dashboard: "./src/dashboard.ts",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"), // Outputs to dist directory
		clean: true, // Cleans dist folder before each build
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // For TypeScript files
				use: "ts-loader",
				exclude: /node_modules/, // Exclude node_modules
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(), // Cleans dist/ before each build
		new HtmlWebpackPlugin({
			template: "./pages/popup.html", // Generates popup.html in dist/
			filename: "pages/popup.html", // Output to dist/popup.html
			// chunks: ["popup", "dashboard"], // Only includes popup.js
		}),
		new HtmlWebpackPlugin({
			template: "./pages/dashboard.html", // Generates dashboard.html
			filename: "pages/dashboard.html", // Output to dist/dashboard.html
			chunks: ["dashboard", "dash", "injectNoteScript"], // Include dashboard.js and anotherScript.js
		}),

		new HtmlWebpackPlugin({
			template: "./pages/allNotes.html", // Generates content.html
			filename: "pages/allNotes.html", // Output to dist/content.html
			chunks: ["allNotes"], // Only include content.js
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "public/manifest.json", to: "manifest.json" }, // Copy manifest.json
				{ from: "public/icons/", to: "icons/" }, // Copy icons
				{ from: "css", to: "css" }, // Copy CSS files
				{
					from: "imgs",
					to: "imgs",
					globOptions: {
						ignore: [
							"**/StickItDemo.gif", // Replace with the actual file name
							"**/mike.jpg", // Replace with the actual file name
						],
					},
				},
			],
		}),
	],
	mode: "development", // Change to 'production' when deploying
};

export default config;
