const _tryIt = async function (codeBase, data, res) {
    const { errCode, errMsg, Model, payload } = data;
    try {
       await codeBase(Model, payload, res);
    } catch (e) {
        return res.status(errCode).send({ e, errMsg });
    }
};

module.exports = {
    tryIt: _tryIt
};
