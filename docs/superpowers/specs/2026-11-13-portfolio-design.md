# Raman Lamba Portfolio: Design Spec

Date: 2026-11-13 · Status: draft for review

## 1. Goal
A personal site for **job search and freelance work**, on a custom domain. It should be memorable, fast to scan for a recruiter, and credible to a client.

**Positioning:** "Software for financial decisions." Finance background (MBA Finance, private credit, valuation) plus code (ML, quant, trading systems). Primary target: fintech roles with an analyst flavour. Freelance is served by an always-visible "Hire me" path.

**Masthead:** RAMAN LAMBA, tagline "Software for financial decisions", Hyderabad, "Open for freelance & full-time roles".

## 2. Concept
A **newspaper front page** (layout A, scroll vertically only) using the interaction model of the reference site in `portfolio-reference/` (focus-and-dim, folders that open, fan-out of captioned items, persistent back control). Take structure and feel only; no text, imagery or branding from the reference.

## 3. Stack and routes
- Next.js (App Router), Tailwind, `motion` for animation, hosted on Vercel.
- Content is data (JSON/MDX files): projects, internships, ads, awards. Adding a file adds an item.
- Routes: `/` front page · `/work/[slug]` article page per project · `/resume` full résumé page with "Download PDF".
- Opening a folder or story animates to focus and updates the URL (Back and shared links work, Esc closes).
- Fallbacks: one-column stack on phones, `prefers-reduced-motion`, full keyboard navigation, alt text on every image.
- Tooling in place: impeccable, emil-kowalski skills, ponytail, Context7 MCP, Chrome extension for preview.

## 4. Front page layout (A)
Top to bottom:
1. **Masthead:** nameplate, tagline, left ear ("Open for freelance & full-time roles"), right ear (Hyderabad, live date, "Vol. I No. 1"), double rule.
2. **Index box** ("Inside today": sections with page-style labels), doubles as navigation.
3. **Markets strip:** gold, Nifty, USD/INR (live).
4. **Lead story + Wire column + tall ad.** Lead is a win (see section 7). Wire shows one live finance/AI headline.
5. **Clippings row:** three further stories.
6. **Wide ad banner.**
7. **Bureaus:** internships as press-card style cards.
8. **Folders:** Finance, ML/AI, Web, Marketing, each opens into a fan of clippings.
9. **Classifieds (résumé), Editorial (about), Letters (contact).**
10. **Small ad + footer** (colophon: "Printed in Hyderabad").

## 5. Visual style
- **Paper** `~#EFE6D0` with faint SVG grain. **Ink** near-black brown. **One accent:** oxblood red (kickers, ▲▼, links).
- **Type:** Playfair Display (headlines), Source Serif 4 (body), Barlow Condensed (kickers/labels, caps), IBM Plex Mono (numbers, ticker).
- **Rules:** double rule under masthead, thin column rules, hairlines between stories.
- **Images:** grayscale + halftone dots; portrait gets a stipple (hedcut) treatment.
- **Motion:** 200-300ms ease-out, light stagger on fan-out, rest of page dims to faint sepia on focus; all disabled under reduced-motion.

## 6. Components
| Component | Convention | Behaviour |
|---|---|---|
| Masthead | NYT/WSJ nameplate with ears | Static, live date |
| MarketsStrip | WSJ/FT market data | Mono figures, ▲▼, "delayed" label, hidden if feed fails |
| Lead story / StoryCard | Front-page lead | Kicker, headline, deck, byline, dateline, halftone image, drop cap, "By the numbers" box, "Continued" link to `/work/[slug]` |
| Wire | Wire-service column | One headline, source, time, link out; static fallback |
| Ad (x3) | Vintage display ads | Border, condensed caps, "Inquire within"; each is a link. Contact ad is a dashed ✂ coupon |
| Clipping | Cut-out clipping | Rotated, rough edge, tape/clip, italic caption, credit line |
| Folder | Newspaper morgue archive | Tan manila folder, typed label; opens to fanned clippings |
| Bureau | Press pass / dispatch | Internship card; opens to work from that internship |
| Classifieds | Classified page | Dense columns, bold lead words; opens `/resume` |
| Editorial | Opinion page | Italic headline, drop cap, pull quote, stipple portrait |
| Letters | Letters to the Editor | Email, links, short form |
| Back pill | Reference's bottom-right control | "Front page" |

## 7. Content and credit lines
Lead stories are the two wins.
| Item | Credit | Notes |
|---|---|---|
| UBS Financial Challenge, first place | Team Cygnus; you did almost everything | **Result only.** Competition rules bar showing the problem statement or the solution, so no deck, figures or description of the solution anywhere on the site or résumé. Appears as a headline/award ("First place, UBS Financial Challenge, Team Cygnus"), not a case study. |
| Qiskit Fall Fest 2026, winner | **Solo entry** (deck says "Wave Riders") | QAOA portfolio optimisation, up to 20 stocks, sector cap, run on IBM hardware; honest classical comparison |
| Gold Price Forecasting | Solo | 54-58% directional accuracy, 18% backtest return; figures in repo |
| Options Strategy Simulator | Solo | Real NSE F&O 2019-2024 |
| Trade Simulator, Deribit OMS | Solo | Finance/systems |
| Asian Paints valuation | Solo | Be ready to defend Rs 586 vs ~Rs 2,580 |
| APL Apollo Tubes (CFA Research Challenge) | Team; relative valuation only; did not advance | Label as "Research Challenge submission" |
| Spotify campaign | Team; contributor, pages 1-4 | Render the 42 MB PDF to light images |
| Lecture Hall Booking, AI Interviewer, MindBloom (RAG on a psychology book), TimeSeries, Jivika matching system | Solo / org as noted | Secondary stories; Jivika code is the company's, describe in general terms |

Internship bureaus:
- **Oxane Partners** (private credit): deal analysis, modelling and onboarding on Oxane's native architecture via a dynamic, metadata-driven design.
- **Coding Blocks** (teaching assistant): twice-weekly DSA doubt-solving sessions for students; assisted them in interviews.
- **Jivika** (developer, 1 month).

Contact: ramanlamba2022@gmail.com, LinkedIn linkedin.com/in/raman-lamba, GitHub github.com/Raman-Lamba. No phone number.
 Not shown: PeerSync (no contributions), empty and forked repos. Early learning repos get one line.
Planned (not yet built): sell-side equity report and buy-side portfolio project. Shown at most as a "Coming soon" ad.

Source material: `repo-buckets.md`, `repo-list.txt`, `projects-nog/`, `CASE_COMP/`, `resume/`, `Photo/`.

## 8. Résumé
`resume/RamanLamba_Resume_Fintech.pdf` (one page, fintech with analyst slant, no phone number; source `resume/src/resume-fintech.html`). More variants (quant-dev, analyst) can be offered as separate downloads. The public `/resume` page must not show a phone number.

## 9. Live data (phase 4, after the core site)
- **Date:** formatted client-side, newspaper style.
- **Markets and Wire:** fetched on the server, cached (about hourly), headline + source + link only, never article text. Static fallback; each box hides on failure. Prefer a keyless RSS feed; verify any API's terms before launch. Label market data "delayed, not advice".

## 10. Build phases
1. Scaffold: Next.js, Tailwind, fonts, tokens, data files, placeholder content.
2. Static front page with all components, mobile stack.
3. Folders, fan-out, focus-and-dim, `/work/[slug]`, `/resume`. **Deploy after this phase.**
4. Live date, markets strip, wire.
5. Polish: motion review, accessibility, stress test (break-ui), performance, domain.

## 11. Security and housekeeping
- Git initialised; `.gitignore` excludes `.env`. No secrets in the repo.
- Rotate keys in `.env` files committed to private repos `resume-maker` and `portfolio`.
- Revoke the GitHub tokens used during research.
- Make `master` the default branch of MindBloom repos (code is not on `main`); clean large build output from `oems`.

## 12. Open items
- Domain name (to be added later).
- Short bio (3-4 lines).
- Higher-resolution photo (current is about 590x845).
- Jivika title and dates (inferred from commits).
- Resolved: Spotify credit is "contributor, pages 1-4"; UBS is result-only; contact details are in section 7.

## 13. Out of scope (YAGNI)
Free-pan canvas, blog/essays, i18n, CMS, user accounts. Revisit after launch.
