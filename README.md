<h1 align="center">
  <br>
  ARZ — Custom Shopify Theme
  <br>
</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&duration=3500&pause=600&color=BFA27E&center=true&vCenter=true&width=600&lines=A+handcrafted+Shopify+storefront+for+ARZ;Traditional+clothing%2C+modern+experience;Built+with+Liquid+%7C+CSS+%7C+JavaScript" alt="Typing animation" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Shopify-96BF48?style=for-the-badge&logo=shopify&logoColor=white" />
  <img src="https://img.shields.io/badge/Liquid-7AB55C?style=for-the-badge&logo=shopify&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Private-BFA27E?style=for-the-badge" />
</p>

---

## 🏠 Homepage

The homepage opens with a full-width hero section — bold typography, a clean call-to-action, and the brand's signature warm palette. Below the hero sits a curated featured products grid, letting customers jump straight into browsing. Every element is intentional: no clutter, no noise — just the brand and the product.

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000336920.png?v=1771610622" alt="ARZ Homepage" width="100%" />
</p>

---

## 🗂️ Collections

The collections page presents the full product catalog in a clean, evenly spaced grid. Each card shows the product image with a smooth multi-image slideshow on hover, the product name, price, and a Quick Add button — so customers can shop without ever leaving the page. Sale and new arrival badges surface automatically based on product tags.

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000349819.png?v=1771610634" alt="ARZ Collections" width="100%" />
</p>

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000400798.png?v=1771610646" alt="ARZ Products Grid" width="100%" />
</p>

---

## 🧥 Product Page

The product page is built for clarity and conversion. On the left, a full image gallery with numbered navigation (`1 / 5`) lets customers cycle through every angle. On the right, the size selector, quantity input, and add-to-cart button are laid out in a logical hierarchy — with a real-time stock indicator that shows low availability when stock drops below the threshold.

Scroll down and the page reveals a size guide (dynamically matched to the product type — Panjabi, Shacket, or Pants) and a "You May Also Like" recommendations section powered by Shopify's product recommendations API.

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000414623.png?v=1771610659" alt="ARZ Product Page" width="100%" />
</p>

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000422332.png?v=1771610667" alt="ARZ Product Page Scrolled" width="100%" />
</p>

---

## 📦 Track Order

A fully custom-built order tracking portal — no third-party apps, no redirects. Customers enter their order number and email directly on-site and get their fulfilment status back in a clean, readable format. Keeps the post-purchase experience inside the brand rather than pushing customers to a generic courier page.

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000436941.png?v=1771610680" alt="ARZ Track Order" width="100%" />
</p>

---

## ✂️ Bespoke (Custom Tailored)

The Bespoke page is ARZ's made-to-measure offering. Customers can submit their exact measurements for a fully custom-tailored piece. The page walks through the process — what to measure, how to submit, and what to expect — keeping it approachable for customers who've never ordered custom clothing before.

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000500127.png?v=1771610704" alt="ARZ Bespoke Page" width="100%" />
</p>

<p align="center">
  <img src="https://cdn.shopify.com/s/files/1/0590/8050/7450/files/image_2026-02-21_000508922.png?v=1771610713" alt="ARZ Bespoke Page Scrolled" width="100%" />
</p>

---

## ✨ Features

| Feature | Details |
|---|---|
| 🛍️ Product Pages | Image gallery, variant picker, quantity selector, live stock warnings |
| 🛒 Cart Drawer | Slide-in cart with free shipping progress bar |
| ⚡ Quick Add | Add to cart directly from any collection grid |
| 📐 Size Guides | Dynamic charts per product type — Panjabi, Shacket, Pants |
| 🔍 Mega Menu | Multi-column Shop navigation with collection categories |
| 📦 Order Tracking | Built-in custom order tracking portal |
| 💡 Recommendations | "You May Also Like" on every product page |
| ✂️ Bespoke Page | Custom tailored clothing submission flow |
| 📱 Mobile Ready | Fully responsive with hamburger nav and touch-friendly UI |
| 🎨 Theme Customizer | Colors, fonts, layout, and copy — all editable from Shopify admin |

---

## 🎨 Design System

Built around ARZ's brand palette — warm, earthy, and understated:

| Token | Default |
|---|---|
| Background | `#efebe0` — warm linen |
| Accent | `#BFA27E` — earthy gold |
| Text | Dark neutral |
| Borders | Subtle warm tones |

All values are CSS custom properties — swappable from the Shopify customizer without touching code.

---

## 🗂️ Project Structure

```
arz final/
├── assets/
│   ├── theme.css                    # Main stylesheet
│   ├── theme.js                     # All client-side logic
│   ├── critical.css                 # Critical above-the-fold styles
│   └── *.svg                        # Brand logos, size charts
│
├── sections/
│   ├── header.liquid                # Header, mega menu, mobile nav
│   ├── product.liquid               # Product detail page
│   ├── footer.liquid
│   ├── hero.liquid                  # Homepage hero
│   ├── featured-products.liquid
│   ├── custom-tracking-portal.liquid
│   └── main-custom-tailored.liquid  # Bespoke page
│
├── snippets/
│   ├── product-card.liquid
│   ├── cart-drawer.liquid
│   └── size-chart.liquid
│
├── templates/                       # JSON page templates
├── layout/theme.liquid              # Global HTML shell
└── config/                          # Theme settings schema
```

---

## 🚀 Local Development

```bash
# Preview locally against your store
shopify theme dev --store YOUR_STORE.myshopify.com

# Push to live store
shopify theme push --store YOUR_STORE.myshopify.com

# Lint
shopify theme check
```

---

<p align="center">
  <sub>Made By Osayeed Zaber <3</sub>
</p>
