# Monte Christo Retirement Village website: developer handoff

A static, dependency-free build of the approved design: plain HTML, CSS and JavaScript with no framework and no build step. Upload the folder to any web host and it works.

## Contents

```
index.html            English page
af/index.html         Afrikaans page (same layout, translated copy)
assets/css/styles.css All styles; brand colours and fonts are CSS variables at the top
assets/js/main.js     Text size, floor-plan viewer, enquiry form (vanilla JS, ~150 lines)
assets/images/        All photos, logos and floor plans (resized for web)
assets/fonts/         Pink Champagne (headline script font, licensed by the client)
```

It is a single scrolling page per language with anchor navigation: #village, #apartments, #units, #life, #care, #notices, #documents and #contact.

## Must do before launch

1. **Connect the enquiry form.** The form validates and shows a thank-you message, but nothing is sent yet. In both `index.html` and `af/index.html`, set `data-endpoint` on `<form id="enquiry">` to a URL that accepts a `POST` of form data (for example Formspree, Netlify Forms, a PHP mailer or the PGP CRM). Fields sent: `interest` (viewing / unit / care / general), `unit`, `language`, `name`, `phone`, `email` and `message`. Enquiries should go to Inelia Loots (inelia.loots@pamgolding.co.za) and Tammy van der Merwe (tammy.vandermerwe@pamgolding.co.za). Add spam protection (honeypot or reCAPTCHA) and a POPIA-compliant privacy notice link.
2. **Governance documents.** The six download links (Constitution, Estate Rules, Architectural Guidelines, Life Right Agreement, Annual Financial Statements, AGM Minutes) are placeholders (`href="#"`). The client will supply the PDFs; place them in `assets/docs/` and update the links in both pages.
3. **Notices.** The three notices are placeholder text. Replace them, or connect this section to a CMS if village management will post notices themselves.
4. **Domain.** Replace `https://www.example.co.za` in the `<head>` of both pages (canonical, hreflang and Open Graph tags) with the live domain.

## Recommended

- **Analytics.** Add GA4 and/or the Meta Pixel, and track the enquiry submit, `tel:` clicks and WhatsApp clicks as conversions.
- **Images.** Images are JPEG/PNG at up to 2000 px. Converting them to WebP and adding `srcset` would cut page weight further.
- **Fonts.** Ms Madi loads from Google Fonts as a fallback for the headline. Self-host it if you prefer no third-party requests.
- **Favicon.** None is included; generate one from the Monte Christo logo.

## Content that changes (the client will ask you to update these)

| What | Where | When |
|---|---|---|
| Unit list, prices, "Only five apartments remain" | `#units` in both pages | When units sell |
| Care prices "from R16 675 / R23 000" | `#care` price box | Every 1 March |
| Construction update | `#units` | Monthly or quarterly |
| Notices | `#notices` | Ongoing |

Edit English and Afrikaans together. The two pages share identical markup, so the same line can be found in both. The Afrikaans copy still needs to be proofread by a first-language speaker before launch.

## Behaviour notes

- **Language switch:** the button in the green top bar links between `/` and `/af/`. The `lang` and `hreflang` attributes are set for search engines and screen readers.
- **Text size:** the three "A" buttons scale the page (CSS `zoom`). The choice is remembered in `localStorage`.
- **Enquiry shortcuts:** "Book a viewing", "Enquire about this unit" and "Request the price list" scroll to the form and pre-select the enquiry type (and unit).
- **Floor plans and site plan:** these open in a full-screen viewer that closes with the Close button, a click outside the image or Esc.
- **Phones:** below 760 px, a fixed "Call us / Request a call" bar appears at the bottom of the screen.

## Brand reference

| Token | Value | Use |
|---|---|---|
| Green | `#284E36` | Primary: buttons, headings, top bar |
| Deep green | `#154734` | Contact section |
| Gold | `#DDA51E` | Accents, underlines, focus ring |
| Gold text | `#8a6a1c` | Small gold text on light backgrounds |
| Cream | `#FEFAE0` | Alternate section background |
| Body text | `#58595b` | |

Typefaces: Pink Champagne (hero headline only), Times New Roman (headings) and Arial (body). Layout: 1280 px maximum width, 32 px side padding (16 px on phones), 19 px base text.
