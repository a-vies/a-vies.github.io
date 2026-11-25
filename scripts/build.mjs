import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

for (const path of ["index.html", "about.html", "privacy.html", "imprint.html", "styles.css", "script.js", "favicon.svg", "404.html", "robots.txt", "sitemap.xml"]) {
  await cp(path, `dist/${path}`);
}
await cp("images", "dist/images", { recursive: true });
await mkdir("dist/logo", { recursive: true });
await cp("logo/avies-logo-small.png", "dist/logo/avies-logo-small.png");

const categories = [
  {
    slug: "chuyen-gia",
    title: "Gương mặt chuyên gia",
    description: "Câu chuyện và hành trình của các chuyên gia trong mạng lưới AVIES.",
    changefreq: "monthly"
  },
  {
    slug: "tin-tuc",
    title: "Tin tức hoạt động",
    description: "Cập nhật các hoạt động, sự kiện và dấu mốc của Hội.",
    changefreq: "weekly"
  },
  {
    slug: "chuyen-mon",
    title: "Góc nhìn chuyên môn",
    description: "Phân tích và chia sẻ chuyên sâu từ các chuyên gia trong Hội.",
    changefreq: "monthly"
  }
];

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

const formatDate = (date) => `${date.slice(6, 8)}.${date.slice(4, 6)}.${date.slice(0, 4)}`;
const parseMarkdownFile = (contents, file) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(contents);
  if (!match) {
    throw new Error(`Markdown article must start with YAML-style front matter: ${file}`);
  }

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([a-zA-Z]+):\s*(.*?)\s*$/.exec(line);
    if (!field) throw new Error(`Invalid Markdown front matter in ${file}: ${line}`);
    const [, key, rawValue] = field;
    if (!["title", "summary", "image", "author", "sourceUrl", "sourceLabel"].includes(key) || Object.hasOwn(metadata, key)) {
      throw new Error(`Unsupported or duplicate Markdown front matter field in ${file}: ${key}`);
    }

    try {
      metadata[key] = rawValue.startsWith('"')
        ? JSON.parse(rawValue)
        : rawValue;
    } catch (error) {
      throw new Error(`Invalid quoted Markdown front matter value in ${file}: ${key}`, { cause: error });
    }
    if (typeof metadata[key] !== "string") {
      throw new Error(`Markdown front matter values must be strings in ${file}: ${key}`);
    }
  }

  return { ...metadata, markdown: match[2] };
};

const renderInlineMarkdown = (text) => {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let html = "";
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    html += escapeHtml(text.slice(cursor, match.index));
    if (match[1] !== undefined) {
      html += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noreferrer">${escapeHtml(match[1])}</a>`;
    } else if (match[3] !== undefined) {
      html += `<code>${escapeHtml(match[3])}</code>`;
    } else if (match[4] !== undefined) {
      html += `<strong>${escapeHtml(match[4])}</strong>`;
    } else {
      html += `<em>${escapeHtml(match[5])}</em>`;
    }
    cursor = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(cursor));
};

const renderMarkdown = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  const images = [];
  let paragraph = [];
  let list = null;
  let code = null;
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(`<${list.type}>${list.items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${list.type}>`);
      list = null;
    }
  };

  for (const line of lines) {
    if (code) {
      if (/^```\s*$/.test(line)) {
        blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }
    if (/^```\s*$/.test(line)) {
      flushParagraph();
      flushList();
      code = [];
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    const listItem = /^\s*([-*+]|\d+\.)\s+(.+)$/.exec(line);
    const image = /^!\[([^\]]*)\]\(([^\s)]+)(?: "([^"]*)")?\)\s*$/.exec(line);
    if (!listItem) flushList();
    if (heading || listItem || image || /^!\[/.test(line) || /^\s*$/.test(line) || /^>\s?/.test(line) || /^---+$/.test(line)) {
      flushParagraph();
    }
    if (!line.trim()) continue;
    if (image) {
      const [, alt, src, caption] = image;
      images.push(src);
      blocks.push(`<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />${caption !== undefined ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`);
    } else if (/^!\[/.test(line)) {
      throw new Error(`Invalid Markdown image: ${line}`);
    } else if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
    } else if (listItem) {
      const type = /^\d/.test(listItem[1]) ? "ol" : "ul";
      if (list && list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push(listItem[2]);
    } else if (/^>\s?/.test(line)) {
      blocks.push(`<blockquote><p>${renderInlineMarkdown(line.replace(/^>\s?/, ""))}</p></blockquote>`);
    } else if (/^---+$/.test(line)) {
      blocks.push("<hr />");
    } else {
      paragraph.push(line.trim());
    }
  }

  if (code) throw new Error("Unclosed fenced code block in Markdown article.");
  flushParagraph();
  flushList();
  return { html: blocks.join("\n"), images };
};

const validateImage = async (image, file, category) => {
  if (typeof image !== "string" || !/^images\/[a-z0-9-]+\.(svg|webp|png|jpe?g|avif)$/.test(image)) {
    throw new Error(`Article image must point to a local file under content/${category.slug}/images/: content/${category.slug}/${file}`);
  }
  try {
    await access(join("content", category.slug, image));
  } catch (error) {
    throw new Error(`Article image file does not exist: content/${category.slug}/${image}`, { cause: error });
  }
};

const validateArticle = async (article, file, category) => {
  const filenameMatch = /^(\d{8})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(file);
  if (!filenameMatch) {
    throw new Error(`Invalid article filename in content/${category.slug}: ${file}. Use YYYYMMDD-slug.md.`);
  }

  const [, date, slug] = filenameMatch;
  const isoDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  const parsedDate = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== isoDate) {
    throw new Error(`Invalid date in article filename: content/${category.slug}/${file}`);
  }
  if (!article || typeof article.title !== "string" || !article.title.trim()) {
    throw new Error(`Article title is required: content/${category.slug}/${file}`);
  }
  if (typeof article.summary !== "string" || !article.summary.trim()) {
    throw new Error(`Article summary is required: content/${category.slug}/${file}`);
  }
  await Promise.all([article.image, ...article.bodyImages].map((image) => validateImage(image, file, category)));
  if (article.author !== undefined && typeof article.author !== "string") {
    throw new Error(`Article author must be a string: content/${category.slug}/${file}`);
  }
  if (article.sourceUrl !== undefined) {
    let sourceUrl;
    try {
      sourceUrl = new URL(article.sourceUrl);
    } catch (error) {
      throw new Error(`Invalid article source URL: content/${category.slug}/${file}`, { cause: error });
    }
    if (!["http:", "https:"].includes(sourceUrl.protocol)) {
      throw new Error(`Article source URL must use HTTP or HTTPS: content/${category.slug}/${file}`);
    }
  }
  if (article.sourceLabel !== undefined && typeof article.sourceLabel !== "string") {
    throw new Error(`Article source label must be a string: content/${category.slug}/${file}`);
  }
  if (typeof article.bodyHtml !== "string" || !article.bodyHtml.trim()) {
    throw new Error(`Article body must not be empty: content/${category.slug}/${file}`);
  }

  return { ...article, date, slug, outputFile: file.replace(/\.(json|md)$/, ".html") };
};

const pageHeader = (title, description, prefix) => `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(title)} — AVIES</title>
    <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${prefix}styles.css" />
  </head>
  <body>
    <header class="content-header">
      <a class="brand" href="${prefix}" aria-label="AVIES — Trang chủ"><img class="brand-logo" src="${prefix}logo/avies-logo-small.png" alt="" /><span class="brand-name"><strong>AVIES</strong><small>Vietnamese Intellectuals &amp; Experts<br />in Switzerland</small></span></a>
      <nav class="content-links" aria-label="Điều hướng">
        <a href="${prefix}about.html">About AVIES</a>
        <a class="content-home" href="${prefix}">Trang chủ</a>
      </nav>
    </header>`;

const pageFooter = `<footer class="content-footer">© AVIES · <a href="../privacy.html">Bảo vệ dữ liệu</a> · <a href="../imprint.html">Thông tin website</a></footer>
    <script src="../script.js" defer></script>
  </body>
</html>`;

const sitemapEntries = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/about.html", changefreq: "monthly", priority: "0.8" },
  { path: "/privacy.html", changefreq: "yearly", priority: "0.3" },
  { path: "/imprint.html", changefreq: "yearly", priority: "0.3" }
];
for (const category of categories) {
  const sourceDirectory = join("content", category.slug);
  const files = (await readdir(sourceDirectory)).filter((file) => file.endsWith(".md") && !file.startsWith("_"));
  const articles = await Promise.all(files.map(async (file) => {
    const sourcePath = join(sourceDirectory, file);
    const article = parseMarkdownFile(await readFile(sourcePath, "utf8"), sourcePath);
    const body = renderMarkdown(article.markdown);
    return { ...await validateArticle({ ...article, bodyHtml: body.html, bodyImages: body.images }, file, category), file };
  }));
  articles.sort((left, right) => right.date.localeCompare(left.date) || left.file.localeCompare(right.file));

  const outputDirectory = join("dist", category.slug);
  await mkdir(outputDirectory, { recursive: true });
  await cp(join(sourceDirectory, "images"), join(outputDirectory, "images"), { recursive: true });
  const articleLinks = articles.length
    ? articles.map((article) => `<a class="content-list-item" href="${article.outputFile}">
        <img class="content-card-image" src="${escapeHtml(article.image)}" alt="" loading="lazy" decoding="async" />
        <div class="content-card-copy">
          <time datetime="${article.date.slice(0, 4)}-${article.date.slice(4, 6)}-${article.date.slice(6, 8)}">${formatDate(article.date)}</time>
          <h2>${escapeHtml(article.title)}</h2>
          <p>${escapeHtml(article.summary)}</p>
          ${article.author ? `<span class="content-author">${escapeHtml(article.author)}</span>` : ""}
          <strong class="content-card-link">Đọc bài viết <span aria-hidden="true">↗</span></strong>
        </div>
      </a>`).join("\n      ")
    : `<p class="content-empty">Bài viết mới sẽ được cập nhật tại đây.</p>`;
  const listingPage = `${pageHeader(category.title, category.description, "../")}
    <main class="content-page section">
      <div class="content-page-inner">
        <p class="eyebrow">Nội dung AVIES</p>
        <h1>${escapeHtml(category.title)}</h1>
        <p class="content-lead">${escapeHtml(category.description)}</p>
        <div class="content-list">${articleLinks}</div>
        <a class="content-back" href="../#noi-dung">← Tất cả chuyên mục</a>
      </div>
    </main>
    ${pageFooter}`;
  await writeFile(join(outputDirectory, "index.html"), listingPage);
  sitemapEntries.push({ path: `/${category.slug}/`, changefreq: category.changefreq, priority: "0.7" });

  for (const article of articles) {
    const articlePage = `${pageHeader(article.title, article.summary, "../")}
    <main class="content-page section">
      <div class="content-page-inner">
        <a class="content-back" href="./">← ${escapeHtml(category.title)}</a>
        <article>
          <p class="eyebrow">${escapeHtml(category.title)}</p>
          <time class="article-date" datetime="${article.date.slice(0, 4)}-${article.date.slice(4, 6)}-${article.date.slice(6, 8)}">${formatDate(article.date)}</time>
          <h1>${escapeHtml(article.title)}</h1>
          <img class="article-hero-image" src="${escapeHtml(article.image)}" alt="" />
          ${article.author ? `<p class="content-lead">${escapeHtml(article.author)}</p>` : ""}
          <div class="article-content">${article.bodyHtml}</div>
          ${article.sourceUrl ? `<p class="article-source">Nguồn tham khảo: <a href="${escapeHtml(article.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(article.sourceLabel || article.sourceUrl)}</a></p>` : ""}
        </article>
        <a class="content-back" href="./">← ${escapeHtml(category.title)}</a>
      </div>
    </main>
    ${pageFooter}`;
    await writeFile(join(outputDirectory, article.outputFile), articlePage);
    sitemapEntries.push({
      path: `/${category.slug}/${article.outputFile}`,
      changefreq: "monthly",
      priority: "0.6"
    });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map((entry) => `  <url><loc>https://avies.github.io${entry.path}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`).join("\n")}
</urlset>
`;
await writeFile("dist/sitemap.xml", sitemap);

console.log("Static site built in dist/");
