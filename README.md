# Mwanainchi Report — Setup Guide

> **Your Voice. Your Rights. Your Justice.**
> A secure civic justice platform for Kenyan citizens.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Images You Need to Source

Place all images in `public/images/` in the correct subfolder.

### ✅ Already Created (SVG — no sourcing needed)
| File | Location |
|------|----------|
| Kenya flag ribbons | `public/images/svg/flag-ribbon-left.svg` |
| Kenya flag ribbons | `public/images/svg/flag-ribbon-right.svg` |
| Justice scales icon | `public/images/svg/icon-scales.svg` |

---

### 📷 Images You Must Source / Photograph

#### `/public/images/hero/`
| Filename | Description | How to Get |
|----------|-------------|-----------|
| `hero-woman.png` | **THE MOST IMPORTANT.** A Kenyan woman in a grey blazer, looking confident, smiling. Background removed (transparent PNG). | Adobe Stock / Unsplash / commission a photographer. Search: "African woman professional transparent background" |
| `court-building.jpg` | Milimani Law Courts or High Court of Kenya, exterior photo | Take a photo yourself or search "Milimani Law Courts Nairobi" on Google Images |
| `gavel.jpg` | A judge's gavel on a wooden surface | Unsplash: search "gavel justice" |

#### `/public/images/logo/`
| Filename | Description |
|----------|-------------|
| `coat-of-arms.png` | Kenya official coat of arms (public domain — download from Kenya government website) |

#### `/public/images/dashboard/`
| Filename | Description | How to Get |
|----------|-------------|-----------|
| `constitution-book.jpg` | Physical copy of the Constitution of Kenya 2010 | Take a photo of an actual copy, or search online |
| `justice-scales-gold.png` | Bronze/gold Lady Justice statue | Unsplash: search "lady justice statue" |

---

### 🎨 Color Reference
```
Kenya Black:  #0A0A0A
Kenya Red:    #C8102E
Kenya Green:  #006600
Kenya White:  #FFFFFF
```

---

## 🔌 Backend Integration (Supabase)

### 1. Create a Supabase project at supabase.com

### 2. Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install Supabase
```bash
npm install @supabase/supabase-js
```

### 4. Database Tables to Create
```sql
-- Users (extends Supabase auth)
create table profiles (
  id uuid references auth.users primary key,
  first_name text,
  last_name text,
  phone text,
  county text,
  created_at timestamptz default now()
);

-- Cases
create table cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  case_number text unique,
  category text not null,
  incident_date date,
  location text,
  description text,
  status text default 'submitted',
  is_anonymous boolean default false,
  created_at timestamptz default now()
);

-- Evidence
create table evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  file_name text,
  file_url text,
  file_hash text,  -- SHA-256 fingerprint
  file_size bigint,
  uploaded_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  sender_id uuid,
  content text,
  is_encrypted boolean default true,
  created_at timestamptz default now()
);
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page (hero, morphing text)
│   ├── auth/
│   │   ├── login/page.tsx    ← Login
│   │   └── signup/page.tsx   ← Sign up (2-step)
│   └── dashboard/
│       ├── layout.tsx        ← Sidebar + TopNav wrapper
│       ├── page.tsx          ← Dashboard home
│       ├── report/page.tsx   ← 5-step incident form
│       ├── cases/page.tsx    ← Case list + tracking
│       ├── messages/page.tsx ← Secure messaging
│       ├── legal-support/    ← Lawyer marketplace
│       ├── evidence-vault/   ← File upload + vault
│       ├── emergency/        ← SOS button + contacts
│       ├── rights/page.tsx   ← Rights & resources
│       ├── profile/page.tsx  ← User profile
│       └── settings/page.tsx ← Account settings
├── components/
│   ├── ui/
│   │   ├── Logo.tsx          ← MWR logo with coat of arms
│   │   ├── FlagRibbon.tsx    ← Kenya flag decorations
│   │   └── SOSButton.tsx     ← Emergency SOS (3 variants)
│   └── layout/
│       ├── Sidebar.tsx       ← Navigation sidebar
│       └── TopNav.tsx        ← Top header bar
└── lib/
    └── constants.ts          ← Colors, nav items, categories
```

---

## 📱 Responsive Breakpoints
- Mobile: < 768px (sidebar becomes drawer, grids stack)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🎬 Animations Included
- **Morphing typewriter**: Hero heading cycles through phrases
- **SOS pulse**: Red glow animation on all SOS buttons
- **Card hover lift**: Subtle elevation on hover
- **Sidebar transitions**: Smooth mobile drawer open/close
- **Step progress**: Animated case tracker

---

## 🌐 Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import at vercel.com — it auto-detects Next.js.

---

## 📞 Emergency Numbers in the Platform
- General Emergency: **999**
- Gender Violence: **1195**
- Child Helpline: **116**

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.*
