import { getUncachableGitHubClient } from './github-client';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function pushToGitHub() {
  try {
    console.log('🔗 Getting GitHub client...');
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    
    // Ask for repository name
    const repoName = await question('Enter repository name (e.g., pret-store-finder): ');
    const repoDescription = await question('Enter repository description (optional): ');
    const isPrivate = (await question('Make repository private? (y/n): ')).toLowerCase() === 'y';
    
    console.log('\n📦 Creating GitHub repository...');
    
    // Create repository
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName.trim(),
      description: repoDescription.trim() || 'Pret A Manger UK Store Finder - Interactive map with all locations',
      private: isPrivate,
      auto_init: false
    });
    
    console.log(`✅ Repository created: ${repo.html_url}`);
    
    // Initialize git if needed
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      console.log('✅ Git repository already initialized');
    } catch {
      console.log('📝 Initializing git repository...');
      execSync('git init');
      execSync('git add .');
      execSync('git commit -m "Initial commit: Pret A Manger UK Store Finder"');
    }
    
    // Add remote and push
    console.log('📤 Pushing to GitHub...');
    
    try {
      execSync('git remote remove origin', { stdio: 'ignore' });
    } catch {
      // Remote doesn't exist yet
    }
    
    execSync(`git remote add origin ${repo.clone_url.replace('https://', `https://${user.login}:${process.env.GITHUB_TOKEN}@`)}`);
    execSync('git branch -M main');
    execSync('git push -u origin main');
    
    console.log('\n✅ Successfully pushed to GitHub!');
    console.log(`🔗 Repository URL: ${repo.html_url}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  } finally {
    rl.close();
  }
}

pushToGitHub();
