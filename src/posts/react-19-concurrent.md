---
title: React 19 並發模式：實戰踩坑與最佳實踐
date: 2026-06-10
tags: [React, 前端, 效能]
excerpt: 深入探討 Concurrent Mode、Suspense 與 useTransition，搭配真實案例說明如何避免常見的渲染陷阱。
---

## 什麼是 Concurrent Mode？

React 的並發模式讓渲染工作可以被中斷、暫停、繼續，讓瀏覽器有機會處理使用者互動，避免長時間的同步渲染阻塞 UI。

## useTransition：讓 UI 保持響應

```jsx
import { useTransition, useState } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  function handleSearch(e) {
    const value = e.target.value
    setQuery(value) // 高優先級：立即更新輸入框

    startTransition(() => {
      // 低優先級：可以被中斷的昂貴計算
      setResults(heavySearch(value))
    })
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </div>
  )
}
```

## Suspense 的正確使用方式

Suspense 最常見的誤用是把它當作 loading state 的萬靈丹。實際上它設計用於**資料獲取**和**程式碼分割**兩個場景。

```jsx
// 正確：配合 lazy 做程式碼分割
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

## 踩到的坑：Tearing 問題

在 Concurrent Mode 下，如果你使用外部 store（如 Zustand、Redux），要確保它們支援 `useSyncExternalStore`，否則可能出現同一渲染幀內讀到不一致數據的「tearing」現象。

## 結論

Concurrent Mode 不是魔法，它是一套工具。正確使用 `useTransition` 和 `Suspense`，能顯著提升感知效能，但要避免過度使用導致調試困難。
