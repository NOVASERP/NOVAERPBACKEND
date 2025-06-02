const userModel=require("../../../models/userModel");


const userServices={
    createUser: async (insertObj) => {
        return await userModel.create(insertObj);
    },

    findUser: async (query) => {
        return await userModel.findOne(query);
    },

    findUserData: async (query) => {
        return await userModel.find(query);
    },

    deleteUser: async (query) => {
        return await userModel.deleteOne(query);
    },

   
    updateUser: async (query, updateObj) => {
        return await userModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalUser: async (body) => {
        return await userModel.countDocuments(body);
    }    
}

module.exports={userServices}