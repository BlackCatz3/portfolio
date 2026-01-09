# 🗄️ SQL Database Files

Folder ini berisi file-file SQL untuk database schema dan configuration.

## 📋 File List

### schema.sql
Main database schema yang berisi semua table definitions.

**Cara pakai:**
```sql
-- Import ke PostgreSQL
psql -U postgres -d portfolio_db -f schema.sql
```

### create-rate-limit-settings.sql
SQL untuk membuat table rate limit settings.

**Cara pakai:**
```sql
psql -U postgres -d portfolio_db -f create-rate-limit-settings.sql
```

## 🔧 Maintenance

File-file SQL ini adalah source of truth untuk database schema.
Jangan edit langsung di database, edit file SQL ini lalu run migration.

## 📚 Related Documentation

- Migration guide: ../../docs/guides/README_MIGRATION.md
- Database setup: ../../docs/guides/BACKEND_INTEGRATION.md
