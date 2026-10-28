# Contributing

1. Open an issue describing a program or correction with **official** evidence. Do not submit private information.
2. Copy the fictional fixture as a *shape reference only*. Replace every fictional field with documented real facts. Remove `fixture`; never submit imaginary records as genuine. Write a separate JSON file under `data/opportunities/` named for the slug.
3. Use `null` for unconfirmed application URLs or deadlines; leave application status `unknown` without conclusive dated evidence. Include last verification date only if actually checked. Describe source-supported eligibility, geographies, benefits, required documents and limitations. Timestamp each status transition with an official source.
4. Run `npm run check` and, when appropriate, `npm run links`. Review freshness warnings and HTTP failures manually.
5. Open a PR with official URLs, what each source supports, verification time and potential uncertainty. Maintainers inspect provenance and avoid duplicates before merging.

By contributing you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues should follow [SECURITY.md](SECURITY.md), not public issues.
