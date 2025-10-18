import { getUncachableGitHubClient } from './github-client';
import { execSync } from 'child_process';

async function pushToGitHub() {
  try {
    // Get arguments
    const repoName = process.argv[2] || 'pret-store-finder';
    const repoDescription = process.argv[3] || 'Pret A Manger UK Store Finder - Interactive map showing all 491 UK locations with opening hours and contact details';
    const isPrivate = process.argv[4] === 'private';
    
    console.log('🔗 Getting GitHub client...');
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    
    console.log(`\n📦 Creating repository: ${repoName}`);
    console.log(`📝 Description: ${repoDescription}`);
    console.log(`🔒 Private: ${isPrivate}`);
    
    // Create repository
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName.trim(),
      description: repoDescription.trim(),
      private: isPrivate,
      auto_init: false
    });
    
    console.log(`✅ Repository created: ${repo.html_url}`);
    
    // Check if git is initialized
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      console.log('✅ Git repository already initialized');
    } catch {
      console.log('📝 Initializing git repository...');
      execSync('git init', { stdio: 'inherit' });
    }
    
    // Check if there are commits
    let hasCommits = false;
    try {
      execSync('git rev-parse HEAD', { stdio: 'ignore' });
      hasCommits = true;
      console.log('✅ Found existing commits');
    } catch {
      console.log('📝 Creating initial commit...');
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit: Pret A Manger UK Store Finder with 491 locations"', { stdio: 'inherit' });
    }
    
    // Add remote and push
    console.log('📤 Configuring remote and pushing...');
    
    try {
      execSync('git remote remove origin', { stdio: 'ignore' });
    } catch {
      // Remote doesn't exist yet
    }
    
    // Use SSH URL for GitHub
    execSync(`git remote add origin ${repo.ssh_url}`, { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'inherit' });
    
    console.log('⬆️ Pushing to GitHub...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n✅ Successfully pushed to GitHub!');
    console.log(`🔗 Repository URL: ${repo.html_url}`);
    console.log(`📦 Clone URL (HTTPS): ${repo.clone_url}`);
    console.log(`📦 Clone URL (SSH): ${repo.ssh_url}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Usage: npx tsx server/push-to-github.ts [repo-name] [description] [public|private]
// Example: npx tsx server/push-to-github.ts pret-finder "My Pret Finder" private

pushToGitHub();
