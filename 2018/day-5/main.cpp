#include <iostream>
#include <vector>
#include <algorithm>

std::string reduce(const std::string& input) {
    std::string polymer(input);
    int i = 0;
    while (i+1 < polymer.size()) {
        if (tolower(polymer[i]) == tolower(polymer[i+1])) {
            if ((isupper(polymer[i]) && islower(polymer[i+1])) || (islower(polymer[i]) && isupper(polymer[i+1]))) {
                polymer.erase(i, 2);
                i = 0;
                continue;
            }
        }
        i++;
    }
    return polymer;
}

int main() {
    // read input
    std::istreambuf_iterator<char> begin(std::cin), end;
    std::string input(begin, end);
    input.pop_back(); // remove endline character

    // process
    int minimum_size = input.size(); // set minimum to the highest possible at first
    for (char c = 'a'; c <= 'z'; c++) {
        std::string new_polymer(input);
        new_polymer.erase(std::remove(new_polymer.begin(), new_polymer.end(), c), new_polymer.end());
        new_polymer.erase(std::remove(new_polymer.begin(), new_polymer.end(), toupper(c)), new_polymer.end());
        new_polymer = reduce(new_polymer);
        minimum_size = new_polymer.size() < minimum_size ? new_polymer.size() : minimum_size;
        std::cout << c << ": " << new_polymer.size() << std::endl; // see the progress
    }

    // evaluate
    std::cout << std::endl << "Minimum: " << minimum_size << std::endl;

    return 0;
}