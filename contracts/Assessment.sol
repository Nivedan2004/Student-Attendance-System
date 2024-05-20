// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Assessment {
    string public balance;
    mapping(uint => string) public items;
    uint[] public itemIds; 

    constructor(string memory initBalance) payable {
        balance = initBalance;
    }

    function getString() public view returns (string memory) {
        return balance;
    }

    function addItem(string memory _name, uint256 id) public payable {
        items[id] = _name;
        itemIds.push(id);
        balance = string(abi.encodePacked("Added student ", _name));
    }

    function removeItem(uint id) public {
        require(bytes(items[id]).length > 0, "Student does not exist");
        balance = string(abi.encodePacked("Removed student ", items[id]));

        delete items[id];

        for (uint i = 0; i < itemIds.length; i++) {
            if (itemIds[i] == id) {
                for (uint j = i; j < itemIds.length - 1; j++) {
                    itemIds[j] = itemIds[j + 1];
                }
                itemIds.pop();
                break;
            }
        }
    }

    function getItemNames() public view returns (string[] memory) {
        string[] memory result = new string[](itemIds.length);
        for (uint i = 0; i < itemIds.length; i++) {
            result[i] = items[itemIds[i]];
        }
        return result;
    }
}
