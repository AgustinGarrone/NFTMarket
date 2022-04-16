// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Color is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable public admin;
    address public nftCONTRACT;
    constructor() ERC721("Robot", "ROBOT") {
        admin=payable(msg.sender);
        nftCONTRACT=address(this);
    }
    string [] public colors;
    mapping(uint=>address) [] public owners;


    mapping (string=>bool) _colorExists;

    modifier onlyAdmin {
        require(msg.sender==admin,"No tienes permisos");
        _;
    }

    function verAdmin() public view returns(address payable) {
        return admin;
    }

        mapping (address=>uint) balances;

    mapping (address=>mapping(uint=>Listing)) public listings;
    struct Listing {
        uint price;
        address seller;
    }


    function purchase(uint tokenId) public payable {
        Listing memory item=listings[admin][tokenId];
        require(msg.value >= item.price*(1 ether));
        balances[item.seller]+=msg.value;
        payable(item.seller).transfer(item.price*(1 ether));
        ERC721URIStorage token = ERC721URIStorage(nftCONTRACT);
        token.safeTransferFrom(item.seller, msg.sender, tokenId,""); 
    }


    function viewPrice(uint _tokenId) public view returns(uint) {
        return listings[ownerOf(_tokenId)][_tokenId].price;
    }

    function mint(string memory _color,string memory tokenURI,uint _price) public onlyAdmin returns (uint256)
    {
        require(!_colorExists[_color]);
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        colors.push(_color);
        _mint(admin, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _colorExists[_color] = true;
        listings[admin][newItemId]=Listing(_price,admin);
        setApprovalForAll(nftCONTRACT,true); 
        return newItemId;
    }



    function getNFTSLength() public view returns(uint) {
        return colors.length;
    }
}
