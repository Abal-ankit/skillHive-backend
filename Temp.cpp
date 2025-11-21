#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int> &arr, int target) {return {1, 2};}

int main()
{
    ifstream input("input.txt"), output("output.txt");
    ofstream result("result.txt");

    int t;
    input >> t;

    input.ignore();

    while (t--)
    {
        string s;
        getline(input, s);

        istringstream str(s);
        string a;

        vector<int> arr;
        while (getline(str, a, ','))
        {
            arr.push_back(stoi(a));
        }

        int target;

        input >> target;
        input.ignore();

        vector<int> ans = twoSum(arr, target);

        string o;
        getline(output, o);

        istringstream st(o);
        string k;

        vector<int> z;
        while(getline(st, k, ',')) {
            z.push_back(stoi(k));
        }

        if(z == ans) {
            result << "Output matched\n";
        }
        else {
            result << "Wrong answer\n";
        }
    }
}