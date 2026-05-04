const BaseModel = require('./BaseModel');

class ServiceModel extends BaseModel {
    constructor() {
        super('services');
    }
}

module.exports = new ServiceModel();
