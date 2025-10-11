INPUT_FILE=$1

docker run -d --name skillhive gcc sleep infinity

sleep 2

docker cp "$INPUT_FILE" skillhive:/home/

docker exec skillhive sh -c "touch /home/result.txt && g++ /home/$(basename "$INPUT_FILE") -o temp && ./temp"

docker cp skillhive:/home/result.txt .

docker rm -f skillhive
