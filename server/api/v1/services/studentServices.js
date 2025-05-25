const studentModel=require("../../../models/studentModel");


const studentServices={
    createStudent: async (insertObj) => {
        return await studentModel.create(insertObj);
    },

    findStudent: async (query) => {
        return await studentModel.findOne(query);
    },

    findStudentData: async (query) => {
        return await studentModel.find(query);
    },

    deleteStudent: async (query) => {
        return await studentModel.deleteOne(query);
    },

   
    updateStudent: async (query, updateObj) => {
        return await studentModel.findOneAndUpdate(query, updateObj, { new: true });
    },

     countTotalStudent: async (body) => {
        return await studentModel.countDocuments(body);
    }    
}

module.exports={studentServices}