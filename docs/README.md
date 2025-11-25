# Documentation

Tài liệu kỹ thuật cho Infrastructure Voting System.

## 📚 Available Documents

### Security & Penetration Testing

- **[PENTEST_VOTING.md](./PENTEST_VOTING.md)** - Hướng dẫn pentest chi tiết cho chức năng voting
  - Phân tích lỗ hổng bảo mật
  - Các kịch bản tấn công
  - Checklist testing
  - Khuyến nghị khắc phục

## 🔍 Quick Navigation

### For Security Testers
1. Đọc [PENTEST_VOTING.md](./PENTEST_VOTING.md) để hiểu về các lỗ hổng
2. Xem [pentest-scripts](../pentest-scripts/) để chạy các test tự động
3. Theo dõi [pentest-scripts/README.md](../pentest-scripts/README.md) để sử dụng scripts

### For Developers
1. Xem [CLAUDE.md](../CLAUDE.md) cho project setup và architecture
2. Review [PENTEST_VOTING.md](./PENTEST_VOTING.md) để hiểu các vấn đề bảo mật cần fix
3. Implement các recommendations trong section "Mitigation"

## 🛡️ Security Overview

### Current State
Hệ thống hiện tại có các lỗ hổng nghiêm trọng:
- ❌ No vote deduplication
- ❌ No rate limiting
- ❌ No CSRF protection
- ❌ Weak input validation
- ❌ IP spoofing possible

### Priority Fixes
1. **CRITICAL**: Implement vote deduplication
2. **CRITICAL**: Add rate limiting
3. **HIGH**: Add CSRF protection
4. **HIGH**: Strengthen IP detection
5. **MEDIUM**: Improve input validation

## 📝 Contributing

Khi thêm tài liệu mới:
1. Đặt file trong thư mục `docs/`
2. Cập nhật README.md này với link và mô tả
3. Sử dụng format Markdown
4. Bao gồm table of contents cho docs dài

## 📋 Document Standards

### File Naming
- Use UPPERCASE for main documents (e.g., `PENTEST_VOTING.md`)
- Use lowercase for supporting docs (e.g., `api-reference.md`)
- Use hyphens for multiple words (e.g., `security-guidelines.md`)

### Content Structure
```markdown
# Title

## Overview
[Brief description]

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Sections
[Content]

## References
[Links and resources]
```

---

**Last Updated:** 2025-11-25
