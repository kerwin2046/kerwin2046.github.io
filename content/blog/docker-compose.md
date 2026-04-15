---
title: "使用 Docker 和 Docker Compose 设置、容器化并测试单一 Hadoop 集群"
description: "在本地用 Docker + docker-compose 启动单节点 Hadoop 环境（NameNode、DataNode、YARN），并运行 MapReduce 示例验证可用性。"
date: "2024-05-15"
author: "Kerwin"
tag: "DevOps"
---

# 使用 Docker 和 Docker Compose 设置、容器化并测试单一 Hadoop 集群

在本地用 Docker + docker-compose 启动一个**单节点（pseudo-distributed / single-node-cluster）Hadoop 环境**（包含 NameNode、DataNode、ResourceManager、NodeManager），并运行一个 MapReduce 示例（wordcount）验证可用性。

## 1. 先决条件

- 主机：64-bit，至少 4GB 空闲内存（测试用），建议 8GB 以上。
- 安装 Docker Desktop（或 Docker Engine + docker-compose）。安装页面： https://www.docker.com/products/docker-desktop/ 。
- 安装 docker-compose（如果 Docker Desktop 已包含则跳过）。
- Git（用于 clone 示例仓库）。
- 理解基本 Linux 命令：`docker`、`docker-compose`、`ssh`、`tar`、`curl`。

（以上为本地实验，生产环境需考虑持久化存储、网络、安全、监控等） 。

## 2. 简短概念（Hadoop / Docker）

- **Hadoop**：分布式存储（HDFS）+ 分布式计算（YARN/MapReduce）。单节点/伪分布式可在一台机器中运行所有守护进程以做开发/学习。
- **Docker**：轻量级容器化技术，把每个 Hadoop 组件（namenode、datanode、resourcemanager、nodemanager）放到独立容器中，使用 docker-compose 编排网络和卷，便于重建和清理。

把 Hadoop 置于容器可快速复现环境、便于测试 MapReduce、也方便扩展到多容器多节点

## 3. 环境准备（Docker / docker-compose / Git / Java）

```dockerfile
# 检查 docker
docker --version
# 检查 docker-compose
docker-compose --version
# 安装 git
git --version
```

![](https://assets2025.oss-cn-beijing.aliyuncs.com/static/20251115221928119.png)

1. 文件结构（建议目录）
2. 示例 `docker-compose.yml`（可复制运行）
3. 必要的 Hadoop 配置文件说明（core-site.xml / hdfs-site.xml / yarn-site.xml）
4. 启动流程（命令）与常见检查点（UI/端口/日志）
5. 把数据放到 HDFS 并运行 MapReduce（wordcount）测试
6. 故障排查要点 & 优化建议
7. 总结与延伸（Spark / Hive / 多节点扩展）