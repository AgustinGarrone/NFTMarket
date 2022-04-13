// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Color is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public admin;
    constructor() ERC721("Color", "COLOR") {
        admin=msg.sender;
    }
    string [] public colors;
    mapping (string=>bool) _colorExists;

  /*   function mint(string memory _color, string memory tokenURI) public returns (uint256)
    {
        require(!_colorExists[_color]);
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        colors.push(_color);
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _colorExists[_color] = true;
        return newItemId;
    } */

    modifier onlyAdmin {
        require(msg.sender==admin,"No tienes permisos");
        _;
    }

    function verAdmin() public view returns(address) {
        return admin;
    }

    function mint(string memory _color,string memory tokenURI) public onlyAdmin returns (uint256)
    {
        require(!_colorExists[_color]);
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        colors.push(_color);
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _colorExists[_color] = true;
        return newItemId;
    }
}