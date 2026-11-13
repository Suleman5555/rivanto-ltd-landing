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
- `vercel.json` — Vercel static-site config (clean URLs)

## Deploy

### GitHub + Vercel (recommended)

1. Push this folder to a GitHub repository, e.g. `rivanto-ltd-landing`.
2. In Vercel, Import Project from that GitHub repo.
3. Framework preset: Other / static. No build command, output directory: `.`
4. Deploy. Vercel gives a `*.vercel.app` URL.
5. Add custom domain `rivantoltd.com` in Vercel → Domains, then set DNS in Spaceship:
   - Apex `@` → A `76.76.21.21`
   - `www` → CNAME `cname.vercel-dns.com`
6. Wait for DNS + TLS to verify in Vercel.

## Notes

- Company details on the page are from the Companies House record for 17273209.
- No product catalogue is listed on this page — the range changes over time, so the page points visitors to marketplace listings and to email contact. Add real products only when confirmed.
- Vercel Hobby (free) is for non-commercial / personal use in its terms; a business site is meant to be on Pro ($20/month). The owner confirmed free Hobby on 12 Nov 2026.
