# 📝 NoteForge AI — Complete Setup & Deployment Guide
### Powered by Gemini 1.5 Pro (FREE) + Render Hosting (FREE)

---

## 📁 Project Files

```
noteforge-gemini/
├── server.js           ← Node.js backend (keeps API key safe)
├── package.json        ← Dependencies
├── .env.example        ← Copy → rename to .env → add your key
├── .gitignore          ← Protects your secret key
└── public/
    └── index.html      ← Full frontend app
```

---

## STEP 1 — Get Your FREE Gemini API Key (2 minutes)

1. Open your browser → go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your **Google account** (Gmail works)
3. Click **"Create API Key"**
4. Click **"Create API key in new project"**
5. Your key appears — it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXX`
6. **Copy it and save it** somewhere (Notepad, Notes app)

✅ No credit card. No billing. Completely free.
✅ Free limit: 50 requests/day with Gemini 1.5 Pro (plenty for personal use)

---

## STEP 2 — Upload Project to GitHub (5 minutes)

1. Go to **https://github.com** → Sign up for free account
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `noteforge-ai`
4. Keep it **Public**
5. Click **"Create repository"**
6. On the next page, click **"uploading an existing file"**
7. Upload these files:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - The `public` folder → drag `index.html` inside it
8. Click **"Commit changes"**

⚠️ DO NOT upload the `.env` file — it contains your secret key!

---

## STEP 3 — Deploy on Render (Free hosting, 5 minutes)

1. Go to **https://render.com** → Sign up with your GitHub account
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect"** next to your `noteforge-ai` repository
4. Fill in these settings:
   ```
   Name:           noteforge-ai
   Region:         Pick closest to you
   Branch:         main
   Runtime:        Node
   Build Command:  npm install
   Start Command:  npm start
   ```
5. Scroll down to **"Environment Variables"** section
6. Click **"Add Environment Variable"**:
   ```
   Key:   GEMINI_API_KEY
   Value: (paste your key from Step 1 here)
   ```
7. Click **"Create Web Service"**
8. Wait 2-3 minutes for deployment...

✅ Your app is live at: **https://noteforge-ai.onrender.com**

---

## STEP 4 — Use the App

1. Open your live URL in **Chrome or Safari** on your phone or computer
2. Click **"Click to Upload PDF"** → select any PDF from your device
3. Set page range (optional)
4. Click **"✨ Generate Notes"**
5. Notes appear in **Preview** tab
6. Download as **PDF** or **Markdown**

---

## ✅ What Works After Deployment

| Feature | Status |
|---|---|
| PDF upload from device | ✅ Works perfectly |
| PDF download to device | ✅ Works perfectly |
| Markdown download | ✅ Works |
| AI note generation | ✅ Works |
| Mermaid diagrams | ✅ Works |
| Table rendering | ✅ Works |
| Chart & table insights | ✅ Works |
| Page range selection | ✅ Works |
| Mobile (Chrome/Safari) | ✅ Works |
| Desktop browser | ✅ Works |
| API key protected | ✅ Never exposed to users |

---

## ❓ Troubleshooting

**"GEMINI_API_KEY not set on server"**
→ Go to Render dashboard → Your service → Environment → Check the key is saved

**"Gemini API call failed"**
→ Double check your API key is correct at aistudio.google.com

**App not loading**
→ Wait 5 minutes — Render free tier takes time on first load

**"Daily limit exceeded"**
→ You've used 50 generations today. Resets at midnight.

**PDF not uploading**
→ Make sure you're on Chrome or Safari — not inside another app

---

## 💰 Total Cost

| Item | Cost |
|---|---|
| Gemini 1.5 Pro API | FREE (50/day) |
| Render hosting | FREE |
| Custom domain | FREE (.onrender.com) |
| **Total** | **₹0 / $0 forever** |

---

Built with ❤️ — NoteForge AI using Gemini 1.5 Pro + Node.js + Express + jsPDF + Mermaid.js
