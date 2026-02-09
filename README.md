# Production-Grade Event-Driven 3 tier DevSecops GitOps CI/CD with GitHub Actions & ArgoCD, Helm Deployments & KEDA Autoscaling for Reliable RabbitMQ Workflows

Modern, production-grade **event-driven microservices architecture** deployed on Kubernetes using:

- **GitHub Actions** → full CI/CD pipeline (build, test, scan, push images)
- **Argo CD** → GitOps continuous deployment
- **KEDA** → event-driven autoscaling (RabbitMQ-based)
- **Prometheus + Grafana** → observability
- **Trivy, SonarCloud, Snyk** → security & quality gates
- **RabbitMQ** → message broker
- **Minikube / Docker Desktop** → local development

## Architecture Overview

```mermaid
graph TD
    A[GitHub Push / PR] --> B[GitHub Actions CI]
    B -->|SAST / Dependency Scan / SonarCloud| C[Quality Gate]
    C -->|Build & Trivy Scan| D[Push Images to GHCR]
    D --> E[Argo CD detects Git change]
    E --> F[Deploy Helm Charts]
    F --> G[Kubernetes Cluster<br>Minikube / Docker Desktop]
    G --> H[Frontend]
    G --> I[API]
    G --> J[Worker]
    H --> K[RabbitMQ]
    I --> K
    J --> K
    K --> J
    L[KEDA] -->|Scale on Queue Depth| J
    M[Prometheus] -->|Scrape Metrics| I & J & H & K
    N[Grafana] --> M
Features

CI Pipeline:
CodeQL (SAST)
Snyk dependency scanning
SonarCloud code quality
Trivy container scanning
Docker multi-arch build & push to GHCR

CD / GitOps:
Argo CD syncs Helm charts from Git
Auto image tag updates via GitHub Actions

Event-Driven Scaling:
KEDA scales worker pods based on RabbitMQ queue length

Observability:
Prometheus scraping
Grafana dashboards (Node Exporter + Kubernetes + app metrics)

Security:
Multi-layered scanning (dependency, container, code)
Quality gates before deployment


Tech Stack

LayerTechnologyFrontendReact / Next.js / ViteAPINode.js / ExpressWorkerNode.js (background jobs)Message BrokerRabbitMQDatabaseOracle / PostgreSQL (configurable)OrchestrationKubernetes (Minikube / Docker Desktop)AutoscalingKEDA (RabbitMQ scaler)CI/CDGitHub ActionsGitOpsArgo CDMonitoringPrometheus + GrafanaSecurity ScanningTrivy, Snyk, SonarCloud, CodeQLContainer RegistryGitHub Container Registry (GHCR)
Quick Start (Local Development)
Prerequisites

Docker Desktop or Minikube
kubectl
Helm
Git

1. Clone the repository
Bashgit clone https://github.com/parthorookie/event-driven-keda-enterprisegithubactions.git
cd event-driven-keda-enterprisegithubactions
2. Start local cluster
Bash# Option A: Docker Desktop Kubernetes
# → Enable Kubernetes in Docker Desktop settings

# Option B: Minikube
minikube start --memory=8192 --cpus=4
3. Install RabbitMQ, Prometheus, Grafana (via Helm)
Bash# Add repos
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install RabbitMQ
helm install rabbitmq bitnami/rabbitmq \
  --set auth.username=guest \
  --set auth.password=guest \
  --set service.type=ClusterIP

# Install kube-prometheus-stack (Prometheus + Grafana)
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set grafana.adminPassword=admin123
4. Deploy the application with Argo CD
Bash# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Port-forward Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
Open http://localhost:8080 → login with admin + password from above.
Then create Application pointing to your repo's Helm charts.
5. Access Grafana
Bashkubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
http://localhost:3000 → admin / admin123
Import dashboard ID 1860 (Node Exporter) or 6417 to start seeing metrics.
Project Structure
textevent-driven-keda-enterprisegithubactions/
├── app/
│   ├── api/          # REST API (Node.js/Express)
│   ├── worker/       # Background worker (consumes RabbitMQ)
│   └── frontend/     # React / Next.js UI
├── helm-charts/
│   ├── api/
│   ├── worker/
│   ├── frontend/
│   └── rabbitmq/     # optional override
├── .github/workflows/ # CI/CD pipeline
└── README.md
CI/CD Pipeline Highlights

Triggers on push to main
Parallel jobs: CodeQL, Snyk, SonarCloud, Trivy
Builds & pushes multi-service images to GHCR
Updates Helm values with new image tags → commits back (GitOps trigger)
Argo CD detects change → deploys to cluster

Monitoring & Dashboards

Prometheus scrapes:
Node Exporter (host metrics)
Kube-state-metrics
Your app pods (once /metrics endpoint added)


Recommended Grafana dashboards:

1860 – Node Exporter Full
6417 – Node Exporter Server Metrics
315  – Kubernetes Cluster Monitoring

Next Steps / Roadmap
