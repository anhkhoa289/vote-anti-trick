# 📚 Documentation

This directory contains comprehensive documentation for the vote-anti-trick project.

## 📄 Available Documentation

### [TESTING.md](./TESTING.md)
Complete testing guide covering:
- Running unit tests
- Test structure and organization
- Coverage reports (LCOV, JSON, HTML)
- Test coverage details (25 tests, 100% coverage)
- Coverage thresholds and best practices

**Quick commands:**
```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # Generate coverage reports
```

### [SONARQUBE.md](./SONARQUBE.md)
SonarQube/SonarCloud integration guide:
- Project configuration
- Local analysis with SonarScanner CLI
- CI/CD integration (GitHub Actions, GitLab CI)
- Quality gate settings
- Troubleshooting common issues

**Project Info:**
- Project Key: `anhkhoa289_vote-anti-trick`
- Organization: `anhkhoa289`
- Project Name: `vote-anti-trick`

**Quick start:**
```bash
yarn test:coverage
sonar-scanner -Dsonar.host.url=https://sonarcloud.io
```

## 🎯 Quick Links

- [Main README](../README.md) - Project overview and setup
- [CLAUDE.md](../CLAUDE.md) - Claude Code guidance
- [SonarCloud Project](https://sonarcloud.io/project/overview?id=anhkhoa289_vote-anti-trick)

## 📊 Current Metrics

- **Tests**: 25 passing ✓
- **Coverage**: 100% (all metrics) ✓
- **Quality Gate**: Configured with 80% thresholds

## 🔍 What to Read First?

1. **New to testing?** Start with [TESTING.md](./TESTING.md)
2. **Setting up CI/CD?** Go to [SONARQUBE.md](./SONARQUBE.md)
3. **Looking for API docs?** See [Main README](../README.md#-api-endpoints)

## 🤝 Contributing to Docs

When adding new documentation:
- Place `.md` files in this `docs/` directory
- Update this README with a brief description
- Link from the main README if relevant
- Use clear, descriptive filenames
- Include examples and code snippets
