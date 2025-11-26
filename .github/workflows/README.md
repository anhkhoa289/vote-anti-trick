# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the vote-anti-trick project.

## 🔄 Available Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests (opened, synchronized, reopened)

**Jobs:**

#### Test Job
- ✓ Checkout code
- ✓ Setup Node.js 20.x
- ✓ Install dependencies with yarn
- ✓ Generate Prisma client
- ✓ Run type checking
- ✓ Run linter
- ✓ Run tests with coverage
- ✓ Upload coverage reports as artifacts
- ✓ Comment coverage on PRs

#### Build Job
- ✓ Checkout code
- ✓ Install dependencies
- ✓ Generate Prisma client
- ✓ Build Next.js application
- ✓ Verify build output

**Artifacts:**
- Coverage reports (retained for 30 days)
- Test execution reports

### 2. SonarCloud Workflow (`sonarcloud.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests (opened, synchronized, reopened)

**Jobs:**

#### SonarCloud Analysis
- ✓ Checkout code (full history)
- ✓ Setup Node.js
- ✓ Install dependencies
- ✓ Generate Prisma client
- ✓ Run tests with coverage
- ✓ Upload results to SonarCloud
- ✓ Check quality gate status

**Required Secrets:**
- `SONAR_TOKEN` - Your SonarCloud authentication token

**Project Configuration:**
- Organization: `anhkhoa289`
- Project Key: `anhkhoa289_vote-anti-trick`

## 🔐 Required Secrets

To use these workflows, configure the following secrets in your GitHub repository:

### Setting Up Secrets

1. Go to your repository on GitHub
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following:

#### SONAR_TOKEN
- **Name**: `SONAR_TOKEN`
- **Value**: Your SonarCloud token
- **How to get**:
  1. Go to https://sonarcloud.io
  2. Click on your profile → **My Account**
  3. Navigate to **Security** tab
  4. Generate a new token
  5. Copy and paste into GitHub secrets

## 📊 Viewing Results

### Test Results
- View in the **Actions** tab of your repository
- Check the "Run Tests" job for detailed test output
- Download coverage reports from artifacts

### SonarCloud Results
- Visit: https://sonarcloud.io/project/overview?id=anhkhoa289_vote-anti-trick
- View code quality, coverage, and security analysis
- Check quality gate status

### PR Comments
The CI workflow automatically comments on PRs with:
- Test status (passed/failed)
- Coverage percentage
- Number of lines covered

## 🛠️ Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/anhkhoa289/vote-anti-trick/workflows/CI/badge.svg)
![SonarCloud](https://github.com/anhkhoa289/vote-anti-trick/workflows/SonarCloud%20Analysis/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=anhkhoa289_vote-anti-trick&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=anhkhoa289_vote-anti-trick)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=anhkhoa289_vote-anti-trick&metric=coverage)](https://sonarcloud.io/summary/new_code?id=anhkhoa289_vote-anti-trick)
```

## 🔧 Modifying Workflows

### Adding New Test Steps
Edit `ci.yml` and add steps after the "Run linter" step:

```yaml
- name: Your new step
  run: your-command-here
```

### Changing Node.js Version
Update the `node-version` in the matrix or specific step:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]  # Test on multiple versions
```

### Adjusting Triggers
Modify the `on` section:

```yaml
on:
  push:
    branches:
      - main
      - develop
    paths-ignore:
      - '**.md'  # Ignore markdown files
```

## 📝 Best Practices

1. **Keep workflows fast**: Cache dependencies, parallelize jobs
2. **Use matrix builds**: Test on multiple Node.js versions if needed
3. **Fail fast**: Stop on first error to save CI minutes
4. **Secure secrets**: Never log or expose secret values
5. **Monitor usage**: Check Actions usage in repository insights

## 🐛 Troubleshooting

### Workflow fails on "Install dependencies"
- Check `yarn.lock` is committed
- Verify Node.js version compatibility

### Workflow fails on "Generate Prisma Client"
- Ensure `prisma/schema.prisma` is valid
- Check Prisma version in `package.json`

### SonarCloud scan fails
- Verify `SONAR_TOKEN` is set correctly
- Check organization and project key match SonarCloud
- Ensure coverage reports are generated before scan

### Build fails
- Check for TypeScript errors locally first
- Verify all environment variables are mocked/available
- Review build logs in Actions tab

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Next.js CI/CD Guide](https://nextjs.org/docs/deployment)
