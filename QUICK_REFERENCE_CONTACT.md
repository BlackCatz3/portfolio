# 📞 Quick Reference - Contact Section

## Admin URL
```
http://localhost:8080/admin/contact
```

---

## What You Can Manage

### Tab 1: Contact Info
- Email
- Phone
- Location

### Tab 2: Social Links
- LinkedIn URL
- GitHub URL
- Twitter URL

### Tab 3: Messages
- View contact form submissions
- Mark as read/unread
- Delete messages

---

## What's Displayed in Frontend

### Contact Section Shows:
1. **Contact Form** (left side)
   - Name, Email, Message fields
   - Saves to Messages tab

2. **Contact Info Cards** (right side - top)
   - Email card
   - Location card
   - Phone card

3. **Social Links** (right side - middle)
   - LinkedIn icon (if URL is set)
   - GitHub icon (if URL is set)
   - Twitter icon (if URL is set)

4. **Download CV Card** (right side - bottom)
   - "Looking for developer?" card
   - Download CV button
   - Uses CV from Home Section

---

## Quick Steps

### To Update Contact Info:
1. Go to `/admin/contact`
2. Click "Contact Info" tab
3. Fill email, phone, location
4. Click "Save Contact Info"

### To Update Social Links:
1. Go to `/admin/contact`
2. Click "Social Links" tab
3. Fill LinkedIn, GitHub, Twitter URLs
4. Click "Save Social Links"

### To View Messages:
1. Go to `/admin/contact`
2. Click "Messages" tab
3. View all contact form submissions
4. Mark as read or delete as needed

### To Set CV for Download:
1. Go to `/admin/home` (NOT contact!)
2. Click "Media & CV" tab
3. Fill "Resume URL"
4. Click "Save"

---

## Important Notes

✅ All Contact Section data is in ONE admin page
✅ Use tabs to organize different types of data
✅ Social icons only show if URLs are filled
✅ CV is managed in Home Section (intentional)
✅ Messages auto-save when users submit contact form
✅ All data is real-time from database

---

## Database Tables

- `contact` - email, phone, location, social URLs
- `contact_messages` - form submissions
- `about` - resume_url (for CV download)

---

## API Endpoints

- `GET /api/contact` - Get contact data
- `PUT /api/contact` - Update contact data
- `GET /api/messages` - Get messages
- `POST /api/messages` - Create message
- `PATCH /api/messages/:id/status` - Update status
- `DELETE /api/messages/:id` - Delete message

---

## Troubleshooting

**Social icons not showing?**
- Make sure URLs are filled in Social Links tab
- URLs must be complete (https://...)

**Download CV not working?**
- CV is managed in Home Section, not Contact
- Go to `/admin/home` → Media & CV tab
- Fill Resume URL field

**Messages not appearing?**
- Click Messages tab to load
- Check if contact form is working on frontend
- Verify backend is running on port 5000

**Changes not showing in frontend?**
- Make sure you clicked Save button
- Refresh frontend page
- Check browser console for errors

---

## Summary

**Admin Page:** `/admin/contact`
**Tabs:** Contact Info, Social Links, Messages
**Frontend:** Contact Section with form, cards, social icons, CV download
**Status:** ✅ COMPLETE AND WORKING
