CODE_FILE=$1
INPUT_FILE=$2
OUTPUT_FILE=$3

docker run -d --name skillhive gcc sleep infinity

sleep 2

docker cp "$CODE_FILE" skillhive:/home/
docker cp "$INPUT_FILE" skillhive:/home/  
docker cp "$OUTPUT_FILE" skillhive:/home/

# Fixed: removed single quotes around variable
docker exec skillhive sh -c "cd /home && touch result.txt && g++ $CODE_FILE -o temp && ./temp"

docker cp skillhive:/home/result.txt .

docker rm -f skillhive
