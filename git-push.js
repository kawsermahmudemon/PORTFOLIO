const { execSync } = require('child_process');

try {
  const options = { stdio: 'inherit', cwd: 'c:\\PORTFOLIO' };
  
  console.log('Adding files...');
  execSync('git add .', options);
  
  console.log('Amending commit to remove secret...');
  try {
    execSync('git commit --amend --no-edit', options);
  } catch(e) {
    console.log('Error amending:', e.message);
  }

  console.log('Pushing to main branch...');
  execSync('git push -u origin main --force', options);
  
  console.log('Successfully pushed to GitHub!');
} catch (error) {
  console.error('An error occurred:', error.message);
}
