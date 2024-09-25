$version="v1.1"
docker build -t igibgo-frontend:$version .
docker tag igibgo-frontend:$version registry.cn-hangzhou.aliyuncs.com/friedforks/igibgo-frontend:$version
docker push registry.cn-hangzhou.aliyuncs.com/friedforks/igibgo-frontend:$version