# LowDO - Low Design Office

> "Realizing more with less"

An architecture and design studio portfolio website based in Austin, Texas.

## Design Goals

### Philosophy
- **Minimalism**: The site should reflect the studio's design philosophy—clean, purposeful, and uncluttered
- **Performance**: Fast loading times are non-negotiable; every kilobyte matters
- **Accessibility**: The site must be usable by everyone, regardless of ability or device
-**Usability**: The site must be easily edited. The workflow to update the website should involve the user dropping in text and images into a folder and letting the code automatically generate a page.

### Visual Principles
- Techincal but accessible visual language that recalls a spreadsheet. Lines are used to separate sections and objects. Think of a visible layout grid; making what is usually invisible visible.
- Generous whitespace to let projects breathe
- Typography that is readable and elegant
- Subtle transitions and interactions (no flashy animations)
- Consistent visual rhythm across all pages

### Technical Principles
- Static-first architecture (no unnecessary JavaScript)
- Progressive enhancement over graceful degradation
- Semantic HTML structure
- Mobile-first responsive design

---

## Current Features

### Core
- [x] Static site generation with Eleventy
- [x] Responsive image processing (JPEG, WebP, AVIF)
- [x] Project pages generated from Markdown
- [x] Homepage with featured image gallery
- [x] About page
- [x] Projects listing page

### Theming
- [x] Light/dark mode toggle with system preference detection
- [x] CSS custom properties for easy theming
- [x] Google Fonts integration with caching
- [x] Configurable colors via `settings.yaml`

### Performance
- [x] HTML/CSS/JS minification in production
- [x] Inline critical CSS
- [x] Lazy loading for images
- [x] Build caching for faster deploys
- [x] Next-gen image formats (WebP, AVIF)

### Infrastructure
- [x] Netlify hosting and deployment
- [x] Automatic CSP headers
- [x] Tina CMS integration (optional)
- [x] Custom 404 page

### SEO
- [x] JSON-LD structured data (Organization, WebSite, CreativeWork, CollectionPage, AboutPage schemas)

---

## Wishlist / Future Features

### High Priority
- [ ] Data filtering/categories
- [ ] Image lightbox/gallery viewer

### Medium Priority
- [ ] Project search functionality
- [ ] Related projects suggestions
- [ ] Print stylesheet for project pages

### Low Priority / Nice to Have
- [ ] Blog/news section
- [ ] Project timeline/archive view
- [ ] Multi-language support (i18n)
- [ ] Client testimonials section
- [ ] Team/people page

### Technical Improvements
- [ ] Implement service worker for offline support
- [x] Add structured data (JSON-LD) for SEO
- [ ] Improve Lighthouse scores to 100 across all metrics
- [ ] Add visual regression testing
- [ ] Implement critical CSS extraction per-page

---

## Project Structure Notes

```
_data/settings.yaml    # Site-wide configuration (edit this for theme changes)
projects/              # Add new projects here as markdown files
_includes/components/  # Reusable template components
assets/uploads/        # Images uploaded via CMS
```

## Development Commands

```bash
npm start              # Start development server
npm run build          # Production build
netlify dev            # Full Netlify dev environment
```

## Links

- **Live Site**: https://lowdo.netlify.app
- **Contact**: lowdo@lowdo.net
- **Instagram**: @lowdesignoffice
