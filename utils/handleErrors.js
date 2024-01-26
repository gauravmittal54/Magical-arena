module.exports = (error, res) => {
    console.log(error.name,error.code,error.kind,error.path,"kkk")
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ status: false, errormessage: ['Player name must be unique.'] });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: false, errormessage: errors });
    } else if (error.name === 'CastError' && error.kind === 'ObjectId' && error.path === '_id') {
        return res.status(400).json({ status: false, errormessage: [`Invalid player ID format advised.`] });
    } else {
      console.error(error);
      return res.status(500).json({ status: false, errormessage: ['Internal server error.'] });
    }
  };