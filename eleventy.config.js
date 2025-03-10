const numeral = require("numeral");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { execSync } = require('child_process')

module.exports = function(eleventyConfig) {
	eleventyConfig.ignores.add("README.md");

	// eleventyConfig.setServerPassthroughCopyBehavior("copy");

	eleventyConfig.addPassthroughCopy("assets/");
	eleventyConfig.addPassthroughCopy("img/");
	eleventyConfig.addPassthroughCopy("video/");
	eleventyConfig.addPassthroughCopy({
		"public/avatar.jpg": "avatar.jpg",
	})
	eleventyConfig.addPassthroughCopy({
		"node_modules/@11ty/is-land/is-land.js": "assets/is-land.js",
	});

	eleventyConfig.addJavaScriptFunction("avatarUrl", function avatarUrl(url) {
		return `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(url)}/`;
	});

	eleventyConfig.addJavaScriptFunction("renderNumber", function renderNumber(num) {
		if(typeof num === "string") {
			num = parseInt(num, 10);
		}
		return numeral(num).format("0,0");
	});

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	// Set global permalinks to resource.html style
	eleventyConfig.addGlobalData("permalink", () => {
		return (data) =>
			`${data.page.filePathStem}.${data.page.outputFileExtension}`;
	});

	// Remove .html from `page.url` entries
	eleventyConfig.addUrlTransform((page) => {
		if (page.url.endsWith(".html")) {
			return page.url.slice(0, -1 * ".html".length);
		}
	});

	eleventyConfig.addUrlTransform((page) => {
		if (page.url.length !== "/" && page.url.endsWith("/")) {
			return page.url.slice(0, -1);
		}
	});

	// pagefind search plugin
	eleventyConfig.on('eleventy.after', () => {
		console.log('[pagefind] Creating search index.');
		execSync(`npx pagefind --source _site --glob \"[0-9]*.html\"`, { encoding: 'utf-8' });
	});

  return {
    pathPrefix: "/tweets/"
  }
};