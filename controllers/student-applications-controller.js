import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/SIETE");

const Application = mongoose.model("application", {
  status: String,
  step: Number,
  remark: [{}],
  studentsubmission: [{}]
});

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({});
    res.send(applications);
    } catch (error){
        res.status(500).send("Error retrieving applications");
    }
    
}

export {getAllApplications};