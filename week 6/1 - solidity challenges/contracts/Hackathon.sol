// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }
    
    Project[] projects;


    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }

    function findAverage(uint[] storage _items) internal view returns (uint){

        uint sum = 0;
        for (uint i = 0; i < _items.length; i++) {
            sum += _items[i];
        }

        uint average = sum / _items.length;
        return average;
    }

    function findWinner() external view returns (Project memory) {

        uint highestAverage = 0;
        Project memory topProject;

        for (uint i = 0; i < projects.length; i++) {

            uint projectAverage = findAverage( projects[i].ratings );
            if (projectAverage > highestAverage){
                topProject = projects[i];
                highestAverage = projectAverage;
            }
        }
        
        return topProject;
    }

}
