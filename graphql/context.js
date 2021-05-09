const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/User');

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null;
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(auth.substring(7), SECRET_KEY);
    const currentUser = await User.findById(decodedToken.id)
      .populate('friends');
    return { currentUser };
  }
};

module.exports = context;