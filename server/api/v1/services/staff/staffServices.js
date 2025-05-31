const staffModel=require("../../../../models/staffModel");


const staffServices={
    createStaff: async (insertObj) => {
        return await staffModel.create(insertObj);
    },

    findStaff: async (query) => {
        return await staffModel.findOne(query);
    },

    findStaffData: async (query) => {
        return await staffModel.find(query);
    },

    deleteStaff: async (query) => {
        return await staffModel.deleteOne(query);
    },

   
    updateStaff: async (query, updateObj) => {
        return await staffModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalStaff: async (body) => {
        return await staffModel.countDocuments(body);
    }    
}

module.exports={staffServices}