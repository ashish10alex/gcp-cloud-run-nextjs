set export

# follow the steps in the order they are defined to send a docker image to google cloud artifact registry
new_art_repo:
    #!/bin/bash
    set -e
    gcloud artifacts repositories create my-docker-repo \
    --repository-format=docker \
    --location=us \
    --description="Docker repository"

docker_ls:
    #!/bin/bash
    set -e
    docker images

list_ar_repos:
    #!/bin/bash
    set -e
    gcloud artifacts repositories list

# for docker to use gcp repository when it pushes and pulls images ?
docker_setup:
    #!/bin/bash
    set -e
    gcloud auth configure-docker us-docker.pkg.dev

# builds the docker image NOTE: might need to change the version at the end
# WARN: images build in arm does not work in gcp cloud run according to docs
# link to docs https://cloud.google.com/run/docs/troubleshooting#container-failed-to-start
# docker_build:
#     #!/bin/bash
#     set -e
#     docker build -t gcp-cloud-run-nextjs:1.0 .

# builds the docker image NOTE: might need to change the version at the end
# build using cloud build if you are using arm architecture
VERSION := "1.1"
REGISTRY := "us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo"
IMAGE_NAME := "gcp-cloud-run-nextjs"
FULL_IMAGE := REGISTRY + "/" + IMAGE_NAME + ":" + VERSION

deploy:
    #!/bin/bash
    set -e
    gcloud builds submit --tag {{FULL_IMAGE}}

docker_pull:
    #!/bin/bash
    set -e
    docker pull us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo/gcp-cloud-run-nextjs:1.1


docker_run:
    #!/bin/bash
    set -e
    docker run -p 3000:3000 us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo/gcp-cloud-run-nextjs:1.1

# Add this new command for cloud run deployment
deploy_cloud_run:
    #!/bin/bash
    set -e
    gcloud run deploy gcp-cloud-run-nextjs \
    --image us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo/gcp-cloud-run-nextjs:1.1 \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3000 \
    --min-instances 0 \
    --max-instances 1 \
    --memory 512Mi \
    --cpu 1 \
    --set-env-vars="NODE_ENV=production,NEXTAUTH_URL=https://gcp-cloud-run-nextjs-927945483375.us-central1.run.app,NEXTAUTH_SECRET=your-secret-key"

view_logs:
    #!/bin/bash
    set -e
    gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gcp-cloud-run-nextjs" --limit=50
