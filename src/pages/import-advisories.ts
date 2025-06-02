import { fetchAllAdvisories } from '../utils/fetchAdvisories';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function importAdvisories() {
  try {
    const advisories = await fetchAllAdvisories();
    
    // Create advisories directory if it doesn't exist
    await fs.mkdir('src/content/advisories', { recursive: true });

    // Write each advisory to a file
    for (const advisory of advisories) {
      await fs.writeFile(advisory.path, advisory.content, 'utf-8');
      console.log(`Created advisory: ${path.basename(advisory.path)}`);
    }

  } catch (error) {
    console.error('Error importing advisories:', error);
    throw error;
  }
}

// Run the import
importAdvisories();