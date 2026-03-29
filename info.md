# Project Report: QuBioDL Conference Website Admin System

Generated on: 2026-03-29
Project root: conff

## 1. Executive Summary
This project is a React + Vite single-page website for a Faculty Development Program / seminar event portal.
It includes a public website experience and an admin control panel that supports live content editing.

Major capability:
- Almost all homepage content is editable from admin.
- Editing is organized into popup editor windows (modals) for each admin block.
- Content is persisted in browser localStorage so updates survive page refresh.

## 2. Technology Stack
- Framework: React 19
- Bundler/Dev Server: Vite 8
- Language: JavaScript (ES modules)
- Styling: CSS files (App.css, AdminPage.css, index.css)
- Linting: ESLint 9

Dependencies (from package.json):
- react
- react-dom

Dev dependencies:
- vite
- @vitejs/plugin-react
- eslint and related plugins

## 3. NPM Scripts
- dev: vite
- build: vite build
- lint: eslint .
- preview: vite preview

## 4. Folder and File Structure

```text
conff/
  dist/
  node_modules/
  public/
  src/
    assets/
    AdminPage.css
    AdminPage.jsx
    App.css
    App.jsx
    index.css
    main.jsx
  eslint.config.js
  index.html
  package-lock.json
  package.json
  README.md
  vite.config.js
```

## 5. Entry and Bootstrapping
- main.jsx mounts App into #root with React StrictMode.
- index.html defines the document shell and browser title.

## 6. Core Application Architecture

### 6.1 Main App Component (App.jsx)
Responsibilities:
- Render public website sections.
- Control admin route by hash (#admin).
- Handle admin login/logout state.
- Manage registration modal open/close.
- Hold editable content object in React state.
- Persist/reload content via localStorage.

Important storage keys:
- qubiodl-content-v1 (site content)
- qubiodl-admin-auth (admin login flag)

### 6.2 Content Model
`defaultContent` includes:
- navbar
- registration
- schedule
- speakers
- committee
- sections

`sections` contains editable text blocks for:
- hero
- about
- objectives
- legacy
- speakers (text area metadata)
- committee (labels)
- audience
- cta
- schedule (timeline header/button/note)
- footer

Normalization helpers are used to safely merge saved content with defaults.
This protects app stability when stored data is partial/old.

### 6.3 Admin Component (AdminPage.jsx)
Responsibilities:
- Provide UI for editing all content groups.
- Update parent content using onContentChange callback.
- Support dynamic list add/remove/edit for nested data.
- Handle image uploads by converting files to data URLs.

## 7. Admin Editing UX (Current State)
Admin editing is modal-driven.
Each major admin block now opens in its own popup editor window.

Popup editors currently present:
- Navbar editor
- Registration form fields editor
- Schedule editor
- Resource persons editor
- Committee editor
- Website sections editor

This creates a consistent workflow for all editing areas.

## 8. Editable Areas Coverage

### 8.1 Navbar
- Brand text
- Sub-brand text
- Links (label/href, add/remove)
- Logos (replace, add, remove)

### 8.2 Registration Form
- Form title
- Field definitions (label, name, type, section, required)
- Select options
- Add/remove fields

### 8.3 Schedule
- Timeline items (title/description)
- Add/remove items

### 8.4 Speakers
- Name, role, organization
- Optional photo upload/remove
- Add/remove speaker

### 8.5 Committee
- Department and school headings
- Chief patrons list
- Patrons list
- Programme chairs list
- Convener/co-convener list
- Per-member photo upload/remove
- Add/remove across lists

### 8.6 Website Sections Content
- Hero text and button labels
- About text and takeaways list
- Objectives cards
- Legacy accordion entries
- Speakers section text blocks
- Committee section labels
- Audience section text/items
- Registration CTA text
- Timeline header/button/note
- Footer titles, descriptions, links, copyright

## 9. Public Website Sections (Rendered)
- Hero
- About
- Objectives
- Institutional legacy (accordion)
- Resource persons
- Committee
- Audience
- Registration CTA
- Schedule timeline
- Footer
- Registration modal

All major text/content values are now sourced from editable content state.

## 10. Routing and Access
- Route style: hash-based check in component logic.
- Admin page hash: #admin
- Admin credentials currently hardcoded in App.jsx:
  - username: admin
  - password: admin@123

## 11. Data Persistence
- Content changes are written to localStorage on every content update.
- Admin auth state is also persisted in localStorage.
- Refreshing the page keeps both edited content and login state.

## 12. Build and Verification Status
Latest build status:
- Command: npm run build
- Result: success
- Output indicates Vite production build completed without errors.

## 13. Known Security/Production Notes
- Admin credentials are hardcoded in frontend code.
- Auth is client-side only.
- localStorage content can be modified by users with browser access.

Recommended production improvements:
- Move auth to backend.
- Use secure token-based authentication.
- Store content in server database/API instead of localStorage.

## 14. Summary
The project is a functioning, editable event website with a strong admin UX.
The admin area now uses a consistent popup-window editing model across all major blocks, and content is fully data-driven with persistence.
