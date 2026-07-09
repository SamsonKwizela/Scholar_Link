# ScholarLink - Application Email Setup Guide

## Overview
When a user clicks "Apply" for a scholarship or internship, their complete profile information is now sent to:
1. **Admin Email** - Detailed notification with all applicant information
2. **Admin App** - Application stored in database for admin dashboard
3. **User Email** - Confirmation email sent to the applicant

## What Gets Sent

### Profile Information
- ✅ Profile Picture (avatar)
- ✅ Full Name
- ✅ Email Address
- ✅ Role
- ✅ Location
- ✅ University
- ✅ About/Bio

### Documents
- ✅ CV/Resume
- ✅ Cover Letter
- ✅ Assessment Results
- ✅ Certificates

### Additional Information
- ✅ Interests (from profile)
- ✅ Application Date
- ✅ Opportunity Details

## Setup Instructions

### Step 1: Configure Email Service (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" and name it "ScholarLink"
   - Copy the 16-character app password generated

3. **Update Backend `.env` File**:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/scholalink
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d

   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ADMIN_EMAIL=admin@scholalink.com
   ```

   Replace:
   - `your-email@gmail.com` with your actual Gmail address
   - `your-16-digit-app-password` with the app password you generated
   - `admin@scholalink.com` with the admin's email address

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install nodemailer and all other dependencies.

### Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on http://localhost:8000

### Step 4: Test the Application

1. **Create/Update User Profile**:
   - Go to User Profile page
   - Upload profile picture
   - Fill in all details
   - Upload CV
   - Upload Cover Letter
   - Add interests

2. **Apply for an Opportunity**:
   - Navigate to Scholarships or Internships
   - Click "View Details" on any opportunity
   - Click "Apply" button
   - Confirm the application

3. **Check Admin Email**:
   - Admin will receive a beautifully formatted HTML email with:
     - All applicant information
     - Links to view documents
     - Application details
     - Action required notice

4. **Check Admin Dashboard**:
   - Application will appear in the admin dashboard
   - All data is stored in MongoDB
   - Admin can update application status

## Email Templates

### Admin Notification Email
The admin receives a comprehensive email with:
- Opportunity details (title, type, ID, date)
- Complete applicant information
- Cover letter (if provided)
- Statement of interest (if provided)
- Links to all uploaded documents:
  - CV/Resume
  - Profile Picture
  - Assessment Results
  - Certificates
- Action required notice

### User Confirmation Email
The applicant receives a confirmation email with:
- Application ID
- Opportunity details
- Application date
- Current status
- Thank you message

## Database Schema

### Application Model
```javascript
{
  opportunityId: String,
  opportunityType: String (scholarship/internship),
  opportunityTitle: String,
  applicant: {
    userId: ObjectId,
    name: String,
    email: String,
    role: String,
    location: String,
    university: String,
    about: String,
    avatar: String (URL),
    cv: String (URL),
    coverLetter: String (URL)
  },
  interest: String,
  results: String,
  certificates: [String],
  applicationDate: Date,
  status: String (Pending/Under Review/Accepted/Rejected),
  emailSent: Boolean,
  emailSentAt: Date
}
```

## API Endpoints

### POST /api/applications/apply
Submit a new application

**Request Body:**
```json
{
  "opportunityId": "string",
  "opportunityType": "scholarship" | "internship",
  "opportunityTitle": "string",
  "applicant": {
    "name": "string",
    "email": "string",
    "role": "string",
    "location": "string",
    "university": "string",
    "about": "string",
    "avatar": "string (URL)",
    "cv": "string (URL)",
    "coverLetter": "string (URL)"
  },
  "interest": "string",
  "results": "string",
  "certificates": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": { /* application object */ }
}
```

### GET /api/applications
Get all applications (Admin only)

### GET /api/applications/user/me
Get current user's applications

### GET /api/applications/:id
Get single application

### PUT /api/applications/:id
Update application status (Admin only)

## Troubleshooting

### Email Not Sending
1. Check that EMAIL_USER and EMAIL_PASS are correctly set in .env
2. Verify 2-Factor Authentication is enabled on Gmail
3. Ensure you're using an App Password, not your regular password
4. Check backend console for error messages

### Documents Not Appearing in Email
1. Ensure files are uploaded before applying
2. Check that file URLs are being saved to profile
3. Verify localStorage has the correct data

### Application Not Saving
1. Check MongoDB connection
2. Verify backend server is running
3. Check browser console for errors
4. Ensure user is authenticated

## Security Notes

- Never commit .env file to version control
- Use App Passwords instead of regular Gmail passwords
- Rotate credentials regularly
- Consider using a dedicated email service for production (SendGrid, Mailgun, etc.)
- All user data is validated before storage
- JWT authentication protects all routes

## Production Considerations

For production deployment, consider:
1. Using a dedicated email service (SendGrid, Mailgun, AWS SES)
2. Implementing file upload to cloud storage (AWS S3, Cloudinary)
3. Adding email templates with a template engine
4. Implementing email queuing for better performance
5. Adding rate limiting to prevent spam
6. Using environment-specific .env files

## Support

For issues or questions, check the backend console logs for detailed error messages.