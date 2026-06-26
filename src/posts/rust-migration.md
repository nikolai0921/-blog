---
title: 用 Rust 重寫一切：我從 Node.js 遷移的真實心得
date: 2026-06-18
tags: [Rust, Node.js, 後端]
excerpt: 歷時三個月，將核心 API 服務從 Node.js 遷移到 Rust 的完整紀錄。效能提升了十倍，但過程中踩了哪些坑？
---

## 為什麼選擇 Rust？

在評估過 Go、Elixir 之後，我們最終選擇了 Rust。主要原因有三：

1. **零成本抽象**：Rust 的類型系統讓你不用為抽象付出執行期代價
2. **記憶體安全**：沒有 GC 暫停，延遲更可預測
3. **生態系成熟度**：Tokio + Axum 的非同步生態已經足夠穩健

## 遷移過程

### 第一階段：建立 Rust 服務骨架

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}
```

### 第二階段：逐步替換端點

我們採用「strangler fig」模式，在 Nginx 層做流量切分，讓 Node.js 和 Rust 服務並行運行，逐步把流量移過去。

### 踩到的坑

**借用檢查器的學習曲線**是最大的挑戰。特別是在處理跨 async 邊界的引用時，編譯器會拒絕很多你在 Node.js 習以為常的寫法。

```rust
// 這樣會編譯失敗
async fn bad_example(data: &str) -> String {
    tokio::spawn(async move {
        data.to_uppercase() // 錯誤：data 的生命週期不夠長
    }).await.unwrap()
}

// 正確做法：clone 或用 Arc
async fn good_example(data: String) -> String {
    tokio::spawn(async move {
        data.to_uppercase()
    }).await.unwrap()
}
```

## 結果

三個月後，我們完成了完整遷移：

- **P99 延遲**：從 120ms → 11ms
- **記憶體用量**：從 512MB → 48MB
- **CPU 使用率**：下降 70%

值得嗎？對我們的場景來說，絕對值得。
