# 🚀 MemoGarden Deployment Guide

This guide covers how to deploy MemoGarden for development, staging, or production.  
MemoGarden uses a modern stack: React (Vite), Supabase, Tailwind CSS, and shadcn/ui.

---

## 🛠️ Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Supabase account and project ([supabase.com](https://supabase.com))
- (Optional) Vercel, Netlify, or your preferred static hosting provider

---

## 1. **Clone the Repository**

git clone https://github.com/itsemtuk/memo-garden-verse.git
cd memo-garden-verse

text

---

## 2. **Install Dependencies**

npm install
or

yarn install

text

---

## 3. **Configure Environment Variables**

- Copy `.env.example` to `.env`
- Fill in your Supabase project details:

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

text

- For production, set the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting provider’s environment settings.

---

## 4. **Supabase Setup**

- Create a new Supabase project.
- Run the SQL migrations in `/supabase/migrations/` to set up tables, policies, and storage buckets.
- Use the Supabase SQL editor or CLI.
- Enable **Realtime** on the relevant tables (`boards`, `notes`, etc.).
- Set your **Site URL** in Supabase Auth settings to your deployed frontend URL (for email confirmations).

---

## 5. **Development Server**

npm run dev

text
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. **Production Build**

npm run build
npm run preview

text

---

## 7. **Deploying the Frontend**

### **Vercel (Recommended)**
- Import your GitHub repo into Vercel.
- Set environment variables in the Vercel dashboard.
- Deploy!

### **Netlify**
- Connect your repo.
- Set environment variables.
- Use build command: `npm run build`
- Publish directory: `dist`

### **Other Static Hosts**
- Build the project (`npm run build`).
- Upload the `dist/` folder to your static host.

---

## 8. **Supabase Storage & Security**

- Ensure your Supabase storage buckets (for images/files) have the correct RLS policies.
- Test uploading and retrieving images as a regular user.

---

## 9. **Custom Domain & HTTPS**

- Configure your hosting provider to use a custom domain.
- Ensure HTTPS is enabled for security.

---

## 10. **Post-Deployment Checklist**

- Test sign up, sign in, and email confirmation flows.
- Create and share boards; test public/private access.
- Add, move, and sync widgets in real time.
- Check mobile and desktop responsiveness.
- Monitor Supabase usage and logs for errors.

---

## 📝 Notes

- For scaling, consider using Supabase Pro/Enterprise and a CDN for static assets.
- For custom backend logic, you can add Supabase Edge Functions or your own API.

---

## 🆘 Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MemoGarden Issues](https://github.com/itsemtuk/memo-garden-verse/issues)

---

Happy deploying! 🌱

