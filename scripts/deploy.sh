echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t yingrui205/sast-weekly-web:latest .
docker push yingrui205/sast-weekly-web:latest
