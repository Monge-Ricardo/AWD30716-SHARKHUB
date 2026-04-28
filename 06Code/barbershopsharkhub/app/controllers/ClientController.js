const path = require('path');

exports.dashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/client/dashboard.html'));
};
