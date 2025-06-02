import { Octokit } from 'octokit';
import { marked } from 'marked';

export async function fetchAdvisories() {
  const octokit = new Octokit();
  const owner = 'odaysec';
  const repo = 'advisory';

  try {
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ''
    });

    // Process each directory for writeups
    const advisories = [];
    for (const item of contents) {
      if (item.type === 'dir') {
        const { data: files } = await octokit.rest.repos.getContent({
          owner,
          repo, 
          path: item.path
        });
        
        const writeupFile = files.find(f => 
          f.name.toLowerCase().includes('writeup') || 
          f.name.toLowerCase().includes('poc')
        );

        if (writeupFile) {
          const response = await fetch(writeupFile.download_url);
          const content = await response.text();
          
          // Parse content and metadata
          const advisory = parseAdvisoryContent(content, item.name);
          advisories.push(advisory);
        }
      }
    }

    return advisories;
  } catch (error) {
    console.error('Error fetching advisories:', error);
    return [];
  }
}

function parseAdvisoryContent(content: string, vendor: string) {
  // Extract metadata and format content
  const lines = content.split('\n');
  let title = '';
  let description = '';
  
  // Find title from first h1
  const titleMatch = content.match(/^# (.+)$/m);
  if (titleMatch) {
    title = titleMatch[1];
  }

  // Get first paragraph as description
  const descMatch = content.match(/^# .+\n+(.+?)(\n\n|$)/m);
  if (descMatch) {
    description = descMatch[1];
  }

  return {
    title,
    description,
    vendor,
    content: marked(content),
    publishDate: new Date(),
    // Add other metadata
  };
}