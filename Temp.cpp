#include<bits/stdc++.h>
using namespace std;

int add(int a, int b) {return a + b;}

int main() {
   int a = 10, b = 20;

   ofstream file("/home/result.txt");
   
   if(!file.is_open()) {
    cerr << "Error: Unable to open file!" << endl;
    return 1;
  }
  
  file << add(a, b);

    file.close();
   return 0;
}