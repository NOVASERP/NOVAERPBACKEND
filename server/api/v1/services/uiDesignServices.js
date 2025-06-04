const uiModel=require("../../../models/uiModel");


const uiDesServices={
    createUiDes: async (insertObj) => {
        return await uiModel.create(insertObj);
    },

    findUiDesign: async (query) => {
        return await uiModel.findOne(query);
    },

    findUiDesData: async (query) => {
        return await uiModel.find(query);
    },

    deleteUiDes: async (query) => {
        return await uiModel.deleteOne(query);
    },

   
    updateUiDes: async (query, updateObj) => {
        return await uiModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalUiDes: async (body) => {
        return await uiModel.countDocuments(body);
    }    
}

module.exports={uiDesServices}