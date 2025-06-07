const classModel=require("../../../models/classModel");


const classServices={
    createClass: async (insertObj) => {
        return await classModel.create(insertObj);
    },

    findClass: async (query) => {
        return await classModel.findOne(query);
    },

    findClassData: async (query) => {
        return await classModel.find(query);
    },

    deleteClass: async (query) => {
        return await classModel.deleteOne(query);
    },

   
    updateClass: async (query, updateObj) => {
        return await classModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalClass: async (body) => {
        return await classModel.countDocuments(body);
    }    
}

module.exports={classServices}