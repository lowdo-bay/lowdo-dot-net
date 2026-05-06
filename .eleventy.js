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

  // Shortcode to return just the URL of the largest generated JPEG for a given image.
  // Used to set data-fullsrc on gallery thumbnails so the lightbox can load a full-size image.
  eleventyConfig.addAsyncShortcode("getImageSrc", async function(params) {
    let { src, width = 2400, quality = 85 } = params;
    if (!src) return '';
    src = src.startsWith("/") ? src.slice(1) : src;
    if ((src.startsWith('./') || !src.includes('/')) && this.page && this.page.inputPath) {
      const filename = src.startsWith('./') ? src.slice(2) : src;
      const pathParts = this.page.inputPath.split('/');
      pathParts.pop();
      src = pathParts.join('/') + '/' + filename;
    }
    try {
      const metadata = await Image(src, {
        widths: [width],
        formats: ["jpeg"],
        sharpJpegOptions: { quality },
        urlPath: "/assets/images/",
        outputDir: "./_site/assets/images/",
      });
      const jpegs = metadata.jpeg;
      return jpegs[jpegs.length - 1].url;
    } catch (e) {
      console.error('getImageSrc error for:', src, e.message);
      return '';
    }
  });

  // Add 11ty helmet plugin, for appending elements to <head>
  eleventyConfig.addPlugin(eleventyHelmetPlugin);

  // Filter to extract markdown body (content below frontmatter) from raw input
  eleventyConfig.addFilter("markdownBody", function(rawInput) {
    if (!rawInput) return '';
    const parts = rawInput.split('---');
    // rawInput starts with "---\n...frontmatter...\n---\n...body..."
    // So parts[0] is empty, parts[1] is frontmatter, parts[2+] is body
    if (parts.length < 3) return '';
    return parts.slice(2).join('---').trim();
  });

  // Add support for YAML data files with .yaml extension
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Merge 11ty data instead of overriding values
  eleventyConfig.setDataDeepMerge(true);

  // The projects collection, sorted by the numerical position value and then by date.
  // Excludes ADU library entries — those are surfaced separately at /adu-library/.
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("entries/projects/**/*.md")
      .filter(project => project.data.draft !== true)
      .filter(project => project.data.adu_library !== true)
      .sort((a, b) => b.data.position - a.data.position);
  });

  // ADU library collection — projects that opt in via `adu_library: true`.
  // Sorted by tier (Essential → Standard → Plus) then by sqft (smallest first).
  eleventyConfig.addCollection("aduLibrary", function(collectionApi) {
    const tierOrder = { Essential: 1, Standard: 2, Plus: 3 };
    return collectionApi.getFilteredByGlob("entries/projects/**/*.md")
      .filter(project => project.data.draft !== true)
      .filter(project => project.data.adu_library === true)
      .sort((a, b) => {
        const tierA = tierOrder[a.data.adu?.tier] || 99;
        const tierB = tierOrder[b.data.adu?.tier] || 99;
        if (tierA !== tierB) return tierA - tierB;
        return (a.data.adu?.sqft || 0) - (b.data.adu?.sqft || 0);
      });
  });

  // Unified entries collection (all types, sorted by position then date).
  // ADU library entries are filtered out here so they don't appear in /all/.
  eleventyConfig.addCollection("entries", function(collectionApi) {
    const allEntries = collectionApi.getFilteredByGlob("entries/**/*.md")
      .filter(entry => entry.data.draft !== true)
      .filter(entry => entry.data.adu_library !== true);

    const parseDate = (dateObj) => {
      // For sorting, convert to a comparable format without timezone conversion
      // Extract YYYY-MM-DD portion and convert to a number for comparison
      if (typeof dateObj === 'string') {
        const dateMatch = dateObj.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, year, month, day] = dateMatch;
          return parseInt(`${year}${month}${day}`, 10);
        }
        // Year-only string
        if (/^\d{4}$/.test(dateObj)) {
          return parseInt(`${dateObj}0101`, 10);
        }
      }
      // Year-only number
      if (typeof dateObj === 'number' && dateObj >= 1000 && dateObj <= 9999) {
        return parseInt(`${dateObj}0101`, 10);
      }
      // Date object — extract UTC components to avoid timezone shift
      if (dateObj instanceof Date) {
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        return parseInt(`${year}${month}${day}`, 10);
      }
      // Fallback: use timestamp for sorting
      return new Date(dateObj).getTime();
    };

    return allEntries.sort((a, b) => {
      // Primary sort: position (lower first); null/undefined treated as default 999
      const posA = a.data.position ?? 999;
      const posB = b.data.position ?? 999;
      if (posA !== posB) {
        return posA - posB;
      }
      // Secondary sort: date (newer first)
      // For inactive staff, use endDate if available
      const dateA = (a.data.entryType === 'staff' && a.data.active === false && a.data.endDate)
        ? parseDate(a.data.endDate)
        : parseDate(a.data.date);
      const dateB = (b.data.entryType === 'staff' && b.data.active === false && b.data.endDate)
        ? parseDate(b.data.endDate)
        : parseDate(b.data.date);
      return dateB - dateA;
    });
  });

  // All entries including drafts — used by admin page only
  eleventyConfig.addCollection("allEntries", function(collectionApi) {
    return collectionApi.getFilteredByGlob("entries/**/*.md")
      .filter(entry => !entry.fileSlug.startsWith('_template'))
      .sort((a, b) => {
        const posA = a.data.position ?? 999;
        const posB = b.data.position ?? 999;
        if (posA !== posB) return posA - posB;
        return new Date(b.data.date) - new Date(a.data.date);
      });
  });

  // Collection of all unique entry types from subfolders
  // Includes draft entries so types are always shown in the main filter bar,
  // even when all entries of that type are currently drafts.
  eleventyConfig.addCollection("allEntryTypes", function(collectionApi) {
    const entries = collectionApi.getAll()
      .filter(item => item.data.tags && item.data.tags.includes("entry"));

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
    const allEntries = collectionApi.getAll()
      .filter(item => item.data.tags && item.data.tags.includes("entry"));
    const publishedEntries = allEntries.filter(item => !item.data.draft);

    const categorySet = new Set();
    const entryTypeSet = new Set();

    // Collect entry types from ALL entries (including drafts) so that type
    // names like "EXHIBITION" are always excluded from the category list.
    allEntries.forEach(entry => {
      if (entry.data.entryType && entry.data.entryType !== 'other') {
        entryTypeSet.add(entry.data.entryType.toUpperCase());
      }
    });

    const entries = publishedEntries;

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
  // Supports both relatedProject (single string) and relatedProjects (array of strings)
  eleventyConfig.addCollection("entriesByProject", function(collectionApi) {
    const entries = collectionApi.getFilteredByGlob("entries/**/*.md")
      .filter(entry => entry.data.draft !== true)
      .filter(entry => entry.data.relatedProject || entry.data.relatedProjects);

    const entriesByProject = {};

    entries.forEach(entry => {
      const slugs = [];
      if (entry.data.relatedProjects && Array.isArray(entry.data.relatedProjects)) {
        slugs.push(...entry.data.relatedProjects);
      } else if (entry.data.relatedProject) {
        slugs.push(entry.data.relatedProject);
      }
      slugs.forEach(slug => {
        if (!entriesByProject[slug]) {
          entriesByProject[slug] = [];
        }
        entriesByProject[slug].push(entry);
      });
    });

    return entriesByProject;
  });

  // A filter to limit output of collection items
  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  // Sort staff entries by endDate (desc), falling back to date if endDate absent
  eleventyConfig.addFilter("sortByEndDate", function(arr) {
    return [...arr].sort((a, b) => {
      const aYear = a.data.endDate ?? new Date(a.data.date).getFullYear();
      const bYear = b.data.endDate ?? new Date(b.data.date).getFullYear();
      return bYear - aYear;
    });
  });

  // A filter to limit and randomize output of collection items
  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    const pageArr = arr.filter((page) => page.url !== currPage);
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    return pageArr.slice(0, limit);
  });

  // Filter to return related projects scored by category overlap
  eleventyConfig.addFilter("relatedProjects", (arr, categories, limit, currPage) => {
    const otherProjects = arr.filter((project) => project.url !== currPage);
    const currentCats = Array.isArray(categories)
      ? categories.map(c => String(c).toUpperCase())
      : [];
    const scored = otherProjects.map((project) => {
      const projectCats = Array.isArray(project.data.categories)
        ? project.data.categories.map(c => String(c).toUpperCase())
        : [];
      const overlap = projectCats.filter(c => currentCats.includes(c)).length;
      return { project, overlap };
    });
    scored.sort((a, b) => b.overlap - a.overlap);
    return scored.slice(0, limit).map(item => item.project);
  });

  // ADU helpers ────────────────────────────────────────────────────────────
  // Used by /adu-library/ and the Specifications panel on ADU project pages.

  // Format a single dollar amount as "$XXK" (rounded to nearest thousand)
  eleventyConfig.addFilter("aduFormatPrice", function(n) {
    if (typeof n !== "number") return "";
    return "$" + Math.round(n / 1000) + "K";
  });

  // Format an ADU object's budget as "$LOW–$HIGH" (e.g. "$65K–$95K")
  eleventyConfig.addFilter("aduPriceRange", function(adu) {
    if (!adu || typeof adu.budget_low !== "number" || typeof adu.budget_high !== "number") return "";
    return "$" + Math.round(adu.budget_low / 1000) + "K–$" + Math.round(adu.budget_high / 1000) + "K";
  });

  // Bucket key for budget filtering ("under-100k", "100k-150k", etc.)
  eleventyConfig.addFilter("aduBudgetBucket", function(adu) {
    if (!adu || typeof adu.budget_low !== "number") return "";
    const mid = (adu.budget_low + adu.budget_high) / 2;
    if (mid < 100000) return "under-100k";
    if (mid < 150000) return "100k-150k";
    if (mid < 200000) return "150k-200k";
    return "over-200k";
  });

  // Human-readable stair label
  eleventyConfig.addFilter("aduStairLabel", function(stair) {
    return ({
      "ladder":     "Ladder",
      "spiral":     "Spiral stair",
      "straight":   "Straight stair",
      "switchback": "Switchback stair",
      "none":       "Single-story"
    })[stair] || stair || "";
  });

  // Filter to format Google Fonts font name for use in link URLs
  eleventyConfig.addFilter("formatGoogleFontName", name => {
    return name.replace(/\s/g, '+');
  });

  // Filter to check if a string ends with a given suffix
  eleventyConfig.addFilter("endsWith", (str, suffix) => String(str).endsWith(suffix));

  // Sort featured projects by featuredPosition (ascending); projects without it sort last
  eleventyConfig.addFilter("sortFeatured", function(projects) {
    return [...projects].sort((a, b) => {
      const posA = a.data.featuredPosition ?? Infinity;
      const posB = b.data.featuredPosition ?? Infinity;
      return posA - posB;
    });
  });
  
  // Date formatting (human readable)
  eleventyConfig.addFilter("dateFullYear", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy");
  });

  // Date formatting for index (MMDD YYYY format)
  // Parse dates directly from frontmatter to avoid timezone issues
  eleventyConfig.addFilter("formatDate", (dateObj, format) => {
    // Handle ISO date strings (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ) directly
    if (typeof dateObj === 'string') {
      // Extract just the date portion (YYYY-MM-DD)
      const dateMatch = dateObj.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        const [, year, month, day] = dateMatch;
        if (format === "YYYY") {
          return year;
        }
        if (format === "MMDD") {
          return `${month}${day}`;
        }
      }
      // Handle year-only strings (e.g., "2025")
      if (/^\d{4}$/.test(dateObj)) {
        if (format === "YYYY") {
          return dateObj;
        }
        if (format === "MMDD") {
          return "0101";
        }
      }
    }

    // Handle year-only numbers (e.g., 2025, 2023)
    if (typeof dateObj === 'number' && dateObj >= 1000 && dateObj <= 9999) {
      if (format === "YYYY") {
        return dateObj.toString();
      }
      if (format === "MMDD") {
        return "0101";
      }
    }

    // Handle JavaScript Date objects - use UTC methods to avoid timezone shifts
    if (dateObj instanceof Date) {
      if (format === "MMDD") {
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        return `${month}${day}`;
      }
      if (format === "YYYY") {
        return dateObj.getUTCFullYear().toString();
      }
    }

    // Fallback for other date formats (legacy support)
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
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({"assets/icons/favicon.svg" : "/favicon.svg"});
  eleventyConfig.addPassthroughCopy("projects/**/*.{jpg,jpeg,png,gif,webp,svg,avif}");
  eleventyConfig.addPassthroughCopy("entries/**/*.{jpg,jpeg,png,gif,webp,svg,avif}");
  // Copy toolkit files (all types) from entries
  eleventyConfig.addPassthroughCopy("entries/**/toolkit-*");

  // Copy assets folder to output
  eleventyConfig.addPassthroughCopy("assets");

  // Enable live reload for dev server
  eleventyConfig.setServerOptions({
    liveReload: true
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