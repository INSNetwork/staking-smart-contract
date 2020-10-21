pragma solidity ^0.5.0;

import "../../contracts/Unipool.sol";

contract UnipoolMock is Unipool {

    constructor(IERC20 _uniswapToken, IERC20 _instarToken) public {
        uniswapEthInstarToken = _uniswapToken;
        instar = _instarToken;
    }
}
