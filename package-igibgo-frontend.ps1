$version="v1.3"
docker build -t igibgo-frontend:$version .
docker tag igibgo-frontend:$version registry.cn-hangzhou.aliyuncs.com/friedforks/igibgo-frontend:$version
docker push registry.cn-hangzhou.aliyuncs.com/friedforks/igibgo-frontend:$version