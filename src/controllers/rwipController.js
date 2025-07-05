const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Record a RWIP (NFT) purchase
// @route   POST /api/rwip/purchase
// @access  Private
exports.purchaseRWIP = async (req, res, next) => {
  try {
    const {
      txHash,
      blockNumber,
      blockHash,
      buyerAddress,
      sellerAddress,
      price,
      network,
      nft,
      gasUsed,
      gasPrice,
      timestamp,
      tokenAddress,
      tokenSymbol,
      tokenDecimals,
      logs,
      metadata,
    } = req.body;

    // Basic validation (expand as needed)
    if (
      !txHash ||
      !buyerAddress ||
      !sellerAddress ||
      !price ||
      !network ||
      !nft ||
      !timestamp
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // Create transaction
    const transaction = await Transaction.create({
      txHash,
      blockNumber,
      blockHash,
      from: sellerAddress,
      to: buyerAddress,
      value: price,
      network,
      type: "nft_transfer",
      gasUsed,
      gasPrice,
      timestamp,
      tokenAddress,
      tokenSymbol,
      tokenDecimals,
      logs,
      metadata,
      nft,
      status: "confirmed",
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};
