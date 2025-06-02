const jwt=require('jsonwebtoken');


module.exports={
    getToken:async(payload)=>{
        try {
           const token= jwt.sign(payload,'charu',{expiresIn:'24'}) ;
           return token;
        } catch (error) {
            return(error);
        }
    },
 formatDate:async(date)=> {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

}