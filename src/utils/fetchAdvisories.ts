import { Octokit } from 'octokit';
import { marked } from 'marked';
import hljs from 'highlight.js';

const REPO_OWNER = 'odaysec';
const REPO_NAME = 'advisory';

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

export async function fetchAllAdvisories() {
  const octokit = new Octokit();
  
  try {
    // Get all directories in the repository
    const { data: contents } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: ''
    });

    const advisories = [];

    // Process each directory
    for (const item of contents) {
      if (item.type === 'dir') {
        const { data: files } = await octokit.rest.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: item.path
        });

        // Find writeup or poc files
        const writeupFile = files.find(f => 
          f.name.toLowerCase().includes('writeup') || 
          f.name.toLowerCase().includes('poc')
        );

        if (writeupFile) {
          // Fetch the raw content
          const response = await fetch(writeupFile.download_url);
          const content = await response.text();

          // Create the advisory file
          const fileName = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
          const filePath = `src/content/advisories/${fileName}`;

          // Parse and format the content
          const formattedContent = formatAdvisoryContent(content, item.name);
          advisories.push({
            path: filePath,
            content: formattedContent
          });
        }
      }
    }

    return advisories;

  } catch (error) {
    console.error('Error fetching advisories:', error);
    throw error;
  }
}

function formatAdvisoryContent(content: string, vendor: string) {
  // Extract title from first heading
  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : `Security Advisory for ${vendor}`;

  // Extract description from first paragraph
  const descMatch = content.match(/^# .+\n+(.+?)(\n\n|$)/m);
  const description = descMatch ? descMatch[1] : '';

  // Extract CVE ID if present
  const cveMatch = content.match(/CVE-\d{4}-\d+/);
  const cveId = cveMatch ? cveMatch[0] : '';

  // Generate frontmatter
  const frontmatter = `---
title: "${title}"
description: "${description}"
publishDate: ${new Date().toISOString().split('T')[0]}
vendor: "${vendor}"
${cveId ? `cveId: "${cveId}"` : ''}
severity: "High"
patchStatus: "Patched"
---

${content}`;

  return frontmatter;
}