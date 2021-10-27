import mongoose from 'mongoose'

let dbInstance = undefined;

const getDbInstance = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    return dbInstance;
}

const modelFactory = (dbInstance, name, modelSchema) => {
    return dbInstance.model(name, modelSchema);
}

export {
    getDbInstance,
    modelFactory
}