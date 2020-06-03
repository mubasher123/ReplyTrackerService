const mongoose = require('mongoose');
const log = require('../Logging/Log');

mongoose.connect(process.env.MONGODB_CONN_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) throw err;
    log.info({}, 'Database Connection Established')
});


module.exports = mongoose;