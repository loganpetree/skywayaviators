const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Function to load existing data from CSV
async function loadExistingData(csvPath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileStream = fs.createReadStream(csvPath);

    fileStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Remove header row
        results.shift();
        resolve(results);
      })
      .on('error', reject);
  });
}

// Function to get completed states
function getCompletedStates(existingData) {
  const stateCounts = {};
  existingData.forEach(row => {
    if (row.State && row.State !== 'State') {
      stateCounts[row.State] = (stateCounts[row.State] || 0) + 1;
    }
  });
  return Object.keys(stateCounts);
}

async function scrapeFlightSchools() {
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see the browser in action
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    // Check for existing data and load it
    const csvPath = path.join(require('os').homedir(), 'Desktop', 'flight_schools.csv');
    let allSchools = [];
    let completedStates = [];
    let existingDataLength = 0;

    if (fs.existsSync(csvPath)) {
      console.log('Loading existing data from CSV...');
      try {
        const existingData = await loadExistingData(csvPath);
        allSchools = existingData;
        existingDataLength = existingData.length;
        completedStates = getCompletedStates(existingData);
        console.log(`Loaded ${allSchools.length} existing schools from ${completedStates.length} completed states`);
        console.log('Completed states:', completedStates.join(', '));
      } catch (error) {
        console.log('Error loading existing data, starting fresh:', error.message);
      }
    }

    console.log('Navigating to flight schools page...');
    await page.goto('https://flightschoollist.com/school-type.php?id_fst=1', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Generate state URLs directly using the known pattern
    const usStates = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    const stateLinks = usStates.map(state => ({
      name: state,
      url: `https://flightschoollist.com/${state.toLowerCase().replace(/\s+/g, '-')}-airplane-flight-schools/`
    }));

    console.log(`Generated ${stateLinks.length} US state URLs to scrape`);
    console.log(`Will skip ${completedStates.length} completed states and resume with remaining states`);

    // Process each state
    for (let i = 0; i < stateLinks.length; i++) {
      const state = stateLinks[i];

      // Skip completed states
      if (completedStates.includes(state.name)) {
        console.log(`\nSkipping ${state.name} (${i + 1}/${stateLinks.length}) - already completed`);
        continue;
      }

      console.log(`\nProcessing ${state.name} (${i + 1}/${stateLinks.length})`);

      try {
        await page.goto(state.url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait a bit for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // First, try to get all schools on one page by modifying the URL
        console.log(`  Attempting to get all schools for ${state.name} on one page...`);

        const originalUrl = page.url();
        const allSchoolsUrl = originalUrl + (originalUrl.includes('?') ? '&' : '?') + 'maxRows_rsSchoolLocation=100';

        try {
          console.log(`  Trying URL with maxRows=100: ${allSchoolsUrl}`);
          await page.goto(allSchoolsUrl, { waitUntil: 'networkidle0', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Handle any overlays that might appear
          await handleOverlays(page);

          // Get all schools from this single page
          const allSchoolsFromPage = await getSchoolsFromPage(page, state.name);
          allSchools.push(...allSchoolsFromPage);

          console.log(`  Successfully got ${allSchoolsFromPage.length} schools on one page`);

        } catch (error) {
          console.log(`  Failed to get all schools on one page: ${error.message}`);
          console.log(`  Falling back to pagination method...`);

          // Reset to original page and use pagination
          await page.goto(originalUrl, { waitUntil: 'networkidle0', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 2000));

          await handleOverlays(page);

          // Get schools from first page
          const firstPageSchools = await getSchoolsFromPage(page, state.name);
          allSchools.push(...firstPageSchools);

          console.log(`  Found ${firstPageSchools.length} schools on first page`);

          // Get total number of schools to determine if we need pagination
          const totalSchools = await page.evaluate(() => {
            // Look for "X - Y of Z" pattern
            const textElements = Array.from(document.querySelectorAll('*')).map(el => el.textContent);
            for (const text of textElements) {
              const match = text.match(/(\d+)\s*-\s*\d+\s*of\s*(\d+)/);
              if (match) {
                return parseInt(match[2]); // Return total count
              }
            }
            return null;
          });

          console.log(`  Total schools for ${state.name}: ${totalSchools}`);

          if (totalSchools && totalSchools > firstPageSchools.length) {
            // We need to paginate
            let currentPage = 1;
            const schoolsPerPage = 10; // Based on the URLs shown

            while (currentPage * schoolsPerPage < totalSchools) {
              const nextPageUrl = `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}pageNum_rsSchoolLocation=${currentPage}&maxRows_rsSchoolLocation=10&totalRows_rsSchoolLocation=${totalSchools}`;

              console.log(`  Processing page ${currentPage + 1} for ${state.name}...`);
              console.log(`  Navigating to: ${nextPageUrl}`);

              try {
                await handleOverlays(page);
                await page.goto(nextPageUrl, { waitUntil: 'networkidle0', timeout: 30000 });
                await new Promise(resolve => setTimeout(resolve, 3000));
                await handleOverlays(page);

                const pageSchools = await getSchoolsFromPage(page, state.name);
                allSchools.push(...pageSchools);

                console.log(`  Found ${pageSchools.length} schools on page ${currentPage + 1}`);

                currentPage++;

                // Safety check to avoid infinite loops
                if (currentPage > 10) {
                  console.log(`  Safety break: too many pages for ${state.name}`);
                  break;
                }

              } catch (error) {
                console.error(`  Error processing page ${currentPage + 1}:`, error.message);
                break;
              }
            }
          }
        }

        const stateSchools = allSchools.filter(school => school.state === state.name);
        console.log(`  Total schools found for ${state.name}: ${stateSchools.length}`);

        // Add delay between states to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error processing ${state.name}:`, error.message);
        continue;
      }
    }

    // Save to CSV (append to existing data)

    // Check if we have new data to add
    const newSchoolsCount = allSchools.length - existingDataLength;

    if (newSchoolsCount > 0) {
      console.log(`\nAdding ${newSchoolsCount} new schools to CSV...`);

      const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
          { id: 'state', title: 'State' },
          { id: 'schoolName', title: 'School Name' },
          { id: 'address', title: 'Address' },
          { id: 'phone', title: 'Phone' },
          { id: 'email', title: 'Email' },
          { id: 'website', title: 'Website' },
          { id: 'airport', title: 'Airport' },
          { id: 'description', title: 'Description' }
        ],
        append: fs.existsSync(csvPath) // Append if file exists
      });

      await csvWriter.writeRecords(allSchools);
      console.log(`\nScraping complete! Total of ${allSchools.length} schools saved to ${csvPath}`);
      console.log(`Added ${newSchoolsCount} new schools in this session`);
    } else {
      console.log(`\nNo new schools to add. Total schools in CSV: ${allSchools.length}`);
    }

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

async function getSchoolsFromPage(page, stateName) {
  // Try different selectors for school listings
  const schoolSelectors = [
    'table tbody tr td:first-child a', // Table format
    '.school-list a',
    '.school-item a',
    'a[href*="school-detail"]',
    'a[href*="school="]',
    'h3 a', // Common heading link pattern
    '.school-name a'
  ];

  let schoolLinks = [];

  for (const selector of schoolSelectors) {
    try {
      const links = await page.$$eval(selector, links =>
        links.map(link => ({
          name: link.textContent.trim(),
          url: link.href
        })).filter(link =>
          link.name &&
          link.url &&
          link.url.includes('school') &&
          !link.url.includes('mailto:') &&
          link.name.length > 3 // Filter out very short names
        )
      );

      if (links.length > 0) {
        schoolLinks = links;
        console.log(`    Found ${links.length} schools using selector: ${selector}`);
        break;
      }
    } catch (e) {
      continue;
    }
  }

  // If no schools found with specific selectors, try a broader approach
  if (schoolLinks.length === 0) {
    try {
      const allLinks = await page.$$eval('a', links =>
        links.map(link => ({
          name: link.textContent.trim(),
          url: link.href
        })).filter(link =>
          link.name &&
          link.url &&
          (link.url.includes('school-detail') || link.url.includes('school=')) &&
          link.name.length > 5 &&
          !link.name.toLowerCase().includes('home') &&
          !link.name.toLowerCase().includes('about') &&
          !link.name.toLowerCase().includes('contact')
        )
      );
      schoolLinks = allLinks;
      console.log(`    Found ${allLinks.length} schools using broad selector`);
    } catch (e) {
      console.error('    Error finding schools:', e.message);
    }
  }

  const schools = [];

  for (let i = 0; i < Math.min(schoolLinks.length, 50); i++) { // Limit to avoid timeouts
    const school = schoolLinks[i];
    console.log(`    Processing school: ${school.name}`);

    try {
      const newPage = await page.browser().newPage();
      await newPage.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      console.log(`      Navigating to: ${school.url}`);
      await newPage.goto(school.url, { waitUntil: 'domcontentloaded', timeout: 30000 }); // Changed to domcontentloaded and shorter timeout
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content to load

      // Debug: Check if the page loaded correctly
      const pageTitle = await newPage.title();
      console.log(`      Page title: ${pageTitle}`);

      const schoolData = await extractSchoolData(newPage, school.name, stateName);
      console.log(`      Extracted data:`, JSON.stringify(schoolData, null, 2));
      schools.push(schoolData);

      await newPage.close();

      // Small delay between school requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error processing school ${school.name}:`, error.message);
      // Add basic info even if detailed scraping fails
      schools.push({
        state: stateName,
        schoolName: school.name,
        address: '',
        phone: '',
        email: '',
        website: school.url,
        airport: '',
        description: ''
      });
    }
  }

  return schools;
}

async function extractSchoolData(page, schoolName, stateName) {
  const data = {
    state: stateName,
    schoolName: schoolName,
    address: '',
    phone: '',
    email: '',
    website: '',
    airport: '',
    description: ''
  };

  try {
    // Wait for content to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract contact information using the specific structure from the website
    const contactSelectors = {
      address: [
        '.school-details-container strong:contains("Address:") + br + span',
        '.school-details-container span:contains("Address:") + br + span',
        '.school-details-container li strong:contains("Address:") + br + span'
      ],
      phone: [
        '.school-details-container strong:contains("Phone:") + br + span',
        '.school-details-container span:contains("Phone:") + br + span',
        '.school-details-container li strong:contains("Phone:") + br + span'
      ],
      email: [
        '.school-details-container strong:contains("Email:") + br + span',
        '.school-details-container span:contains("Email:") + br + span',
        '.school-details-container li strong:contains("Email:") + br + span',
        '.school-details-container a[href^="mailto:"]'
      ],
      website: [
        '.school-details-container strong:contains("Website:") + br + span',
        '.school-details-container span:contains("Website:") + br + span',
        '.school-details-container li strong:contains("Website:") + br + span',
        '.school-details-container a[href^="http"]'
      ],
      airport: [
        '.school-details-container strong:contains("Airport:") + br + span',
        '.school-details-container span:contains("Airport:") + br + span',
        '.school-details-container li strong:contains("Airport:") + br + span'
      ],
      description: [
        '.school-details-container strong:contains("Description:") + br + span',
        '.school-details-container span:contains("Description:") + br + span',
        '.school-details-container li strong:contains("Description:") + br + span',
        '.description', '.about', '.info', '[class*="desc"]', '[class*="about"]'
      ]
    };

    // Extract text content from the entire page for fallback
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    // Use specific extraction for the school-details-container structure
    try {
      const debugInfo = await page.evaluate(() => {
        const result = {};
        const debug = {
          containerFound: false,
          listItemsCount: 0,
          extractedFields: {},
          availableClasses: []
        };

        // Find the school details container
        const container = document.querySelector('.school-details-container');
        debug.containerFound = !!container;

        if (!container) {
          debug.availableClasses = Array.from(document.querySelectorAll('[class*="school"], [class*="detail"], [class*="contact"], [class*="info"]')).map(el => el.className);
          return { result, debug };
        }

        // Find all list items in the container
        const listItems = container.querySelectorAll('li');
        debug.listItemsCount = listItems.length;

        listItems.forEach((li, index) => {
          const strong = li.querySelector('strong');
          const span = li.querySelector('div span'); // The span is inside a div

          if (strong && span) {
            const label = strong.textContent.trim().toLowerCase();
            const value = span.textContent.trim();

            if (label.includes('address')) {
              result.address = value;
              debug.extractedFields.address = value;
            } else if (label.includes('phone')) {
              result.phone = value;
              debug.extractedFields.phone = value;
            } else if (label.includes('email')) {
              result.email = value;
              debug.extractedFields.email = value;
            } else if (label.includes('airport')) {
              result.airport = value;
              debug.extractedFields.airport = value;
            } else if (label.includes('website')) {
              result.website = value;
              debug.extractedFields.website = value;
            } else if (label.includes('description')) {
              result.description = value;
              debug.extractedFields.description = value;
            }
          }
        });

        // Also check for any email links
        const emailLink = container.querySelector('a[href^="mailto:"]');
        if (emailLink && !result.email) {
          result.email = emailLink.href.replace('mailto:', '');
          debug.extractedFields.emailLink = result.email;
        }

        // Check for website links
        const websiteLinks = container.querySelectorAll('a[href^="http"]');
        websiteLinks.forEach(link => {
          const href = link.href;
          if (href && !href.includes('mailto:') && !href.includes('javascript:') && !result.website) {
            result.website = href;
            debug.extractedFields.websiteLink = href;
          }
        });

        return { result, debug };
      });

      console.log(`      Debug info:`, debugInfo.debug);
      console.log(`      Raw extracted data:`, debugInfo.result);

      // Apply the extracted contact info
      Object.assign(data, debugInfo.result);

      // Clean up the description field to remove line breaks and extra whitespace
      if (data.description) {
        data.description = data.description
          .replace(/\n/g, ' ')           // Replace line breaks with spaces
          .replace(/\s+/g, ' ')          // Replace multiple whitespace with single space
          .trim();                       // Remove leading/trailing whitespace
      }

    } catch (e) {
      console.log(`Error extracting contact info using evaluate:`, e.message);
    }

    // Fallback: use the original selector approach for any missing fields
    for (const [field, selectors] of Object.entries(contactSelectors)) {
      if (data[field]) continue; // Skip if we already have this field

      for (const selector of selectors) {
        try {
          let value = '';

          if (field === 'email') {
            const emailElement = await page.$(selector);
            if (emailElement) {
              const href = await page.evaluate(el => el.href, emailElement);
              value = href ? href.replace('mailto:', '') : '';
            }
          } else if (field === 'website') {
            const linkElements = await page.$$(selector);
            for (const link of linkElements) {
              const href = await page.evaluate(el => el.href, link);
              if (href && !href.includes('mailto:') && !href.includes('javascript:') && href.startsWith('http')) {
                value = href;
                break;
              }
            }
          } else {
            const element = await page.$(selector);
            if (element) {
              value = await page.evaluate(el => el.textContent.trim(), element);
            }
          }

          if (value && value.length > 3) {
            data[field] = value.trim();
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // If we didn't get a website, use the current URL
    if (!data.website) {
      data.website = page.url();
    }

    // Fallback: extract information from page text using regex patterns
    if (!data.phone) {
      const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;
      const phoneMatch = pageText.match(phoneRegex);
      if (phoneMatch) {
        data.phone = phoneMatch[0];
      }
    }

    if (!data.email) {
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      const emailMatch = pageText.match(emailRegex);
      if (emailMatch) {
        data.email = emailMatch[0];
      }
    }

  } catch (error) {
    console.error(`Error extracting data for ${schoolName}:`, error.message);
  }

  return data;
}

// Function to handle ads, popups, and overlays
async function handleOverlays(page) {
  try {
    // Common overlay selectors
    const overlaySelectors = [
      '.modal-overlay',
      '.popup-overlay',
      '.ad-overlay',
      '[class*="overlay"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '.close-button',
      '.dismiss-button',
      'button[aria-label*="Close"]',
      'button[aria-label*="Dismiss"]',
      '.cookie-banner button',
      '.gdpr-banner button',
      'button:contains("Accept")',
      'button:contains("Close")',
      'button:contains("×")',
      'a:contains("×")'
    ];

    for (const selector of overlaySelectors) {
      try {
        const elements = await page.$$(selector);
        for (const element of elements) {
          const isVisible = await page.evaluate(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
          }, element);

          if (isVisible) {
            console.log(`    Dismissing overlay: ${selector}`);
            await element.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (e) {
        // Continue if selector fails
      }
    }

    // Also try to click on any elements that might be covering content
    try {
      await page.evaluate(() => {
        // Remove any fixed position elements that might be overlays
        const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
        fixedElements.forEach(el => {
          if (el.offsetWidth > 100 && el.offsetHeight > 100) {
            el.style.display = 'none';
          }
        });
      });
    } catch (e) {
      // Continue if evaluation fails
    }

  } catch (error) {
    console.log(`    Error handling overlays: ${error.message}`);
  }
}

// Run the scraper
scrapeFlightSchools().catch(console.error);
