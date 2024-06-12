const mongoose = require('mongoose');

const getConnection = async () => {

    try {

        const url = 'mongodb://usuario:sjJSnvB29c942sIo@ac-nsflvo0-shard-00-00.q9koky9.mongodb.net:27017,ac-nsflvo0-shard-00-01.q9koky9.mongodb.net:27017,ac-nsflvo0-shard-00-02.q9koky9.mongodb.net:27017/inventarios-2024-28?ssl=true&replicaSet=atlas-ewzyvi-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'

        await mongoose.connect(url);

        console.log('conexion exitosa');

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getConnection
}