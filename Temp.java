import java.io.*;
import java.util.*;

public class Main {
    public static int[] twoSum(int[] arr, int target) { return new int[]{-1};}

    public static void main(String[] args) throws Exception {
        BufferedReader input = new BufferedReader(new FileReader("input.txt"));
        BufferedReader output = new BufferedReader(new FileReader("output.txt"));
        BufferedWriter result = new BufferedWriter(new FileWriter("result.txt"));

        int t = Integer.parseInt(input.readLine());

        while (t-- > 0) {
            String[] arrStr = input.readLine().split(",");
            int[] arr = Arrays.stream(arrStr).mapToInt(Integer::parseInt).toArray();
            int target = Integer.parseInt(input.readLine());

            int[] ans = twoSum(arr, target);
            String[] outStr = output.readLine().split(",");
            int[] expected = Arrays.stream(outStr).mapToInt(Integer::parseInt).toArray();

            if (Arrays.equals(ans, expected)) {
                result.write("Output matched\n");
            } else {
                result.write("Wrong answer\n");
            }
        }

        input.close();
        output.close();
        result.close();
    }
}