# Royce Threads Frontend

## Overview

This is the frontend client for the Royce Threads store. It is a static web application built with HTML, CSS, and JavaScript.

The frontend includes:

- Product listing page
- Product details page
- Shopping cart page
- Checkout page
- Authentication pages (login, signup)
- Newsletter subscription
- Informational pages and thank-you flow

## What this does

The client loads products and user interactions, then sends purchase, cart, and newsletter requests to the backend API.

## Project structure

- `index.html` — home and product list
- `products.html` — shop listing page
- `ProductDetails.html` — product detail view
- `cartPage.html` — shopping cart page
- `checkout.html` — checkout form and order placement
- `login.html` / `signup.html` — user authentication pages
- `thanks.html` — order success page
- `JavaScript/` — frontend logic for product loading, cart management, checkout, auth, validation, and API calls
- `Style/` — CSS files for each page
- `json/` — animation definitions and page-specific JSON files

## How to run locally

### Option 1: Open directly in the browser

1. Open `royce-client/index.html` in your browser.
2. This works for static pages, but some features may require a local server because modern browsers block some `fetch` requests from file URLs.

### Option 2: Use a local HTTP server (recommended)

From `royce-client/`:

```bash
cd royce-client
python -m http.server 8000
```

Then open:

```
http://localhost:8000
```

Or use a Node-based server like `http-server`:

```bash
npm install -g http-server
cd royce-client
http-server -p 8000
```

## Backend connectivity

The frontend uses relative API paths like `/api/products`, `/api/orders`, and `/api/newsletter`.

### Local development

If you run the backend at `http://localhost:5000`, the easiest approach is to:

- use a local proxy, or
- update the frontend fetch URLs in the JavaScript files to `http://localhost:5000/api/...`

### Production / deployed setup

The frontend is designed for deployment with a backend configured to handle `/api` rewrite rules, such as Vercel or a reverse proxy.

## Common pages

- `index.html` — browse featured items and subscribe to newsletter
- `products.html` — full product catalog
- `ProductDetails.html` — item details plus add-to-cart
- `cartPage.html` — cart overview and quantity management
- `checkout.html` — submit order with shipping and payment details
- `login.html` / `signup.html` — authenticate users
- `thanks.html` — final confirmation after checkout

## Notes

- The frontend assumes a backend API is available at the same origin or through configured rewrites.
- If you change backend API host or port, update the relevant fetch requests in `JavaScript/`.
- The client stores cart details, user session info, and order flow state through JavaScript.

## Recommended workflow

1. Start the backend server from `royce-server/`.
2. Start the frontend server from `royce-client/`.
3. Open the frontend in a browser and shop through the UI.
4. Use developer tools to confirm network requests to the backend.
