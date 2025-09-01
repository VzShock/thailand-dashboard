# Multi-Device Sync Guide

Your Thailand Dashboard now supports seamless progress tracking across multiple devices and computers!

## 🔄 How It Works

### **Server-Side Storage**
- All your progress is automatically saved to the server
- Uses Next.js API routes with JSON file storage
- No external database required - everything runs locally

### **User Identification System**
- Each user gets a unique ID (e.g., `lq8k9x2-abc12`)
- User ID is stored in browser localStorage
- Can be shared via URL parameters for multi-device access

### **Fallback System**
- Primary: Server storage via API
- Backup: Browser localStorage (offline support)
- Graceful degradation if server is unavailable

## 📱 Using Multiple Devices

### **Method 1: Share Link**
1. Click the **👤 User** button in the top-right
2. Click **"📱 Generate Share Link"**
3. Copy the link and open it on your other device
4. Progress will sync automatically!

### **Method 2: Manual User ID**
1. Note your User ID from the User Management panel
2. On another device, click **👤 User**
3. Enter your User ID in **"Switch to Different User"**
4. Click **"Switch"**

### **Method 3: URL Parameter**
Add `?user=YOUR_USER_ID` to any dashboard URL:
```
https://your-dashboard.com/?user=lq8k9x2-abc12
```

## 🔧 Technical Details

### **API Endpoints**
- `GET /api/tracker?userId=XXX` - Load user progress
- `POST /api/tracker` - Save complete progress data
- `PATCH /api/tracker` - Update individual items

### **Data Storage**
- Location: `data/tracker-data.json`
- Format: `{ "userId": { "food": {...}, "activities": {...} } }`
- Automatic backup to localStorage on each device

### **User Management**
- **Current User**: Shows abbreviated user ID
- **Switch User**: Change to different user's progress
- **Generate Share Link**: Create shareable URL with user ID
- **Reset User**: Start fresh with new unique ID

## 🚀 Getting Started

### **First Time Setup**
1. Open the dashboard - you'll get a unique user ID automatically
2. Start checking off items in Food, Activities, Shopping, Health sections
3. Progress is saved automatically to the server

### **Adding Another Device**
1. On your first device, click **👤 User** → **📱 Generate Share Link**
2. Send yourself the link (email, message, etc.)
3. Open the link on your second device
4. Both devices now sync the same progress!

### **Sharing with Travel Partner**
1. Generate a share link
2. Send it to your travel partner
3. You both can track progress together in real-time

## 💡 Pro Tips

- **Bookmark the share link** on all devices for easy access
- **Progress syncs instantly** when you check/uncheck items
- **Works offline** - changes sync when connection returns
- **No accounts needed** - just share the link or user ID
- **Reset anytime** if you want to start fresh

## 🔒 Privacy & Security

- **No personal data required** - just anonymous user IDs
- **Local storage only** - data stays on your server
- **No external services** - completely self-contained
- **Easy to reset** - generate new user ID anytime

## 🛠️ Troubleshooting

### **Progress Not Syncing?**
1. Check internet connection
2. Verify you're using the same user ID
3. Try refreshing the page
4. Check browser console for error messages

### **Want to Start Fresh?**
1. Click **👤 User** → **🔄 Reset to New User**
2. This creates a new user ID and clears all progress
3. Generate a new share link for other devices

### **Server Issues?**
- Dashboard automatically falls back to localStorage
- Your progress is still saved locally
- Will sync to server when connection is restored

---

**Need Help?** Check the browser console (F12) for detailed error messages.