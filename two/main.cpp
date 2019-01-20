#include <iostream>
#include <string>
#include <vector>
#include <map>

int main() {

    // read input
    std::vector<std::string> input;
    for (std::string line; std::getline(std::cin, line);) {
        input.push_back(line);
    }

    std::cout << "-------------------------- END INPUT --------------------------" << std::endl;

    // process
    int twos = 0;
    int threes = 0;
    for (const std::string& line : input) {
        std::map<char, int> character_counts;
        for (const char& c : line) {
            if (character_counts.find(c) != character_counts.end()) { // key exists in map
                character_counts[c]++;
            } else {
                character_counts.insert(std::make_pair(c, 1));
            }
        }

        for (const auto& pair : character_counts) {
            if (pair.second == 2) {
                twos++;
                break;
            }
        }
        for (const auto& pair : character_counts) {
            if (pair.second == 3) {
                threes++;
                break;
            }
        }
    }

    // evaluate
    std::cout << twos * threes << std::endl;

    return 0;
}