const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

async function updateWebsiteUrls() {
  const inputCsvPath = path.join(require('os').homedir(), 'Desktop', 'flight_schools_clean.csv');
  const outputCsvPath = path.join(require('os').homedir(), 'Desktop', 'flight_schools_updated.csv');

  // Read existing data
  const schools = [];
  const fileStream = fs.createReadStream(inputCsvPath);

  await new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      .on('data', (row) => {
        schools.push({
          State: row.State,
          'School Name': row['School Name'],
          Address: row.Address,
          Phone: row.Phone,
          Email: row.Email,
          Website: row.Website,
          Airport: row.Airport,
          Description: row.Description
        });
      })
      .on('end', () => resolve())
      .on('error', reject);
  });

  console.log(`Loaded ${schools.length} schools from CSV`);

  // Configuration
  const CONCURRENT_BATCH_SIZE = 10; // Process 10 schools at once
  const BATCH_DELAY = 1500; // 1.5 seconds between batches

  let updatedCount = 0;
  let errorCount = 0;

  // Function to process a single school
  async function processSchool(school, browser) {
    if (!school.Website || !school.Website.includes('flightschoollist.com')) {
      console.log(`Skipping ${school['School Name']} - no flightschoollist URL`);
      return { success: false, reason: 'no_flightschoollist_url' };
    }

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Visit the school's flightschoollist page
      await page.goto(school.Website, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      // Wait a moment for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try multiple selectors for the website button
      const websiteSelectors = [
        'a.btn-primary[href^="http"]:not([href*="flightschoollist.com"])',
        'a.btn[href^="http"]:not([href*="flightschoollist.com"])',
        '.btn-primary[href^="http"]:not([href*="flightschoollist.com"])',
        'a[target="_blank"][href^="http"]:not([href*="flightschoollist.com"])',
        'a:contains("Visit Website")[href^="http"]',
        'a:contains("Website")[href^="http"]',
        'a[href^="http"]:not([href*="flightschoollist.com"]):not([href*="mailto:"])'
      ];

      let actualWebsite = null;

      for (const selector of websiteSelectors) {
        try {
          const links = await page.$$eval(selector, links =>
            links.map(link => ({
              href: link.href,
              text: link.textContent.trim()
            })).filter(link =>
              link.href &&
              link.href.startsWith('http') &&
              !link.href.includes('flightschoollist.com') &&
              !link.href.includes('mailto:') &&
              !link.href.includes('javascript:')
            )
          );

          if (links.length > 0) {
            // Take the first valid external link
            actualWebsite = links[0].href;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      await page.close();

      if (actualWebsite) {
        school.Website = actualWebsite;
        return { success: true, website: actualWebsite };
      } else {
        return { success: false, reason: 'no_external_website' };
      }

    } catch (error) {
      return { success: false, reason: error.message };
    }
  }

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  // Process schools in batches
  for (let i = 0; i < schools.length; i += CONCURRENT_BATCH_SIZE) {
    const batchEnd = Math.min(i + CONCURRENT_BATCH_SIZE, schools.length);
    const batch = schools.slice(i, batchEnd);

    console.log(`\n--- Processing batch ${Math.floor(i / CONCURRENT_BATCH_SIZE) + 1}: schools ${i + 1}-${batchEnd} ---`);

    // Process batch concurrently
    const promises = batch.map(async (school, batchIndex) => {
      const result = await processSchool(school, browser);

      if (result.success) {
        updatedCount++;
        console.log(`✅ ${school['School Name']}: ${result.website}`);
      } else if (result.reason === 'no_flightschoollist_url') {
        // Skip silently
      } else if (result.reason === 'no_external_website') {
        console.log(`⚠️  ${school['School Name']}: No external website found`);
      } else {
        errorCount++;
        console.log(`❌ ${school['School Name']}: ${result.reason}`);
      }
    });

    // Wait for all schools in this batch to complete
    await Promise.all(promises);

    // Progress update
    const totalProcessed = Math.min(i + CONCURRENT_BATCH_SIZE, schools.length);
    console.log(`📊 Progress: ${totalProcessed}/${schools.length} schools processed`);
    console.log(`   Updated: ${updatedCount}, Errors: ${errorCount}`);

    // Delay between batches to be respectful
    if (batchEnd < schools.length) {
      console.log(`⏳ Waiting ${BATCH_DELAY}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }

  await browser.close();

  // Save updated CSV
  const csvWriter = createCsvWriter({
    path: outputCsvPath,
    header: [
      { id: 'State', title: 'State' },
      { id: 'School Name', title: 'School Name' },
      { id: 'Address', title: 'Address' },
      { id: 'Phone', title: 'Phone' },
      { id: 'Email', title: 'Email' },
      { id: 'Website', title: 'Website' },
      { id: 'Airport', title: 'Airport' },
      { id: 'Description', title: 'Description' }
    ]
  });

  await csvWriter.writeRecords(schools);

  console.log(`\n✅ Update complete!`);
  console.log(`📊 Results:`);
  console.log(`   - Total schools processed: ${schools.length}`);
  console.log(`   - Websites updated: ${updatedCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`💾 Updated CSV saved to: ${outputCsvPath}`);
}

// Run the update
updateWebsiteUrls().catch(console.error);
