# Production-Grade Event-Driven 3 tier DevSecops GitOps CI/CD with GitHub Actions & ArgoCD, Helm Deployments & KEDA Autoscaling for Reliable RabbitMQ Workflows



This repository demonstrates a **production-grade, event-driven 3-tier microservices architecture** with **DevSecOps & GitOps CI/CD**, built for **local development and testing**. It leverages **GitHub Actions**, **ArgoCD**, **Helm**, and **KEDA autoscaling** to ensure **reliable RabbitMQ workflows** and scalable event-driven processing.  

---

## 🔧 Key Features

- **3-Tier Event-Driven Architecture**
  - Presentation Layer (Frontend)
  - Business Logic Layer (Microservices)
  - Data Layer (Database & Messaging)

- **CI/CD & GitOps**
  - Automated builds and deployments using **GitHub Actions**
  - GitOps-driven deployments using **ArgoCD**
  - Helm chart-based deployments for modularity and version control

- **DevSecOps**
  - Security-focused build and deployment practices
  - Integration-ready for vulnerability scanning tools (Trivy, OWASP, SonarQube,SYNK)

- **KEDA Autoscaling**
  - Event-driven scaling of worker pods based on **RabbitMQ queue depth**
  - Ensures high availability and performance under load

- **Local-First Deployment**
  - Designed to run fully on **local Kubernetes (Minikube / Kind)**
  - Ideal for testing CI/CD pipelines, autoscaling, and DevSecOps practices

- **Reliable RabbitMQ Workflows**
  - Event-driven processing with **message queuing**
  - Optional **Dead Letter Queues** (DLQ) and **retry mechanisms**
  - Supports scalable and fault-tolerant processing

---

## 🛠️ Prerequisites

Before running locally, ensure you have:

- **Docker & Docker Compose**
- **Minikube** or **Kind Kubernetes Cluster**
- **kubectl**
- **Helm 3+**
- **GitHub CLI** (for testing GitHub Actions locally with `act` if needed)
- **Node.js / Python** (depending on your microservices)

---

## ⚡ Local Setup

1. **Start Minikube**
```bash
minikube start --driver=docker
Enable KEDA & Metrics Server

kubectl apply -f https://github.com/kedacore/keda/releases/latest/download/keda.yaml
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
Deploy RabbitMQ using Helm

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install rabbitmq bitnami/rabbitmq --set auth.username=guest,auth.password=guest
Deploy Microservices with Helm

helm install backend ./helm/backend
helm install frontend ./helm/frontend
Configure KEDA ScaledObject for Autoscaling

kubectl apply -f keda/scaledobject.yaml
Verify Deployments

kubectl get pods
kubectl get svc
kubectl get hpa
⚙️ GitHub Actions CI/CD
Build & Push Docker Images
Automatically builds microservice images and pushes to your local Docker registry (or GitHub Container Registry).

Deploy to Kubernetes
GitHub Actions triggers ArgoCD deployments via Helm charts.

Local Testing
All actions can be simulated locally using Act.

📊 Observability & Monitoring
Monitor queue depth for RabbitMQ

Check pod scaling and resource usage

KEDA automatically scales workers based on event-driven load

You can optionally integrate Prometheus + Grafana dashboards locally.

🏗️ Project Structure
├── helm/                  # Helm charts for frontend, backend, RabbitMQ
├── keda/                  # KEDA ScaledObject definitions
├── github-actions/        # CI/CD workflow definitions
├── services/              # Microservices (Node.js / Python)
├── scripts/               # Helper scripts for local deployments
└── README.md
🔑 Notes
This setup is production-grade in architecture but runs fully on local machine for learning, testing, and CI/CD validation.

You can extend it for cloud deployment with AWS EKS, Azure AKS, or GCP GKE by changing Helm values and container registries.


🌟 Contributing
Feel free to contribute by improving:

Helm charts

CI/CD workflows

KEDA scaling rules

Observability dashboards

📖 References
KEDA Documentation

Helm Charts

ArgoCD Documentation

RabbitMQ Helm Chart

Monitoring & Dashboards

Prometheus scrapes:
Node Exporter (host metrics)
Kube-state-metrics
Your app pods (once /metrics endpoint added)


Recommended Grafana dashboards:

1860 – Node Exporter Full
6417 – Node Exporter Server Metrics
315  – Kubernetes Cluster Monitoring

⚡ License
This project is MIT licensed.
