# SonarQube Setup Guide

This guide explains how to run SonarQube analysis for the vote-anti-trick project.

## Project Information

- **Project Key**: `anhkhoa289_vote-anti-trick`
- **Organization**: `anhkhoa289`
- **Project Name**: `vote-anti-trick`

## Prerequisites

1. **SonarQube Token**: Get your token from SonarCloud
   - Go to https://sonarcloud.io
   - Navigate to: My Account → Security → Generate Token
   - Copy the token

2. **SonarScanner CLI** (Optional for local analysis):
   ```bash
   # macOS
   brew install sonar-scanner

   # Linux
   wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
   unzip sonar-scanner-cli-5.0.1.3006-linux.zip
   export PATH="$PATH:/path/to/sonar-scanner/bin"
   ```

## Running Analysis

### Option 1: Using SonarScanner CLI (Local)

1. **Run tests with coverage**:
   ```bash
   yarn test:coverage
   ```

2. **Run SonarQube analysis**:
   ```bash
   sonar-scanner \
     -Dsonar.host.url=https://sonarcloud.io \
     -Dsonar.login=YOUR_TOKEN_HERE
   ```

   Or set environment variable:
   ```bash
   export SONAR_TOKEN=your_token_here
   sonar-scanner -Dsonar.host.url=https://sonarcloud.io
   ```

### Option 2: Using GitHub Actions (Recommended)

Create `.github/workflows/sonarcloud.yml`:

```yaml
name: SonarCloud Analysis

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones should be disabled for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests with coverage
        run: yarn test:coverage

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**Setup GitHub Secrets**:
1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add new secret: `SONAR_TOKEN` with your SonarCloud token

### Option 3: Using GitLab CI/CD

Create or update `.gitlab-ci.yml`:

```yaml
sonarcloud-check:
  image: node:20-alpine
  stage: test
  cache:
    paths:
      - node_modules/
  script:
    - yarn install --frozen-lockfile
    - yarn test:coverage
    - |
      docker run \
        --rm \
        -e SONAR_TOKEN="${SONAR_TOKEN}" \
        -e SONAR_HOST_URL="https://sonarcloud.io" \
        -v "${CI_PROJECT_DIR}:/usr/src" \
        sonarsource/sonar-scanner-cli
  only:
    - main
    - merge_requests

variables:
  SONAR_TOKEN: ${SONAR_TOKEN}  # Set this in GitLab CI/CD variables
```

**Setup GitLab Variables**:
1. Go to Settings → CI/CD → Variables
2. Add variable: `SONAR_TOKEN` with your SonarCloud token
3. Mark it as "Masked" and "Protected"

## Viewing Results

After running analysis:

1. Go to https://sonarcloud.io
2. Navigate to your organization: `anhkhoa289`
3. Select project: `vote-anti-trick`
4. View:
   - **Overview**: Overall health metrics
   - **Issues**: Code smells, bugs, vulnerabilities
   - **Security**: Security hotspots
   - **Coverage**: Test coverage details
   - **Duplications**: Code duplication

## Quality Gate

The project has the following quality thresholds configured:

- **Coverage**: ≥80% (Current: 100% ✓)
- **Duplicated Lines**: ≤3%
- **Maintainability Rating**: A
- **Reliability Rating**: A
- **Security Rating**: A

## Troubleshooting

### Error: "Invalid token"
- Make sure your SONAR_TOKEN is correct
- Token may have expired - generate a new one

### Error: "Project not found"
- Verify project key: `anhkhoa289_vote-anti-trick`
- Ensure project exists in SonarCloud
- Check organization: `anhkhoa289`

### Coverage not showing
- Ensure `yarn test:coverage` ran successfully
- Check `coverage/lcov.info` exists
- Verify path in `sonar-project.properties`

### Tests not showing
- Ensure `test-report.xml` exists
- Check `sonar.testExecutionReportPaths` in config

## Manual Setup (First Time)

If the project doesn't exist in SonarCloud yet:

1. Go to https://sonarcloud.io
2. Click "+" → "Analyze new project"
3. Select your repository
4. Set organization: `anhkhoa289`
5. Project key will be auto-generated as: `anhkhoa289_vote-anti-trick`
6. Run analysis as described above

## Files Generated for SonarQube

After running `yarn test:coverage`:

```
├── coverage/
│   ├── lcov.info              # ← SonarQube reads this for coverage
│   ├── coverage-final.json
│   └── index.html             # View coverage locally
├── test-report.xml            # ← SonarQube reads this for test results
└── sonar-project.properties   # ← SonarQube configuration
```

## CI/CD Integration Best Practices

1. **Run analysis on**:
   - Every push to main/develop
   - Every pull request
   - Scheduled (nightly builds)

2. **Quality Gate as PR requirement**:
   - Set up branch protection
   - Require SonarCloud check to pass
   - Block merge if quality gate fails

3. **Cache dependencies**:
   - Cache `node_modules/` for faster builds
   - Use `--frozen-lockfile` for consistency

4. **Optimize performance**:
   - Run tests and SonarQube in same job
   - Use shallow clones when possible (except SonarQube - needs full history)
   - Parallelize independent steps

## Additional Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarScanner CLI Documentation](https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/sonarscanner-cli/)
- [GitHub Action for SonarCloud](https://github.com/SonarSource/sonarcloud-github-action)
- [Quality Gate Documentation](https://docs.sonarcloud.io/improving/quality-gates/)
