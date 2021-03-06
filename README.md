# TickIt

## Overview

Ticket selling app built based on microservices architecture. This project focuses on the production ready back-end, very simple React front-end is made just for demonstration and testing purposes.

### Functionality

The goal of the app is to allow users to buy and sell concert tickets. For handling credit card payments the app uses Stripe API.

### Structure

The app consists of 7 different services designed to comminicate in an asynchronous fashion. Services are written in TypeScript, running on NodeJS and built with NextJS (front-end), Express and MongoDB (back-end) and NATS Streaming Server to communicate via events. Each service lives in its own Docker container, managed by Kubernetes. For routing the `ingress-nginx` controller is used. The app also uses Sendgrid as an email API provider.

All services include a shared library as a dependency, called `@tick-it/common`, where all crucial type definitions live. This shared library is also included in this repository as a submodule.

List of microservices:

- `client` - Service responsible for the front-end.
- `auth` - Service responsible for authentication.
- `tickets` - Service responsible tickets.
- `orders` - Service responsible for orders.
- `payments` - Service managing payments.
- `expiration` - Service handling an order expiration time.
- `emails` - Service sending email confirmations after order completion.

## Development

To manage all the Docker containers inside the Kubernetes cluster and simplify development workflow the project uses Skaffold.

To run the app in development environment, make sure Docker, Kubernetes and Skaffold are installed on your local machine.

Before running the app environment variables inside the Kubernetes cluster must be set. Execute commands below to set these environment variables:

```bash
# kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<your_stripe_key>

# kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<your_jwt_key>

# kubectl create secret generic sendgrid-api-key --from-literal=SENDGRID_API_KEY=<your_sendgrid_key>
```

Be sure to expose the ingress-nginx-controller with:

```bash
# kubectl expose deployment ingress-nginx-contoller --target-port=80 --type=NodePort -n kube-system
```

Start the app with `skaffold dev`.
