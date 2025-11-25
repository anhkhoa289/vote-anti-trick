# Security

Security information for Infrastructure Voting System.

## 🚨 Known Vulnerabilities

This is a **development/educational project** with **intentional security vulnerabilities** for penetration testing practice.

### ⚠️ DO NOT USE IN PRODUCTION

This codebase contains critical security flaws and should **NEVER** be deployed to production without fixing the vulnerabilities listed below.

## 📋 Vulnerability Summary

| ID | Severity | Vulnerability | Status |
|----|----------|---------------|---------|
| V1 | 🔴 CRITICAL | Unlimited Vote Manipulation | **Known Issue** |
| V2 | 🔴 CRITICAL | Stored XSS via Input Fields | **Known Issue** |
| V3 | 🟠 HIGH | IP Spoofing | **Known Issue** |
| V4 | 🟠 HIGH | No Rate Limiting | **Known Issue** |
| V5 | 🟡 MEDIUM | No CSRF Protection | **Known Issue** |
| V6 | 🟡 MEDIUM | Weak Input Validation | **Known Issue** |

## 🔍 Detailed Vulnerabilities

### V1: Unlimited Vote Manipulation (CRITICAL)
**Location:** `app/api/infrastructures/[id]/vote/route.ts`

**Issue:** No mechanism to prevent duplicate votes. A single user can vote unlimited times.

**Exploit:**
```bash
# Vote 1000 times
for i in {1..1000}; do
  curl -X POST http://localhost:3000/api/infrastructures/[id]/vote \
    -H "Content-Type: application/json" \
    -d '{"voterName":"Hacker","voterEmail":"hack@test.com"}'
done
```

**Fix:** Implement vote deduplication (one vote per IP/email/user).

---

### V2: Stored XSS (CRITICAL)
**Location:** Input fields accept unvalidated HTML

**Issue:** XSS payloads are stored in database without sanitization.

**Exploit:**
```javascript
// Vote with XSS payload
{
  "voterName": "<script>alert('XSS')</script>",
  "voterEmail": "xss@test.com"
}
```

**Fix:** Validate and sanitize all inputs; escape outputs when rendering.

---

### V3: IP Spoofing (HIGH)
**Location:** `app/api/infrastructures/[id]/vote/route.ts:14-16`

**Issue:** System trusts `X-Forwarded-For` header which can be spoofed.

**Exploit:**
```bash
curl -X POST http://localhost:3000/api/infrastructures/[id]/vote \
  -H "X-Forwarded-For: 1.2.3.4" \
  -d '{"voterName":"Fake IP","voterEmail":"fake@test.com"}'
```

**Fix:** Use server-side IP detection; validate proxy headers.

---

### V4: No Rate Limiting (HIGH)
**Location:** All API endpoints

**Issue:** No limit on request frequency enables flooding attacks.

**Exploit:** Automated scripts can send thousands of requests per second.

**Fix:** Implement rate limiting middleware (e.g., `@vercel/edge-rate-limit`).

---

### V5: No CSRF Protection (MEDIUM)
**Location:** All POST endpoints

**Issue:** Requests can be forged from any origin without validation.

**Exploit:** Malicious website can trigger votes without user consent.

**Fix:** Implement CSRF tokens or validate Origin/Referer headers.

---

### V6: Weak Input Validation (MEDIUM)
**Location:** All input fields

**Issue:** No validation for email format, length limits, or malicious content.

**Exploit:** Can submit invalid emails, oversized inputs, or injection payloads.

**Fix:** Add input validation and length limits.

---

## 🧪 Security Testing

### Automated Pentest Suite
```bash
cd pentest-scripts
./run-all-tests.sh <infrastructure-id>
```

### Manual Testing
See [docs/PENTEST_VOTING.md](./docs/PENTEST_VOTING.md) for detailed testing guide.

### Test Scripts
- `01-vote-flooding.js` - Test unlimited voting
- `02-ip-spoofing.js` - Test IP header manipulation
- `03-csrf-attack.html` - Test CSRF vulnerability
- `04-mass-manipulation.js` - Test spam resistance
- `05-input-validation.js` - Test injection vulnerabilities

## 🛡️ Security Roadmap

### Phase 1: Critical Fixes (Priority 1)
- [ ] Implement vote deduplication
  - Option A: One vote per IP + Infrastructure
  - Option B: One vote per email + Infrastructure (with verification)
  - Option C: Require authentication + one vote per user
- [ ] Add rate limiting to all endpoints
  - Limit: 5 votes per IP per hour
  - Limit: 10 infrastructure creations per IP per day
- [ ] Sanitize and validate all user inputs
  - Email format validation (RFC 5322)
  - Length limits (name: 100, email: 320 chars)
  - HTML escaping for outputs

### Phase 2: High Priority Fixes (Priority 2)
- [ ] Add CSRF protection
  - Implement CSRF tokens
  - Validate Origin/Referer headers
- [ ] Strengthen IP detection
  - Use server-side IP detection
  - Validate proxy chain
  - Log both forwarded and real IPs
- [ ] Add authentication system
  - Implement NextAuth.js
  - Require login for voting
  - Track votes by user ID

### Phase 3: Additional Hardening (Priority 3)
- [ ] Implement Content Security Policy (CSP)
- [ ] Add spam detection and content filtering
- [ ] Implement CAPTCHA for bot protection
- [ ] Add admin moderation tools
- [ ] Implement security logging and monitoring
- [ ] Add automated security tests to CI/CD

## 🔒 Security Best Practices

### For Development
1. **Never commit secrets** to the repository
2. **Use environment variables** for sensitive config
3. **Keep dependencies updated** - run `yarn audit` regularly
4. **Review security advisories** for packages used
5. **Test security fixes** before deploying

### For Deployment
1. **Use HTTPS** for all connections
2. **Enable security headers** (CSP, HSTS, X-Frame-Options)
3. **Configure CORS properly** - don't allow all origins
4. **Use secure session management**
5. **Monitor for suspicious activity**
6. **Regular security audits**
7. **Have an incident response plan**

### For Testing
1. **Only test on development/staging** environments
2. **Get authorization** before any security testing
3. **Backup data** before running destructive tests
4. **Clean up test data** after testing
5. **Document findings** properly
6. **Follow responsible disclosure** for real vulnerabilities

## 📞 Reporting Security Issues

### For This Project
This is an educational project with known vulnerabilities. Issues listed above are intentional for learning purposes.

To suggest security improvements:
1. Create an issue on GitHub
2. Describe the vulnerability
3. Provide proof of concept (if applicable)
4. Suggest mitigation strategies

### For Real-World Vulnerabilities
If you discover a security vulnerability in a production system:

1. **DO NOT** disclose publicly immediately
2. **DO** report privately to the maintainers
3. **DO** allow time for fixes (typically 90 days)
4. **DO** follow responsible disclosure guidelines

## 📚 Resources

### Security Guidelines
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security scanner
- [Burp Suite](https://portswigger.net/burp) - Web security testing
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerabilities

### Learning
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) - Free training
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Practice environment
- [HackerOne Hacktivity](https://hackerone.com/hacktivity) - Real vulnerability reports

## ⚖️ Legal Notice

This software is provided for **educational purposes only**. The authors are not responsible for any misuse of this code or the security testing tools provided.

**Security testing must only be performed:**
- On systems you own
- On systems you have explicit authorization to test
- In compliance with applicable laws and regulations

Unauthorized security testing may be illegal in your jurisdiction.

---

**Last Updated:** 2025-11-25
**Status:** Development/Educational - Not Production Ready
