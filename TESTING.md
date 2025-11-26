# Testing Guide

This document describes the testing setup and how to use it with SonarQube.

## Test Setup

This project uses **Jest** as the testing framework with the following configuration:

- **Test Framework**: Jest 30.2.0
- **TypeScript Support**: ts-jest 29.4.5
- **Mock Library**: jest-mock-extended 4.0.0
- **Coverage Provider**: V8

## Running Tests

### Run all tests
```bash
yarn test
```

### Run tests in watch mode
```bash
yarn test:watch
```

### Run tests with coverage
```bash
yarn test:coverage
```

## Test Structure

Tests are organized in the `__tests__/` directory at the project root:

```
__tests__/
└── api/
    └── infrastructures/
        ├── route.test.ts              # Tests for /api/infrastructures
        ├── [id]/
        │   └── route.test.ts          # Tests for /api/infrastructures/[id]
        └── [id]/vote/
            └── route.test.ts          # Tests for /api/infrastructures/[id]/vote
```

## Coverage Reports

When running tests with coverage (`yarn test:coverage`), the following reports are generated:

1. **LCOV Report**: `coverage/lcov.info` - Used by SonarQube
2. **JSON Report**: `coverage/coverage-final.json` - Machine-readable format
3. **HTML Report**: `coverage/index.html` - Human-readable, open in browser
4. **Text Report**: Printed to console

### Coverage Thresholds

The project enforces minimum coverage thresholds:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Current coverage: **100%** across all metrics ✓

## SonarQube Integration

### Generated Reports

The following reports are generated for SonarQube analysis:

1. **Coverage Report**: `coverage/lcov.info`
2. **Test Execution Report**: `test-report.xml`

### Configuration Files

- `sonar-project.properties` - SonarQube project configuration
- `jest-sonar-reporter-config.json` - Test reporter configuration

### Running SonarQube Analysis

#### Using SonarScanner CLI

1. Install SonarScanner:
   ```bash
   # macOS
   brew install sonar-scanner

   # Linux
   # Download from https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
   ```

2. Update `sonar-project.properties` with your SonarQube server details:
   ```properties
   sonar.host.url=http://your-sonarqube-server:9000
   sonar.login=your-token-here
   ```

3. Run tests with coverage:
   ```bash
   yarn test:coverage
   ```

4. Run SonarQube analysis:
   ```bash
   sonar-scanner
   ```

#### Using SonarQube with CI/CD

Add to your CI/CD pipeline (e.g., GitHub Actions):

```yaml
- name: Run tests with coverage
  run: yarn test:coverage

- name: SonarQube Scan
  uses: sonarsource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Test Coverage Details

### API Routes Coverage

All API routes have comprehensive test coverage:

#### `/api/infrastructures` (9 tests)
- ✓ GET - List all infrastructures with vote counts
- ✓ GET - Empty array when no infrastructures exist
- ✓ GET - Error handling for database failures
- ✓ POST - Create infrastructure with all fields
- ✓ POST - Create infrastructure without imageUrl
- ✓ POST - Validation for missing name
- ✓ POST - Validation for missing description
- ✓ POST - Validation for missing both fields
- ✓ POST - Error handling for database failures

#### `/api/infrastructures/[id]` (6 tests)
- ✓ GET - Fetch infrastructure by ID with vote count
- ✓ GET - Fetch infrastructure with zero votes
- ✓ GET - 404 error when infrastructure not found
- ✓ GET - Error handling for database failures
- ✓ GET - Handle UUID format IDs
- ✓ GET - Handle numeric string IDs

#### `/api/infrastructures/[id]/vote` (10 tests)
- ✓ POST - Create vote with all fields
- ✓ POST - Create vote without optional fields
- ✓ POST - IP address extraction from x-forwarded-for
- ✓ POST - IP address extraction from x-real-ip
- ✓ POST - Default to "unknown" when no IP headers
- ✓ POST - 404 error when infrastructure not found
- ✓ POST - Error handling for database failures
- ✓ POST - Handle multiple votes for same infrastructure
- ✓ POST - Handle empty string values
- ✓ POST - Multiple votes counting

**Total: 25 tests, all passing ✓**

## Viewing Coverage Reports

### HTML Report (Local)

Open `coverage/index.html` in your browser to see a detailed, interactive coverage report.

### Terminal Report

The text coverage report is automatically printed to the console when running `yarn test:coverage`.

## Troubleshooting

### Tests Failing

1. Ensure all dependencies are installed:
   ```bash
   yarn install
   ```

2. Regenerate Prisma client:
   ```bash
   yarn prisma generate
   ```

### Coverage Report Not Generated

1. Make sure you're using the coverage command:
   ```bash
   yarn test:coverage
   ```

2. Check that the `coverage/` directory is not in `.gitignore` (it should be, but may cause issues if you're trying to commit it)

### SonarQube Not Detecting Tests

1. Verify `test-report.xml` exists in the project root
2. Check `sonar-project.properties` has correct paths
3. Ensure SonarQube server can access the reports

## Best Practices

1. **Write tests before code** (TDD approach)
2. **Keep tests isolated** - Each test should be independent
3. **Use descriptive test names** - Describe what's being tested
4. **Mock external dependencies** - Database, APIs, etc.
5. **Test edge cases** - Not just happy paths
6. **Maintain high coverage** - Aim for 80%+ coverage
7. **Run tests before commits** - Ensure nothing breaks
