---
title: Docker Compose + GitHub Actions：打造零摩擦 CI/CD 流程
date: 2026-05-30
tags: [DevOps, Docker, CI/CD]
excerpt: 從本機開發到自動部署，完整介紹如何用最少的設定達到穩健的持續整合與部署管線。
---

## 目標架構

```
push to main
  → GitHub Actions 觸發
  → 執行測試
  → 建置 Docker image
  → 推送到 Registry
  → SSH 到伺服器執行 docker compose pull && up
```

## docker-compose.yml

```yaml
services:
  api:
    image: ghcr.io/yourname/api:${TAG:-latest}
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## GitHub Actions Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker compose pull
            docker compose up -d --remove-orphans
```

## 關鍵細節

**為什麼用 `healthcheck`？** 確保 DB 真正就緒後 API 才啟動，避免競爭條件導致的啟動失敗。

**為什麼用 `unless-stopped`？** 伺服器重開機後容器自動恢復，不需要額外的 systemd 設定。
