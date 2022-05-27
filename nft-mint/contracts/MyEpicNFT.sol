// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    //svg base that it will be used in generation of random data

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] first = [ "tacit ", "nonstop ", "astonishing ", "diligent ", "insure ", "chide ", "ill " ];

    string[] second = [ "disgusted ", "coat ", "gabby ", "retch ", "belief ", "sneak ", "building " ];

    string[] thired = [ "harbor", "young", "surpass", "vacation", "reaction", "detailed", "limp" ];

    constructor() ERC721("NFT test", "SEA"){

        console.log("MyEpicNFT Contract!");
    }

    /*
    *function used to generate a random number from a given parameter
    *@param input
    */

    function random(string memory input) internal pure returns(uint){

        return uint(keccak256(abi.encodePacked(input)));

    }


    /*function that will be used to get random word from the arrays above!
    * @param tokenId
    * @param order
    */

    function pickRandom(uint tokenId, string memory order) public view returns(string memory){

        uint rand = random(string(abi.encodePacked(order, Strings.toString(tokenId))));

        if(keccak256(abi.encodePacked(order)) == keccak256(abi.encodePacked("FIRST"))){

            rand %= first.length;

            return first[rand];

        }else if(keccak256(abi.encodePacked(order)) == keccak256(abi.encodePacked("SECOND"))){

            rand %= second.length;

            return second[rand];

        }else if(keccak256(abi.encodePacked(order)) == keccak256(abi.encodePacked("THIRED"))){

            rand %= thired.length;

            return thired[rand];

        }
    }

    //function used to mint the nft in the blockchain

    function makeEpicNFT() public {

        uint newItemId = _tokenIds.current();

        string memory firstword = pickRandom(newItemId, "FIRST");
        string memory secondword = pickRandom(newItemId, "SECOND");
        string memory thiredword = pickRandom(newItemId, "THIRED");
        string memory combinedWord = string(abi.encodePacked(firstword, secondword, thiredword));
        string memory finalSVG = string(abi.encodePacked(baseSvg, firstword, secondword, thiredword, "</text></svg>"));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name":"', combinedWord, '","description": "NEW NFT", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSVG)), '"}'))));
        string memory finalTokenURI = string(abi.encodePacked("data:application/json;base64,", json));
        console.log("\n-------------------------------");
        console.log(string(abi.encodePacked("https://nftpreview.0xdev.codes/?code=", finalTokenURI)));
        console.log("-------------------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenURI);


        _tokenIds.increment();

        console.log("NFT#%s WAS CREATED WITH @@ %s", newItemId, msg.sender);

    }
}