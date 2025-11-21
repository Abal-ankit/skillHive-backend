CODE_FILE=$1
INPUT_FILE=$2
OUTPUT_FILE=$3

docker run -d --name skillhive openjdk:21 sleep infinity

sleep 2

docker cp "$CODE_FILE" skillhive:/home/Temp.java
docker cp "$INPUT_FILE" skillhive:/home/
docker cp "$OUTPUT_FILE" skillhive:/home/

# Extract filename without extension for Java class name
filename=$(basename "$CODE_FILE")

# Compile and run the Java program

docker exec skillhive sh -c "cd /home && javac $(basename "$CODE_FILE") && java $filename"

docker cp skillhive:/home/result.txt .

docker rm -f skillhive
