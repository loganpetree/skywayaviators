# Flight Schools Scraper

This script uses Puppeteer to scrape flight school data from FlightSchoolList.com and save it to a CSV file on your desktop.

## Usage

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Run the scraper:
   ```bash
   npm run scrape-flightschools
   ```

   Or run directly:
   ```bash
   node scripts/scrape-flight-schools.js
   ```

## What it does

- Visits https://flightschoollist.com/school-type.php?id_fst=1
- Iterates through all US state tabs
- For each state, extracts all flight schools (handles pagination)
- For each school, visits the detail page and extracts:
  - School name
  - Address
  - Phone number
  - Email
  - Website
  - Airport information
  - Description
- Saves all data to `flight_schools.csv` on your desktop

## Output

The CSV file will contain the following columns:
- State
- School Name
- Address
- Phone
- Email
- Website
- Airport
- Description

## Notes

- The script runs in non-headless mode so you can see the browser in action
- It includes error handling and will continue processing even if some schools fail
- Processing all states may take several hours depending on the number of schools
- The script respects the website by adding delays between requests
