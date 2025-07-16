const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const User = require('../models/User');


exports.getSellerProjects = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    const projects = await Project.find({ seller: sellerId });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};


exports.getSellerSoldProjects = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
 
    const soldProjects = await Transaction.find({ seller: sellerId, type: 'project_sale' }).populate('project');
    res.status(200).json({ success: true, count: soldProjects.length, data: soldProjects });
  } catch (err) {
    next(err);
  }
};


exports.getSellerActivity = async (req, res, next) => {
  try {
    const sellerId = req.user.id;
    
    const [projects, soldProjects, transactions] = await Promise.all([
      Project.find({ seller: sellerId }),
      Transaction.find({ seller: sellerId, type: 'project_sale' }).populate('project'),
      Transaction.find({ seller: sellerId })
    ]);
    res.status(200).json({
      success: true,
      data: {
        createdProjects: projects,
        soldProjects: soldProjects,
        transactions: transactions
      }
    });
  } catch (err) {
    next(err);
  }
};
