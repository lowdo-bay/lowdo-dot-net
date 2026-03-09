import { DateTime } from "luxon";
import CleanCSS from "clean-css";
import UglifyJS from "uglify-js";
import htmlmin from "html-minifier";
import yaml from "js-yaml";
import slugify from "slugify";
import eleventyHelmetPlugin from "eleventy-plugin-helmet";
import EleventyFetch from "@11ty/eleventy-fetch";
import Image from "@11ty/eleventy-img";
import MarkdownIt from "markdown-it";
const mdRender = new MarkdownIt(); 

export default function(eleventyConfig) {

  eleventyConfig.addFilter("renderUsingMarkdown", function(rawString) {
    return mdRender.render(rawString);
  });

  // https://www.11ty.dev/docs/plugins/image/
  // Generate PNG icon files and a link tag from a source SVG or PNG file
  eleventyConfig.addShortcode("favicon", async function(src) {

    // Remove preceding slash from image path if it exists
    src = src.startsWith("/") ? src.slice(1) : src;

        let metadata = await Image(src, {
            widths: [48,192,512],
            formats: ["png"],
      urlPath: "/",
      outputDir: "./_site/",
      filenameFormat: function (id, src, width, format, options) {
            const name = "favicon";
        return `${name}-${width}.${format}`;
      }
        });

    // Build the icon link tag
    let data = metadata.png[0];
        return `<link rel="icon" href="${data.url}" type="image/png">`;

    });

// Shortcode to generate a responsive project image
eleventyConfig.addAsyncShortcode("generateImage", async function(params) {

  let {
    src,
    alt = "",
    classes = "",
    loadingType = "lazy",
    viewportSizes = "",
    outputWidths = ["1080","1800","2400"],
    outputFormats = ["jpeg"],
    outputQualityJpeg = 75,
    outputQualityWebp = 75,
    outputQualityAvif = 75
  } = params;

  // Add validation
  if (!src) {
    console.error('generateImage shortcode called without src:', params);
    return '';
  }

  // Remove leading slash from image paths if present
  src = src.startsWith("/") ? src.slice(1) : src;

  // Handle relative paths (./ or just filename)
  if ((src.startsWith('./') || !src.includes('/')) && this.page && this.page.inputPath) {
    const filename = src.startsWith('./') ? src.slice(2) : src;
    const inputPath = this.page.inputPath;
    const pathParts = inputPath.split('/');
    pathParts.pop();
    src = pathParts.join('/') + '/' + filename;
  }

  let metadata;
  try {
    metadata = await Image(src, {
      widths: outputWidths,
      sharpJpegOptions: { quality: outputQualityJpeg },
      sharpWebpOptions: { quality: outputQualityWebp },
      sharpAvifOptions: { quality: outputQualityAvif },
      formats: outputFormats,
      urlPath: "/assets/images/",
      outputDir: "./_site/assets/images/",
      // cacheOptions: {
      //   // If image is a remote URL, this is the amount of time before 11ty fetches a fresh copy
      //   duration: "5y",
      //   directory: ".cache",
      //   removeUrlQueryParams: true,
      // },
    });
  } catch (error) {
    console.error('Image processing error for:', src);
    console.error('Error:', error.message);
    return ''; // Return empty string on error
  }

    let lowsrc = metadata.jpeg ? metadata.jpeg[0] : Object.values(metadata)[0][0];

    let orientation;

    // Detect and set image orientation
    if (lowsrc.width > lowsrc.height) {
      orientation = "landscape";
    } else if (lowsrc.width < lowsrc.height) {
      orientation = "portrait";
    } else {
      orientation = "square";
    }

    return `<picture class="${classes}" data-orientation="${orientation}">
            ${Object.values(metadata).map(imageFormat => {
                return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${viewportSizes}">`;
            }).join("\n")}
                <img
                    src="${lowsrc.url}"
                    width="${lowsrc.width}"
                    height="${lowsrc.height}"
                    alt="${alt}"
          class="hover-fade"
                    loading="${loadingType}"
                    decoding="async">
              </picture>`;
  
  });

  // Add 11ty helmet plugin, for appending elements to <head>
  eleventyConfig.addPlugin(eleventyHelmetPlugin);

  // Add support for YAML data files with .yaml extension
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Merge 11ty data instead of overriding values
  eleventyConfig.setDataDeepMerge(true);

  // The projects collection, sorted by the numerical position value and then by date
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("projects/**/*.md")
      //.filter(project => !Boolean(project.data.draft))
      .sort((a, b) => b.data.position - a.data.position);
  });

  // Unified entries collection (all types, sorted by position then date)
  eleventyConfig.addCollection("entries", function(collectionApi) {
    const allEntries = collectionApi.getFilteredByGlob("entries/**/*.md")
      .filter(entry => entry.data.draft !== true);

    return allEntries.sort((a, b) => {
      // Primary sort: position (lower first)
      if (a.data.position !== b.data.position) {
        return a.data.position - b.data.position;
      }
      // Secondary sort: date (newer first)
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Collection of all unique entry types from subfolders
  eleventyConfig.addCollection("allEntryTypes", function(collectionApi) {
    const entries = collectionApi.getAll()
      .filter(item => item.data.tags && item.data.tags.includes("entry"))
      .filter(item => !item.data.draft);

    const typeSet = new Set();

    entries.forEach(entry => {
      if (entry.data.entryType && entry.data.entryType !== 'other') {
        typeSet.add(entry.data.entryType.toUpperCase());
      }
    });

    return Array.from(typeSet).sort();
  });

  // Collection of all unique categories from entries (excluding entry types)
  eleventyConfig.addCollection("allCategories", function(collectionApi) {
    const entries = collectionApi.getAll()
      .filter(item => item.data.tags && item.data.tags.includes("entry"))
      .filter(item => !item.data.draft);

    const categorySet = new Set();
    const entryTypeSet = new Set();

    // First, collect all entry types
    entries.forEach(entry => {
      if (entry.data.entryType && entry.data.entryType !== 'other') {
        entryTypeSet.add(entry.data.entryType.toUpperCase());
      }
    });

    // Then collect categories, excluding entry types
    entries.forEach(entry => {
      if (entry.data.categories && Array.isArray(entry.data.categories)) {
        entry.data.categories.forEach(cat => {
          const upperCat = cat.toUpperCase();
          // Only add if it's not an entry type
          if (!entryTypeSet.has(upperCat)) {
            categorySet.add(upperCat);
          }
        });
      }
    });

    return Array.from(categorySet).sort();
  });

  // Group entries by project for Awards & Recognition display
  eleventyConfig.addCollection("entriesByProject", function(collectionApi) {
    const entries = collectionApi.getFilteredByGlob("entries/**/*.md")
      .filter(entry => entry.data.draft !== true)
      .filter(entry => entry.data.relatedProject); // Only entries with relatedProject field

    const entriesByProject = {};

    entries.forEach(entry => {
      const projectSlug = entry.data.relatedProject;
      if (!entriesByProject[projectSlug]) {
        entriesByProject[projectSlug] = [];
      }
      entriesByProject[projectSlug].push(entry);
    });

    return entriesByProject;
  });

  // A filter to limit output of collection items
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  // A filter to limit and randomize output of collection items
  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    const pageArr = arr.filter((page) => page.url !== currPage);
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    return pageArr.slice(0, limit);
  });

  // Filter to format Google Fonts font name for use in link URLs
  eleventyConfig.addFilter("formatGoogleFontName", name => {
    return name.replace(/\s/g, '+');
  });
  
  // Date formatting (human readable)
  eleventyConfig.addFilter("dateFullYear", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  // Date formatting for index (MMDD YYYY format)
  eleventyConfig.addFilter("formatDate", (dateObj, format) => {
    const date = new Date(dateObj);
    if (format === "MMDD") {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}${day}`;
    }
    if (format === "YYYY") {
      return date.getFullYear().toString();
    }
    return DateTime.fromJSDate(date).toFormat(format || "yyyy");
  });

  // base64 encode a string
  eleventyConfig.addFilter("encodeURL", function(url) {
    return encodeURIComponent(url);
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && typeof outputPath === 'string' && outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Create a hash from date (e.g. for permalinks)
  eleventyConfig.addFilter("hashFromDate", dateObj => {
    return new Number(DateTime.fromJSDate(dateObj)).toString(36);
  });

  // Universal slug filter makes-strict-urls-like-this
  eleventyConfig.addFilter("slug", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      strict: true
    });
  });

  // Shortcode to download, cache, and minify Google Fonts CSS to reduce HTTP requests on the front-end
  // TODO Consider downloading the font file itself and storing in the build cache
  eleventyConfig.addShortcode("googleFontsCss", async function(url) {

    let fontCss = await EleventyFetch(url, {
      duration: "1d",
      type: "text",
      fetchOptions: {
        headers: {
          // Google Fonts API serves font formats based on the browser user-agent header
          // So here we pretend to be a browser... in this case, Chrome 74 on MacOS 14
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        }
      }
    });

    //return fontCss;
    return new CleanCSS({}).minify(fontCss).styles;
  
  });

  // Copy folders or static assets e.g. images to site output
  eleventyConfig.addPassthroughCopy({"assets/icons/favicon.svg" : "/favicon.svg"});
  eleventyConfig.addPassthroughCopy("projects/**/*.{jpg,jpeg,png,gif,webp,svg,avif}");
  eleventyConfig.addPassthroughCopy("entries/**/*.{jpg,jpeg,png,gif,webp,svg,avif}");
  // Copy toolkit files (all types) from entries
  eleventyConfig.addPassthroughCopy("entries/**/toolkit-*");

  // Copy assets folder to output
  eleventyConfig.addPassthroughCopy("assets");

  // Disable 11ty dev server live reload when using CMS locally
  eleventyConfig.setServerOptions({
    liveReload: false
  });

  return {
    templateFormats: ["md", "njk", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};