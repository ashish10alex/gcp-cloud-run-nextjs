
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

docker_tag:
    #!/bin/bash
    set -e
    docker tag gcp-cloud-run-nextjs:1.0 us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo/gcp-cloud-run-nextjs:1.0

docker_push:
    #!/bin/bash
    set -e
    docker push us-docker.pkg.dev/drawingfire-b72a8/my-docker-repo/gcp-cloud-run-nextjs:1.0