#!/bin/bash

TAG=0.8
docker build  --no-cache  -f ./deployment/docker/Dockerfile -t 667950714614.dkr.ecr.us-east-2.amazonaws.com/payment-service:$TAG .
docker push 667950714614.dkr.ecr.us-east-2.amazonaws.com/payment-service:$TAG
kubectl set image deployment/payment-service payment-service=667950714614.dkr.ecr.us-east-2.amazonaws.com/payment-service:$TAG
kubectl rollout restart deployment/payment-service

