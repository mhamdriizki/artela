# Artela - Digital Wedding Invitation (Frontend)

Artela is a premium digital wedding invitation platform offering Netflix and Instagram-style themes. This repository contains the Frontend application built with Angular.

## 🚀 Features
- **Modern Themes**: Cinematic Netflix & Instagram-style layouts.
- **Real-time Data**: Dynamic content rendering (names, dates, locations).
- **Responsive Design**: Optimized for mobile-first experience.
- **Interactive**: RSVP, Real-time comments, and music playback.
- **Core Pages**:
    - **Home**: Landing page with pricing, features, and testimonials.
    - **Wedding Invitation**: The actual digital invitation rendered for guests.

## 🛠 Tech Stack
- **Framework**: [Angular 17+](https://angular.io/)
- **Styling**: SCSS (Sass), CSS Variables, Flexbox/Grid
- **Icons**: FontAwesome 6
- **Routing**: Angular Router
- **Build Tool**: Angular CLI

## 📂 Project Structure
```bash
src/
├── app/
│   ├── core/           # Singleton services, interceptors, guards
│   ├── features/       # Feature modules (pages)
│   │   ├── home/               # Landing page (Pricing, Themes, etc.)
│   │   ├── wedding-invitation/ # The actual invitation logic
│   ├── shared/         # Reusable components, pipes, directives
│   └── app.component.ts # Root component
├── assets/             # Images, fonts, static media
└── styles.scss         # Global styles/variables
```

## 🔧 Setup & Installation

**Prerequisites:**
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

**Steps:**

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd artela
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm start
    # or
    ng serve
    ```
    Open `http://localhost:4200` in your browser.

## 📦 Build for Production

To create an optimized build for deployment:

```bash
npm run build
```
The artifacts will be stored in the `dist/` directory.

## 🔗 Related Repositories
- **Backend Service**: `artela-service` (Go/Golang)

---
© 2025 Artela. All rights reserved.
