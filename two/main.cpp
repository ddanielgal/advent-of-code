#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

std::string produce_id(const std::vector<std::string>& input) {
    std::vector<std::string> compare_with(input);

    int diff_index;
    for (const auto& lhs : input) {
        compare_with.erase(std::find(compare_with.begin(), compare_with.end(), lhs));
        for (const auto& rhs : compare_with) {
            // assuming all box ids have the same length
            int diff_characters = 0;
            for (int i = 0; i < lhs.size(); i++) {
                if (lhs[i] != rhs[i]) {
                    diff_characters++;
                    diff_index = i;
                }
            }
            if (diff_characters == 1) {
                std::string box_id(lhs);
                box_id.erase(box_id.begin()+diff_index);
                return box_id;
            }
        }
    }
    return std::string("");
}

int main() {

    // read input
    std::vector<std::string> input;
    for (std::string line; std::getline(std::cin, line);) {
        input.push_back(line);
    }

    // process
    std::string box_id = produce_id(input);

    // evaluate
    std::cout << box_id << std::endl;

    return 0;
}