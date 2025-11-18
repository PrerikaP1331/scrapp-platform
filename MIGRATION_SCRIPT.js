// Quick migration test - run in browser console
// Open browser DevTools (F12) and paste this in the console

async function runMigration() {
  try {
    console.log('Starting address field migration...');
    const response = await fetch('http://localhost:5001/api/migration/address-fields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Migration Result:', data);
    alert('Migration Complete! Check console for details.');
  } catch (error) {
    console.error('Migration failed:', error);
    alert('Migration failed: ' + error.message);
  }
}

// Run the migration
runMigration();
