#!/usr/bin/env node

/**
 * Script to fetch and display all pageViews from Firebase
 * Usage: node scripts/fetch-pageviews.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpYmVrR-g6ctC5ECNRDIzq-kfmWlZMQNc",
  authDomain: "skyway-ae947.firebaseapp.com",
  projectId: "skyway-ae947",
  storageBucket: "skyway-ae947.firebasestorage.app",
  messagingSenderId: "318466663373",
  appId: "1:318466663373:web:4261203887633b6aa85a84",
  measurementId: "G-Q9VZDKE60G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchPageViews() {
  try {
    console.log('🔍 Fetching page views from Firebase...\n');

    // Query pageViews collection ordered by timestamp (newest first)
    const pageViewsQuery = query(
      collection(db, 'pageViews'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(pageViewsQuery);

    if (querySnapshot.empty) {
      console.log('📭 No page views found in the collection.');
      return;
    }

    console.log(`📊 Found ${querySnapshot.size} page views:\n`);

    // Display each page view
    let index = 0;
    querySnapshot.forEach((doc) => {
      index++;
      const data = doc.data();
      const timestamp = data.timestamp?.toDate?.() || new Date(data.timestamp);

      console.log(`--- Page View #${index} ---`);
      console.log(`📄 Page: ${data.pagePath || 'Unknown'}`);
      console.log(`⏰ Timestamp: ${timestamp.toLocaleString()}`);
      console.log(`📅 Date: ${data.date || 'Unknown'}`);
      console.log(`👤 Viewer Type: ${data.viewerType || 'Unknown'}`);

      if (data.userAgent) {
        console.log(`🤖 User Agent: ${data.userAgent}`);
      }

      if (data.referrer) {
        console.log(`🔗 Referrer: ${data.referrer}`);
      }

      if (data.ip) {
        console.log(`🌐 IP: ${data.ip}`);
      }

      if (data.pageType) {
        console.log(`📋 Page Type: ${data.pageType}`);
      }

      if (data.source) {
        console.log(`📡 Source: ${data.source}`);
      }

      if (data.userId) {
        console.log(`👨‍💻 User ID: ${data.userId}`);
      }

      if (data.sessionId) {
        console.log(`🎯 Session ID: ${data.sessionId}`);
      }

      console.log(''); // Empty line between entries
    });

    // Display summary statistics
    console.log('='.repeat(50));
    console.log('📈 SUMMARY STATISTICS');
    console.log('='.repeat(50));

    const viewsByPage = {};
    const viewsByDate = {};
    let totalViews = 0;
    let anonymousViews = 0;
    let authenticatedViews = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalViews++;

      // Count by page
      const page = data.pagePath || 'Unknown';
      viewsByPage[page] = (viewsByPage[page] || 0) + 1;

      // Count by date
      const date = data.date || 'Unknown';
      viewsByDate[date] = (viewsByDate[date] || 0) + 1;

      // Count by viewer type
      if (data.viewerType === 'anonymous') {
        anonymousViews++;
      } else if (data.viewerType === 'authenticated') {
        authenticatedViews++;
      }
    });

    console.log(`📊 Total Page Views: ${totalViews}`);
    console.log(`👤 Anonymous Views: ${anonymousViews}`);
    console.log(`🔐 Authenticated Views: ${authenticatedViews}`);

    console.log('\n📄 Views by Page:');
    Object.entries(viewsByPage)
      .sort(([,a], [,b]) => b - a)
      .forEach(([page, count]) => {
        console.log(`  ${page}: ${count} views`);
      });

    console.log('\n📅 Views by Date:');
    Object.entries(viewsByDate)
      .sort(([a], [b]) => b.localeCompare(a))
      .forEach(([date, count]) => {
        console.log(`  ${date}: ${count} views`);
      });

  } catch (error) {
    console.error('❌ Error fetching page views:', error);
    process.exit(1);
  }
}

// Run the script
fetchPageViews().then(() => {
  console.log('✅ Script completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
