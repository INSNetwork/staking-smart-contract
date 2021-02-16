pragma solidity ^0.5.0;

import "./InstarToken.sol";

contract InstarTokenMock is InstarToken {

    constructor(address _tokenBeneficiary) InstarToken() public {
        _mint(_tokenBeneficiary, 1000000 * 1e4);
    }
}
