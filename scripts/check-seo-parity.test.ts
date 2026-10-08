import { compareSignals } from "./check-seo-parity";
import { extractSignals } from "./lib/page-signals";

const html = `<html><head>
  <title>About Us - Example</title>
  <meta name="description" content="Who  we are">
  <link rel="canonical" href="https://example.com/about/">
  <meta name="robots" content="index, follow">
  <meta property="og:image" content="https://example.com/img/about.jpg">
</head><body></body></html>`;

describe("extractSignals", () => {
  it("reads the head", () => {
    expect(extractSignals(html)).toEqual({
      title: "About Us - Example",
      description: "Who we are",
      canonical: "https://example.com/about/",
      indexable: true,
      ogImage: "https://example.com/img/about.jpg",
    });
  });
});

describe("compareSignals", () => {
  const served = extractSignals(html);

  it("passes a matching page, comparing URLs by path", () => {
    expect(
      compareSignals(
        "/about/",
        { title: "About Us - Example", description: "Who we are", ogImage: "/img/about.jpg" },
        served
      )
    ).toEqual([]);
  });

  it("reports each difference", () => {
    const findings = compareSignals(
      "/about/",
      { title: "About", description: "Old", noIndex: true, canonicalPath: "/team/" },
      served
    );
    expect(findings.map((finding) => finding.field)).toEqual([
      "title",
      "description",
      "canonical",
      "indexable",
    ]);
  });
});
