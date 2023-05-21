import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/SIETE");

const User = mongoose.model('user');
User.remove('studentnumber');
User.remove('adviser');



const createApprover = async (req, res) => {
  const {firstname, middlename, lastname, usertype, upmail, password, applications} = req.body;
  // const approver = await Approver.
}

export {getApprovers}