# 📞 Contact Section - Complete Guide

## Overview
The Contact Section is a complete, all-in-one admin page that manages everything displayed in the frontend Contact Section.

---

## Admin Page Structure

**URL:** `http://localhost:8080/admin/contact`
**Component:** `AdminContact.tsx`
**Database Tables:** `contact`, `contact_messages`

### Tabs:

1. **Contact Info** - Email, Phone, Location
2. **Social Links** - LinkedIn, GitHub, Twitter URLs
3. **Messages** - Contact form submissions

---

## What's Displayed in Frontend Contact Section

The frontend Contact Section (`ContactSection.tsx`) displays:

### 1. Contact Form (Left Side)
- Name input
- Email input
- Message textarea
- Send Message button

**Functionality:**
- Submits to `POST /api/messages`
- Saves to `contact_messages` table
- Shows success/error toast notification
- Clears form after successful submission

---

### 2. Contact Info Cards (Right Side - Top)
Three cards displaying:
- **Email** - with Mail icon
- **Location** - with MapPin icon
- **Phone** - with Phone icon

**Data Source:** `contact` table (email, phone, location fields)
**API:** `GET /api/contact`

---

### 3. Social Links (Right Side - Middle)
Icons for social media platforms:
- **LinkedIn** - if linkedin_url is set
- **GitHub** - if github_url is set
- **Twitter** - if twitter_url is set

**Data Source:** `contact` table (linkedin_url, github_url, twitter_url fields)
**API:** `GET /api/contact`
**Note:** Only displays icons for URLs that are filled in

---

### 4. "Looking for developer?" Card (Right Side - Bottom)
Purple gradient card with:
- Heading: "Looking for a developer?"
- Description text
- **Download CV** button

**Data Source:** `about` table (resume_url field) - from Home Section
**API:** `GET /api/about`
**Note:** This is the ONLY cross-section reference. CV is managed in Home Section but displayed here.

---

## Admin Page Features

### Tab 1: Contact Info
**Fields:**
- Email (type: email)
- Phone (type: text)
- Location (type: text)

**Icons:**
- Mail icon for Email
- Phone icon for Phone
- MapPin icon for Location

**Save Button:** Updates all contact info fields at once

---

### Tab 2: Social Links
**Fields:**
- LinkedIn URL (type: url)
- GitHub URL (type: url)
- Twitter URL (type: url)

**Icons:**
- Linkedin icon for LinkedIn
- Github icon for GitHub
- Twitter icon for Twitter

**Placeholders:**
- `https://linkedin.com/in/yourprofile`
- `https://github.com/yourusername`
- `https://twitter.com/yourusername`

**Save Button:** Updates all social links at once

---

### Tab 3: Messages
**Display:**
- List of all contact form submissions
- Each message shows:
  - Name (bold)
  - Status badge (unread/read)
  - Email (muted)
  - Message content
  - Timestamp
  - Action buttons (Mark as Read, Delete)

**Features:**
- Auto-loads messages when tab is clicked
- Mark as Read button (Eye icon) - only shows for unread messages
- Delete button (Trash icon) - with confirmation dialog
- Status badge color:
  - "unread" = default (primary color)
  - "read" = secondary (muted)

**Empty State:**
- Shows MessageSquare icon
- Text: "No messages yet"

---

## Database Structure

### `contact` table
```sql
CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  twitter_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `contact_messages` table
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Contact Info & Social Links
- `GET /api/contact` - Get contact data
- `PUT /api/contact` - Update contact data (all fields)

**Request Body (PUT):**
```json
{
  "email": "hello@example.com",
  "phone": "+1 234 567 8900",
  "location": "City, Country",
  "linkedin_url": "https://linkedin.com/in/profile",
  "github_url": "https://github.com/username",
  "twitter_url": "https://twitter.com/username"
}
```

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message (from frontend form)
- `PATCH /api/messages/:id/status` - Update message status
- `DELETE /api/messages/:id` - Delete message

**Request Body (POST):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work with you..."
}
```

**Request Body (PATCH status):**
```json
{
  "status": "read"
}
```

---

## Frontend-Admin Mapping

| Frontend Element | Admin Tab | Database Field | Table |
|------------------|-----------|----------------|-------|
| Email card | Contact Info | email | contact |
| Phone card | Contact Info | phone | contact |
| Location card | Contact Info | location | contact |
| LinkedIn icon | Social Links | linkedin_url | contact |
| GitHub icon | Social Links | github_url | contact |
| Twitter icon | Social Links | twitter_url | contact |
| Contact form submissions | Messages | name, email, message, status | contact_messages |
| Download CV button | (Home Section) | resume_url | about |

---

## How to Use

### Step 1: Fill Contact Info
1. Go to `/admin/contact`
2. Click **Contact Info** tab
3. Fill in:
   - Email (e.g., hello@portfolio.dev)
   - Phone (e.g., +62 812 3456 7890)
   - Location (e.g., Jakarta, Indonesia)
4. Click **Save Contact Info**

### Step 2: Add Social Links
1. Click **Social Links** tab
2. Fill in URLs:
   - LinkedIn URL (full URL)
   - GitHub URL (full URL)
   - Twitter URL (full URL)
3. Click **Save Social Links**
4. Leave empty if you don't want to display that social link

### Step 3: Manage Messages
1. Click **Messages** tab
2. View all contact form submissions
3. Click Eye icon to mark as read
4. Click Trash icon to delete (with confirmation)

### Step 4: Set CV for Download Button
1. Go to `/admin/home` (Home Section)
2. Click **Media & CV** tab
3. Fill in Resume URL
4. This will be used by the Download CV button in Contact Section

---

## Important Notes

1. **All-in-One Page:** Everything for Contact Section is in ONE admin page with tabs
2. **No Mixing:** Contact data is NOT mixed with other sections (except CV download)
3. **Real-time Data:** All data is fetched from database, no hardcoded values
4. **Social Links:** Only display in frontend if URL is filled in admin
5. **CV Download:** Uses resume_url from Home Section (about table)
6. **Messages:** Automatically saved when users submit contact form on frontend
7. **Status Management:** Messages can be marked as read/unread for organization

---

## Verification Checklist

✅ Contact Info displays correctly in frontend cards
✅ Social Links display correctly (only if URLs are set)
✅ Contact form works and saves to database
✅ Messages appear in admin Messages tab
✅ Mark as Read functionality works
✅ Delete message functionality works
✅ Download CV button works (uses Home Section CV)
✅ All data is real-time from database
✅ No hardcoded values in frontend

---

## Cross-Section Reference

**Only ONE cross-section reference exists:**
- Contact Section's "Download CV" button uses `resume_url` from Home Section (about table)
- This is intentional because CV is managed in Home Section
- All other data in Contact Section comes from `contact` and `contact_messages` tables

---

## Summary

The Contact Section admin page is now complete with:
- ✅ 3 tabs (Contact Info, Social Links, Messages)
- ✅ All data in one place
- ✅ No mixing with other sections
- ✅ Real-time database integration
- ✅ Full CRUD functionality for messages
- ✅ Clean, organized interface

**Everything displayed in the frontend Contact Section can be managed from `/admin/contact`!**
