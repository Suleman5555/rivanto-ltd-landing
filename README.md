# RIVANTO LTD — Landing Page

Professional single-page landing page for RIVANTO LTD, built for Tide Bank review and for rivantoltd.com.

- Company: RIVANTO LTD, Company No. 17273209
- Incorporated: 10 June 2026
- Registered office: Office 19522, 182-184 High Street North, East Ham, London E6 2JA, United Kingdom
- Director: Ali Haseeb
- Contact: rivantoltd@gmail.com
- Domain: rivantoltd.com

## Files

- `index.html` — the full landing page (self-contained, responsive), with a Products section showing six ranges: Home & Kitchen, Electronics, Storage & Organisation, Health & Beauty, Pet Supplies, Sports & Fitness
- `products.html` — listing of all products with prices
- `products/<slug>.html` — one detail page per product (price, features, enquire link)
- `logo.png` — RIVANTO LTD wordmark logo (header); `logo-icon.png` — square R icon (favicon)
- `vercel.json` — Vercel static-site config (clean URLs)

## Deploy

### GitHub + Vercel (recommended)

1. Push this folder to a GitHub repository, e.g. `rivanto-ltd-landing`.
2. In Vercel, Import Project from that GitHub repo.
3. Framework preset: Other / static. No build command, output directory: `.`
4. Deploy. Vercel gives a `*.vercel.app` URL.
5. Add custom domain `rivantoltd.com` in Vercel → Domains, then set DNS in Spaceship (actual values shown by Vercel for this project):
   - Apex `@` → A `216.198.79.1`
   - `www` → CNAME `3eb8e9670abfc14b.vercel-dns-017.com`
6. Wait for DNS + TLS to verify in Vercel.

## Notes

- Company details on the page are from the Companies House record for 17273209.
- The six products on the site (storage jars, USB-C charger, storage boxes, cleansing brush, dog treat ball, resistance bands, with EUR prices) are DUMMY placeholder products added 13 Nov 2026 at the owner's request so the site shows something sellable. Replace them with the real product list before Tide reviews the page.
- Vercel Hobby (free) is for non-commercial / personal use in its terms; a business site is meant to be on Pro ($20/month). The owner confirmed free Hobby on 12 Nov 2026.
