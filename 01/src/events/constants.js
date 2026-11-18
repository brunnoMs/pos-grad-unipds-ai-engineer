export const events = {
    userSelected: 'user:selected',
    usersUpdated: 'users:updated',
    purchaseAdded: 'purchase:added',
    purchaseRemoved: 'purchase:remove',
    modelTrain: 'training:train',
    trainingComplete: 'training:complete',

    modelProgressUpdate: 'model:progress-update',
    recommendationsReady: 'recommendations:ready',
    recommend: 'recommend',
}

export const workerEvents = {
    trainingComplete: 'training:complete',
    trainModel: 'train:model',
    recommend: 'recommend',
    trainingLog: 'training:log',
    progressUpdate: 'progress:update',
    tfVisData: 'tfvis:data',
    tfVisLogs: 'tfvis:logs',
    productVectorsReady: 'PRODUCT_VECTORS_READY',
    getUserVectors: 'GET_USER_VECTOR',
    userVectorsFromDB: 'USER_VECTORS_FROM_DB'
}