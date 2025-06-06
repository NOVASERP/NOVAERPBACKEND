const noticeBrdModel=require("../../../models/noticeBrdModel");


const noticeBrdServices={
    createNotice: async (insertObj) => {
        return await noticeBrdModel.create(insertObj);
    },

    findNotice: async (query) => {
        return await noticeBrdModel.findOne(query);
    },

    findNoticeData: async (query) => {
        return await noticeBrdModel.find(query);
    },

    deleteNotice: async (query) => {
        return await noticeBrdModel.deleteOne(query);
    },

   
    updateNotice: async (query, updateObj) => {
        return await noticeBrdModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalNotice: async (body) => {
        return await noticeBrdModel.countDocuments(body);
    }    
}

module.exports={noticeBrdServices}