# TRP Powers Plus - Landing Page

## 📋 Overview

**TRP Powers Plus** เป็นเว็บไซต์ Landing Page สำหรับบริษัทรับเหมาติดตั้งระบบไฟฟ้า และโซลาร์เซลล์ (Solar Cell Installation Service)

เว็บนี้สร้างขึ้นเพื่อ:
- 📱 แสดงข้อมูลบริการของบริษัท
- 💼 สร้างความเชื่อมั่นและมืออาชีพ
- 📈 เพิ่ม SEO Ranking เพื่อการค้นหาออนไลน์
- 🔗 เชื่อมต่อลูกค้ากับช่องทางติดต่อหลัก

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2.4](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: React 19+
- **Build Tool**: Turbopack
- **Node Version**: 18.x or higher

---

## 📂 Project Structure

```
trp-powers-plus-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   ├── page.tsx            # Main landing page
│   │   ├── globals.css         # Global styles
│   │   └── favicon.ico         # Favicon
│   └── components/
│       ├── Navbar.tsx          # Navigation bar with mobile menu
│       ├── Hero.tsx            # Hero section with CTA
│       ├── Services.tsx        # Services showcase
│       ├── Portfolio.tsx       # Project portfolio
│       ├── SolarCalculator.tsx # Solar system price calculator
│       ├── Contact.tsx         # Contact information & map
│       ├── FAQ.tsx             # Frequently asked questions
│       └── Footer.tsx          # Footer with copyright
├── public/
│   ├── images/                 # Images (logo, hero banner, etc)
│   └── ...
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dparamet/Landing-Page-TRP-PowersPlus.git
   cd trp-powers-plus-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if needed)
   ```bash
   cp .env.example .env.local
   ```

### Development

**Run development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production**
```bash
npm run build
```

**Start production server**
```bash
npm run start
```

**Run linter**
```bash
npm run lint
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## 🎨 Key Components

### 1. **Navbar** (`Navbar.tsx`)
- Sticky navigation with mobile hamburger menu
- Smooth scrolling to sections
- CTA button for free estimation
- Responsive design (mobile/tablet/desktop)

### 2. **Hero Section** (`Hero.tsx`)
- Full-width background image with overlay
- Compelling headline with brand colors
- Trust signals (experience, warranty, etc)
- Dual CTA buttons

### 3. **Services** (`Services.tsx`)
- Service showcase cards
- Icons/visuals for each service
- Responsive grid layout

### 4. **Portfolio** (`Portfolio.tsx`)
- Project gallery showcasing completed work
- Project details and images
- Filter/category options

### 5. **Solar Calculator** (`SolarCalculator.tsx`)
- Interactive tool to estimate costs
- Real-time calculations
- User-friendly interface

### 6. **Contact Section** (`Contact.tsx`)
- Clickable contact links (phone, email, social media)
- Embedded Google Map
- Support multiple channels

### 7. **FAQ** (`FAQ.tsx`)
- Accordion-style frequently asked questions
- 7+ common customer questions
- Expandable answers with smooth animations

### 8. **Footer** (`Footer.tsx`)
- Company info and links
- Quick navigation
- Services list
- Contact information
- Copyright notice with current year

---

## 🔍 SEO & Performance Features

✅ **SEO Optimized**
- Meta tags (title, description, keywords)
- Open Graph for social sharing
- Language set to Thai (lang="th")
- Canonical URLs
- Schema.org structured data (LocalBusiness)
- Semantic HTML with proper heading hierarchy

✅ **Performance**
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS optimization with Tailwind CSS
- Static site generation where possible
- Responsive design for all devices

✅ **Accessibility**
- ARIA labels and semantic HTML
- Keyboard navigation support
- Color contrast compliance
- Alt text for all images

---

## 📱 Responsive Design

- **Mobile**: 320px and up
- **Tablet**: 768px and up (md breakpoint)
- **Desktop**: 1024px and up (lg breakpoint)

All components tested on major browsers and devices.

---

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React component best practices
- Use Tailwind CSS utility classes
- Keep components small and reusable
- Add comments for complex logic

### Component Structure
```tsx
'use client';  // Add if using client-side features

import { useState } from 'react';

export default function ComponentName() {
  // Component logic
  
  return (
    <section className="py-20 bg-white">
      {/* Content */}
    </section>
  );
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Navbar.tsx`)
- **Files**: PascalCase for components, lowercase for utilities
- **CSS Classes**: kebab-case with Tailwind utilities
- **Variables/Functions**: camelCase

### Commit Messages
- Use descriptive, clear messages
- Format: `type(scope): description`
  - Example: `feat(navbar): add mobile menu`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`

---

## 🌳 Git Workflow

### Branches
- `main` - Production ready code
- `dev` - Development branch
- `feat/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches

### Creating a Feature
```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name

# Make changes and commit
git add .
git commit -m "feat(component): add awesome feature"

# Push to remote
git push -u origin feat/your-feature-name

# Create Pull Request on GitHub
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel dashboard
3. Configure environment variables
4. Deploy with one click

### Deploy to Other Platforms
- Follow Next.js deployment docs: https://nextjs.org/docs/app/building-your-application/deploying

---

## 📝 Content Updates

### Update Company Info
- Edit phone/email in `Contact.tsx` and `Footer.tsx`
- Update social media links
- Modify address in map embed

### Update Services
- Edit `Services.tsx` component
- Add/remove service cards
- Update descriptions

### Update Portfolio
- Add projects to `Portfolio.tsx`
- Upload images to `public/images/`
- Update project details and links

### Update FAQ
- Add/remove questions in `FAQ.tsx`
- Update answers with latest info
- Keep questions relevant to customers

---

## 🐛 Troubleshooting

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use different port
```

### TypeScript errors
- Check `tsconfig.json`
- Run `npm run lint` to identify issues
- Update types if needed

---

## 📞 Support & Contact

**For Development Issues:**
- Create an issue on GitHub
- Contact development team

**For Business Inquiries:**
- Phone: +66 (0) 12-345-6789
- Email: TRPPowersplus@gmail.com
- Website: [trppowersplus.com](https://trppowersplus.com)

---

## 📜 License

This is a **private repository** for TRP Powers Plus development team only.
All rights reserved © 2026 TRP Powers Plus

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: May 2026
**Maintained by**: TRP Powers Plus Development Team

