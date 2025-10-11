INPUT_FILE=$1

docker run -d --name skillhive abalankit/intro

sleep 2

docker cp "$INPUT_FILE" skillhive:/home/

docker exec skillhive sh -c "node /home/$(basename "$INPUT_FILE")"

docker rm -f skillhive
