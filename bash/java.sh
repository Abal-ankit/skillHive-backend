INPUT_FILE=$1

docker run -d --name skillhive openjdk:21 sleep infinity

# sleep 2

docker cp "$INPUT_FILE" skillhive:/home/

# Extract filename without extension for Java class name
filename=$(basename "$INPUT_FILE")

# Compile and run the Java program

docker exec skillhive sh -c "cd /home && javac $(basename "$INPUT_FILE") && java $filename"

docker rm -f skillhive
