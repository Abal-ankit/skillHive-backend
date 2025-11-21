CODE_FILE=$1
INPUT_FILE=$2
OUTPUT_FILE=$3

docker run -d --name skillhive abalankit/intro

sleep 2

docker cp "$CODE_FILE" skillhive:/home/
docker cp "$INPUT_FILE" skillhive:/home/
docker cp "$OUTPUT_FILE" skillhive:/home/

docker exec skillhive sh -c "cd /home && touch result.txt && node $(basename "$CODE_FILE")"

docker cp skillhive:/home/result.txt .

docker rm -f skillhive
