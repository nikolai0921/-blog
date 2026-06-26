---
title: PostgreSQL 索引策略：讓查詢快 100 倍的祕訣
date: 2026-05-22
tags: [PostgreSQL, 資料庫, 效能]
excerpt: B-Tree、GIN、BRIN 三種索引類型的適用場景，以及如何用 EXPLAIN ANALYZE 找出慢查詢的根源。
---

## 索引類型快速對照

| 類型 | 適用場景 | 範例 |
|------|---------|------|
| B-Tree | 等值、範圍查詢（預設） | `WHERE id = 123` |
| GIN | 陣列、JSONB、全文搜尋 | `WHERE tags @> '{react}'` |
| BRIN | 超大表、有自然排序的欄位 | 時間序列、日誌表 |
| Hash | 純等值查詢（少用） | `WHERE email = '...'` |

## 用 EXPLAIN ANALYZE 找慢查詢

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM posts
WHERE tags @> ARRAY['react']
  AND published_at > NOW() - INTERVAL '30 days'
ORDER BY published_at DESC
LIMIT 20;
```

輸出重點看這三行：
- `Seq Scan` → 沒用到索引，需要優化
- `Buffers: shared hit=X read=Y` → `read` 高表示在做磁碟 I/O
- `actual time` → 實際執行時間

## 複合索引的欄位順序

```sql
-- 這個查詢
SELECT * FROM posts WHERE user_id = 1 AND status = 'published';

-- 索引應該這樣建：選擇性高的欄位放前面
CREATE INDEX idx_posts_user_status ON posts (user_id, status);

-- 而不是這樣
CREATE INDEX idx_posts_status_user ON posts (status, user_id); -- 次佳
```

## GIN 索引加速 JSONB 查詢

```sql
-- 建立 GIN 索引
CREATE INDEX idx_posts_metadata ON posts USING GIN (metadata);

-- 現在這個查詢從 Seq Scan 變成 Bitmap Index Scan
SELECT * FROM posts
WHERE metadata @> '{"category": "backend"}';
```

## 實戰：把 8 秒查詢壓到 80ms

在我們的案例中，一個每小時跑一次的報表查詢從 8 秒壓到 80ms，關鍵是加了 **Partial Index**：

```sql
-- 只對「已發布」的文章建索引，大幅縮小索引大小
CREATE INDEX idx_published_posts
ON posts (published_at DESC)
WHERE status = 'published';
```

Partial Index 適合當你的查詢幾乎都帶有固定條件時使用。
