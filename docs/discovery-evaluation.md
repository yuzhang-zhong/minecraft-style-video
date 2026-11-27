# Skill discovery evaluation

Use this protocol when release metadata, README positioning, `llms.txt`, or `SKILL.md` discovery text changes. It verifies whether `minecraft-style-video` can be found across GitHub Skill Search, web search engines, and multi-model RAG workflows across 32 structured queries.

## Automated preflight

```bash
npm run sync:skill
npm run test:discovery
npm run validate
npm test
```

Run live GitHub skill registry checks after release propagation:

```bash
npm run test:discovery:remote -- --out discovery-report.json
```
