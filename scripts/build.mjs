import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const path of ["index.html", "privacy.html", "imprint.html", "styles.css", "script.js", "favicon.svg", "404.html", "robots.txt", "sitemap.xml"]) {
  await cp(path, `dist/${path}`);
}

console.log("Static site built in dist/");
