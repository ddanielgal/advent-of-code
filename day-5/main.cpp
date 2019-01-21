#include <iostream>
#include <vector>

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

    // process
    std::string polymer = reduce(input);
    polymer.pop_back(); // remove endline character

    // evaluate
    std::cout << polymer.size() << std::endl;

    return 0;
}