# Fetch PageViews Script

This script fetches and displays all pageViews from the Firebase `pageViews` collection.

## Usage

### Option 1: Using npm script (recommended)
```bash
npm run fetch-pageviews
```

### Option 2: Direct node execution
```bash
node scripts/fetch-pageviews.js
```

## What it does

The script connects to your Firebase project and:

1. **Fetches all pageViews** from the `pageViews` collection
2. **Displays individual page view details** including:
   - Page path
   - Timestamp
   - Date
   - Viewer type (anonymous/authenticated)
   - User agent
   - Referrer
   - IP address
   - Page type
   - Source
   - User ID (if available)
   - Session ID (if available)

3. **Provides summary statistics**:
   - Total page views
   - Anonymous vs authenticated views
   - Views grouped by page
   - Views grouped by date

## Output Format

The script displays results in a human-readable format with:
- 📊 Emojis for visual clarity
- Organized sections for each page view
- Summary statistics at the end
- Proper formatting and spacing

## Firebase Configuration

The script uses the same Firebase configuration as your main application, so no additional setup is required. It automatically connects to your `skyway-ae947` project.

## Example Output

```
🔍 Fetching page views from Firebase...

📊 Found 13 page views:

--- Page View #1 ---
📄 Page: /
⏰ Timestamp: 9/8/2025, 2:13:17 PM
📅 Date: 2025-09-08
👤 Viewer Type: anonymous
🤖 User Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...
🔗 Referrer: http://localhost:3003/
🌐 IP: ::1
📋 Page Type: home
📡 Source: direct

==================================================
📈 SUMMARY STATISTICS
==================================================
📊 Total Page Views: 13
👤 Anonymous Views: 13
🔐 Authenticated Views: 0

📄 Views by Page:
  /: 13 views

📅 Views by Date:
  2025-09-08: 13 views
```

## Error Handling

The script includes proper error handling and will:
- Display clear error messages if Firebase connection fails
- Show "No page views found" if the collection is empty
- Exit with appropriate status codes

## Data Structure

The script expects the `pageViews` collection to contain documents with the following structure:

```javascript
{
  pagePath: string,
  timestamp: Date,
  date: string, // YYYY-MM-DD format
  viewerType: 'anonymous' | 'authenticated',
  userAgent?: string,
  referrer?: string | null,
  ip?: string,
  pageType?: string,
  source?: string,
  userId?: string,
  sessionId?: string
}
```
