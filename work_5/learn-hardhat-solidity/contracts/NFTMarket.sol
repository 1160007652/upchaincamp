// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarket is IERC721Receiver {
    using SafeMath for uint256;

    // 买卖NFT 的币种
    address public tokenContractAddress;

    constructor(address _tokenContractAddress) {
        tokenContractAddress = _tokenContractAddress;
    }

    // { nftAddress: { tokenId: msg.sender} }
    mapping(address => mapping(uint256 => address)) public nftToSeller;
    // { nftAddress: { tokenId: price} }
    mapping(address => mapping(uint256 => uint256)) public tokenPrices;

    event NFTAddedForSale(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    );
    event NFTRemovedFromSale(address nftContractAddress, uint256 tokenId);
    event NFTSold(
        address nftContractAddress,
        uint256 tokenId,
        address buyer,
        uint256 price
    );

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function addNFTForSale(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721 nft = IERC721(nftAddress);
        tokenPrices[nftAddress][tokenId] = price;
        nftToSeller[nftAddress][tokenId] = msg.sender;
        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        emit NFTAddedForSale(nftAddress, tokenId, price);
    }

    function removeNFTFromSale(address nftAddress, uint256 tokenId) public {
        IERC721 nft = IERC721(nftAddress);
        require(
            nft.ownerOf(tokenId) == address(this),
            "This NFT is not in the marketplace"
        );
        require(
            nftToSeller[nftAddress][tokenId] == msg.sender,
            "You did not sell the NFT"
        );

        delete tokenPrices[nftAddress][tokenId];

        nft.safeTransferFrom(address(this), msg.sender, tokenId);

        emit NFTRemovedFromSale(nftAddress, tokenId);
    }

    function buyNFT(
        address nftContractAddress,
        uint256 tokenId,
        uint256 tokenAmount
    ) public {
        uint256 price = tokenPrices[nftContractAddress][tokenId];

        IERC721 nft = IERC721(nftContractAddress);
        IERC20 token = IERC20(tokenContractAddress);

        require(
            nft.ownerOf(tokenId) == address(this),
            "This NFT is not in the marketplace"
        );

        require(tokenAmount >= price, "low price");

        token.transferFrom(msg.sender, address(this), price);

        nft.safeTransferFrom(address(this), msg.sender, tokenId);

        delete tokenPrices[nftContractAddress][tokenId];

        emit NFTSold(nftContractAddress, tokenId, msg.sender, price);
    }
}
