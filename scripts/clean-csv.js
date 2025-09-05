const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function cleanCSV() {
  const inputPath = path.join(require('os').homedir(), 'Desktop', 'flight_schools.csv');
  const outputPath = path.join(require('os').homedir(), 'Desktop', 'flight_schools_clean.csv');

  const schools = [];

  // Read and parse the existing CSV
  const fileStream = fs.createReadStream(inputPath);

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(csv())
      .on('data', (row) => {
        // Clean up each field
        const cleanedRow = {
          State: (row.State || '').trim(),
          'School Name': (row['School Name'] || '').trim(),
          Address: (row.Address || '').trim(),
          Phone: (row.Phone || '').trim(),
          Email: (row.Email || '').trim(),
          Website: (row.Website || '').trim(),
          Airport: (row.Airport || '').trim(),
          Description: (row.Description || '')
            .replace(/\n/g, ' ')           // Replace line breaks with spaces
            .replace(/\s+/g, ' ')          // Replace multiple whitespace with single space
            .replace(/^Description\s*/, '') // Remove "Description" prefix
            .trim()
        };

        // Only add rows that have at least a school name
        if (cleanedRow['School Name'] && cleanedRow['School Name'] !== 'School Name') {
          schools.push(cleanedRow);
        }
      })
      .on('end', async () => {
        console.log(`Processed ${schools.length} valid school records`);

        // Create clean CSV
        const csvWriter = createCsvWriter({
          path: outputPath,
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
        console.log(`Clean CSV saved to: ${outputPath}`);
        console.log(`Total schools in clean file: ${schools.length}`);

        resolve();
      })
      .on('error', reject);
  });
}

// Run the cleanup
cleanCSV().catch(console.error);
