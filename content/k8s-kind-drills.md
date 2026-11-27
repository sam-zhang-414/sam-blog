---
title: 在 kind 上把 K8s 故障演练做真
date: 2026-11-25
summary: 删 Pod、坏镜像、探针写错——三种演练怎么设计，才能证明系统真的会自愈和回滚。
tags: [K8s, 运维]
---

## 为什么不用“部署成功”当验收

把服务部署到 K8s 只证明它能启动，不证明它出问题时能恢复。真正要验证的是三个动作：

1. 杀掉一个副本，剩余的能不能扛住；
2. 推一个坏镜像，滚动发布能不能停住并回滚；
3. 探针配置错了，平台会不会把坏实例摘掉。

我在 kind 上建了一个单节点集群，namespace 里跑双副本，`maxUnavailable: 0`，配 PDB 和三类探针，然后逐条演练。

## 演练一：删 Pod

```bash
kubectl -n tenantai delete pod <pod-name>
kubectl -n tenantai get pods -w
```

预期是新 Pod 在十几秒内起来，Service 不断流。实测 20 秒左右恢复，滚动期间另一个副本一直 Ready。

这一步容易“假成功”：如果副本数只有 1，删掉之后短暂不可用也会被说成“自愈”。至少两个副本，才有观察价值。

## 演练二：坏镜像与回滚

```bash
kubectl -n tenantai set image deploy/tenantai-api api=tenantai-api:broken
kubectl -n tenantai rollout status deploy/tenantai-api
```

坏镜像会让新 ReplicaSet 卡在 ImagePullBackOff。因为 `maxUnavailable=0`，旧的副本不会被立刻杀掉，可用性维持在 2/3。`rollout status` 超时后执行：

```bash
kubectl -n tenantai rollout undo deploy/tenantai-api
```

15 秒内回到上一个 Revision。这里的关键不是回滚命令，而是**发布策略要允许你回滚**：`maxUnavailable=0` + 就绪探针，才有“坏版本上不去、旧版本还在”的窗口。

## 演练三：把探针改错

把 liveness 的端口从 8080 改成 9999，观察 `RESTARTS` 计数：

```bash
kubectl -n tenantai get pods
kubectl -n tenantai describe pod <pod-name> | grep -A3 Liveness
```

容器会被反复重启，直到改回正确端口。这一步验证的是：探针失败时平台真的会动手，而不是只记一条事件。

## 一个容易忽略的坑

镜像 tag 不变、只 `kubectl apply`，滚动发布不会触发——Deployment 认为模板没变。演练脚本里必须显式：

```bash
kubectl -n tenantai rollout restart deploy/tenantai-api
```

否则你会以为“发布了”，实际跑的还是旧镜像。

## 小结

故障演练的价值不在脚本，而在**验收标准**：多少秒恢复、可用性最低到几、回滚是否自动。把这些数字写进记录，下一次发布才有对照。
