import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// No packages required. Generated pages also work when opened directly from disk.
const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const words = {
  ja: {
    language: '言語', affiliation: '現在の所属', education: '学歴・経歴（Education）',
    educationSub: '学歴', experienceSub: '経歴', research: '研究分野',
    publications: '論文（Publications）', presentations: '発表歴（Presentations）',
    international: '国際会議', domestic: '国内会議・研究会', awards: '受賞歴',
    authorNote: '†を付けた論文を除き、著者名はアルファベット順です。',
    program: 'プログラム', record: '発表情報', awardsNote: '', updated: '最終更新',
  },
  en: {
    language: 'Language', affiliation: 'Current affiliations', education: 'Education & Experience',
    educationSub: 'Education', experienceSub: 'Research experience', research: 'Research areas',
    publications: 'Publications', presentations: 'Presentations',
    international: 'International conferences', domestic: 'Domestic conferences & workshops', awards: 'Awards',
    authorNote: 'Authors are listed in alphabetical order, except for papers marked with †.',
    program: 'Program', record: 'Details', awardsNote: 'Award names are translated from Japanese.', updated: 'Last updated',
  },
};

function render(lang) {
  const w = words[lang];
  const t = field => typeof field === 'object' ? field[lang] : field;
  const prefix = lang === 'en' ? '../' : './';
  const jaHref = lang === 'en' ? '../index.html' : './index.html';
  const enHref = lang === 'en' ? './index.html' : './en/index.html';
  const name = t(data.name);
  const alternateName = data.name[lang === 'ja' ? 'en' : 'ja'];
  const title = data.name.en;
  const description = lang === 'ja'
    ? `${name}の研究者個人サイト。所属、学歴、研究分野、論文、発表歴、受賞歴。`
    : `${name}: affiliations, education, research areas, publications, presentations, and awards.`;
  const link = (url, label) => `<a href="${escape(url)}">${label}</a>`;
  const authors = list => list.map(escape).join(', ');
  const history = (items, className) => `<ul class="${className}">\n${items.map(item => `        <li>${escape(t(item.period))}: ${escape(t(item.institution))} ${escape(t(item.description))}</li>`).join('\n')}\n      </ul>`;
  const talks = (items, international) => `<ul class="talk-list">\n${items.map(item => `        <li>${escape(t(item.date))}: <span lang="en">${authors(item.authors)}.</span> <span${/^[\x00-\x7F]*$/.test(t(item.title)) ? ' lang="en"' : ''}>${escape(t(item.title))}.</span> ${escape(t(item.venue))}. [${link(item.url, international ? w.program : w.record)}]</li>`).join('\n')}\n      </ul>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="alternate" hreflang="ja" href="${jaHref}">
  <link rel="alternate" hreflang="en" href="${enHref}">
  <link rel="stylesheet" href="${prefix}assets/style.css">
  <script src="${prefix}assets/main.js" defer></script>
</head>
<body id="top">
  <header>
    <nav aria-label="${w.language}"><a href="${jaHref}" lang="ja" hreflang="ja" ${lang === 'ja' ? 'aria-current="page"' : 'data-language-link'}>日本語</a> | <a href="${enHref}" lang="en" hreflang="en" ${lang === 'en' ? 'aria-current="page"' : 'data-language-link'}>English</a></nav>
    <h1>${escape(name)} <span lang="${lang === 'ja' ? 'en' : 'ja'}">(${escape(alternateName)})</span></h1>
    <p>${link(data.researchmap + (lang === 'en' ? '?lang=en' : ''), 'researchmap')} / ${link(data.orcid, 'ORCID')} / ${link(data.dblp, 'dblp')}</p>
  </header>
  <main id="main">
    <section id="affiliations">
      <h2>${w.affiliation}</h2>
      <ul>
${data.affiliations.map(item => `        <li>${escape(t(item.institution))} ${escape(t(item.department))} (${escape(t(item.position))})</li>`).join('\n')}
      </ul>
    </section>
    <section id="education">
      <h2>${w.education}</h2>
      <h3>${w.educationSub}</h3>
      ${history(data.education, 'education-list')}
      <h3>${w.experienceSub}</h3>
      ${history(data.experience, 'experience-list')}
    </section>
    <section id="research">
      <h2>${w.research}</h2>
      <ul>
        <li>${escape(t(data.field))}</li>
      </ul>
    </section>
    <section id="publications">
      <h2>${w.publications}</h2>
      <p>${w.authorNote}</p>
      <ul class="publication-list">
${data.publications.map(item => `        <li class="publication" lang="en">${item.nonAlphabeticalAuthors ? '† ' : ''}${authors(item.authors)}. ${link(item.doi, escape(item.title))}. <i>${escape(item.venue)}</i>, ${escape(item.details)}. [${link(item.doi, 'DOI')}] [${link(item.pdf, 'PDF')}]${item.preprint ? ` [${link(item.preprint, 'arXiv')}]` : ''}</li>`).join('\n')}
      </ul>
    </section>
    <section id="presentations">
      <h2>${w.presentations}</h2>
      <h3>${w.international}</h3>
      ${talks(data.presentations.international, true)}
      <h3>${w.domestic}</h3>
      ${talks(data.presentations.domestic, false)}
    </section>
    <section id="awards">
      <h2>${w.awards}</h2>
      <ul class="award-list">
${data.awards.map(item => `        <li>${escape(t(item.date))}: ${link(item.url, escape(t(item.title)))} — ${escape(t(item.organization))}</li>`).join('\n')}
      </ul>
      ${w.awardsNote ? `<p>${w.awardsNote}</p>` : ''}
    </section>
  </main>
  <footer><p>${w.updated}: <time datetime="${data.updated}">${data.updated}</time></p></footer>
</body>
</html>
`;
}

await mkdir(path.join(root, 'en'), { recursive: true });
await writeFile(path.join(root, 'index.html'), render('ja'), 'utf8');
await writeFile(path.join(root, 'en/index.html'), render('en'), 'utf8');
console.log('Generated index.html and en/index.html.');
