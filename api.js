require("./server/index")



const studentId= "STU" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4)

            console.log("studentId==",studentId);
            