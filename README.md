# Nobita

A full-screen landing page inspired by Nobita's world. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Full-screen background video that scrubs forward or backward with horizontal mouse movement. The video does not autoplay.
- Responsive navigation with a mobile menu.
- Typewriter intro and animated action buttons.
- Email contact links and a button to copy the contact address.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Getting Started

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run Oxlint
npm run preview  # Preview the production build
```

## Background Video

The background video is served from `public/nobita.mp4`. Keep this filename and location, or update the video source in `src/App.tsx` when using a different file. The video seeks based on horizontal mouse movement and is muted.

## Contact

The contact address is configured in `src/App.tsx` as `hello@mainframe.co`.
