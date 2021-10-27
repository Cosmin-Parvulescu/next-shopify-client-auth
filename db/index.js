import mongoose from 'mongoose'

let dbInstance = undefined;
let modelDict = {};

const getDbInstance = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    return dbInstance;
}

const modelFactory = async (name, modelSchema) => {
    if (modelDict[name] != null) {
        return modelDict[name];
    }

    const db = await getDbInstance();

    const model = db.model(name, modelSchema);
    modelDict[name] = model;
    return modelDict[name];
}

export {
    getDbInstance,
    modelFactory
}