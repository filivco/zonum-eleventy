module.exports = function (eleventyConfig) {
  // ── Filtros ──────────────────────────────────────────────────────────────
  eleventyConfig.addFilter("cop", (n) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n)
  );

  eleventyConfig.addFilter("copM", (n) => {
    // e.g. 450000000 → "$450M COP"
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B COP`;
    if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M COP`;
    return `$${n.toLocaleString("es-CO")} COP`;
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("slug", (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  );

  // ── Passthrough ───────────────────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "static": "." }); // robots.txt, favicon, etc.

  // ── Collections ───────────────────────────────────────────────────────────
  eleventyConfig.addCollection("proyectosList", function (collectionApi) {
    return collectionApi.getFilteredByGlob("proyectos/*.njk");
  });

  // ── Config ────────────────────────────────────────────────────────────────
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_includes",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
