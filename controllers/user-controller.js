import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

await mongoose.connect("mongodb://127.0.0.1:27017/SIETE");

const User = mongoose.model("user", {
  firstname: String,
  middlename: String,
  lastname: String,
  studentnumber: String,
  usertype: String,
  upmail: String,
  password: String,
  applications: [String],
  adviser: String,
});

//get all students
const getStudents = async (req, res) => {
  const students = await User.find({usertype: 'Student'});
  res.send(students);
};

// get subject by code
const getStudentByStudentsNumber = async (req, res) => {
  const { studentnumber } = req.body;
  const student = await User.findOne({ usertype: 'Student', studentnumber: studentnumber });
  res.send(student);
};

const getStudentByName = async (req, res) => {
  const {firstname, middlename, lastname} = req.body;
  
  try {
    const student = await User.findOne({usertype: 'Student', firstname: firstname, middlename: middlename, lastname: lastname});
    if (student) {
      res.send(student);
    } else {
      res.status(404).send("Students was not found!");
    }
    
  } catch (error) {
    res.status(500).send('Error retrieving student');
  }
  
}

//get student alphabetically sorted by their firts names
const getStudentsSortedByFirstame = async (req, res) => {
  const { isAscending } = req.body;
  var students;
  if (isAscending) {
    students = await User.find({usertype: 'Student'}).sort({ firstname: 1 });
  } else {
    students = await User.find({usertype: 'Student'}).sort({ firstname: -1 });
  }
  res.send(students);
};

//get student alphabetically sorted by their last names
const getStudentsSortedByLastname = async (req, res) => {
  const { isAscending } = req.body;
  var students;
  if (isAscending) {
    students = await User.find({usertype: 'Student'}).sort({ lastname: 1 });
  } else {
    students = await User.find({usertype: 'Student'}).sort({lastname: -1 });
  }
  res.send(students);
};

//sort students by their student number
const getStudentsSortedByStudentNumber = async (req, res) => {
  const { isAscending } = req.body;
  var students;
  if (isAscending) {
    students = await User.find({usertype: 'Student'}).sort({studentnumber: 1 });
  } else {
    students = await User.find({usertype: 'Student'}).sort({studentnumber: -1 });
  }
  res.send(students);
};

// save new student
const addNewStudent = async (req, res) => {
  const { firstname, middlename, lastname, studentnumber, usertype, upmail, password, applications, adviser } = req.body;

  const newStudent = new User({
    firstname,
    middlename,
    lastname,
    studentnumber,
	usertype,
    upmail,
	password,
	applications,
	adviser
  });

  const result = await newStudent.save();

  if (result._id) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

const addStudentApplication = async (req, res) => {
  const { applicationId, studentId } = req.body;

  const applicationObjectId = new mongoose.Types.ObjectId(applicationId);
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  const result = await User.updateOne(
    { _id: studentObjectId },
    { $push: { applications: applicationObjectId } }
  );
  console.log(result.modifiedCount)
  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

const assignAdviser = async (req, res) => {
    const { adviserEmail, studentnumber } = req.body;
    const adviser = await User.findOne({upmail: adviserEmail});
    console.log(adviser);
    const adviserObjectId = new ObjectId(adviser._id);
    console.log(adviserObjectId);
    const result = await User.updateOne({usertype: 'Student', studentnumber: studentnumber}, {$set : {adviser : adviserObjectId}})
    if (result.modifiedCount > 0) {
      res.send({"success" : true});
    } else {
      res.send({"succes" : false});
    }
};

const getStudentAdviser = async(req, res) => {
  const {studentnumber} = req.body;
  try {
    const adviser = await User.aggregate([
      {
        $match: {
          studentnumber: studentnumber,
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "adviser",
          foreignField: "_id",
          as: "adviser"
        }
      },
      {
        $project: {
          adviser: 1
        }
      }
    ]);
    console.log(adviser);
    res.send(adviser);
  } catch (error) {
    res.status(500).send("An error has occured");
  }
}

const getApprovers = async (req, res) => {
  const approvers = await User.find({usertype: 'Approver'});
  res.send(approvers);
}

const addApprover = async (req, res) => {
  const {firstname, middlename, lastname, usertype, upmail, password, applications} = req.body;
  const newApprover = new User({
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    usertype: usertype,
    upmail: upmail,
    password: password,
    applications: applications
  });

  const result = await newApprover.save();

  if (result._id) {
    res.send({success: true});
  } else {
    res.send({success: false});
  }
}

const deleteApprover = async (req, res) => {
  const approverEmail = req.params.approverEmail;

  try {
    const result = await User.deleteOne({upmail: approverEmail});

    if (result) {
      res.send({success: true})
    } else {
      res.status(404).send("User was not found!");
    }
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
}

const getApproverByName = async (req, res) => {
  const {firstname, middlename, lastname } = req.body;

  try {
    const approver = await User.findOne({usertype: 'Approver', firstname: firstname, middlename: middlename, lastname: lastname});
    if (approver) {
      res.send(approver);
    } else {
      res.status(404).send("User was not found");
    }
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
}

const getApproversSortedByName = async (req, res) => {
  const { isAscending } = req.body;

  try {
    var approvers;
    if (isAscending) {
      approvers = await User.find({usertype: 'Approver'}).sort({firstname: 1})
    } else {
      approvers = await User.find({usertype: 'Approver'}).sort({firstname: -1})
    }
    res.send(approvers);
  } catch (error) {
    res.status(500).send('There was an error!');
  } 
}

const getApplicationsByApprover = async(req, res) => {
  const {upmail} = req.body;
  console.log(upmail);
  try {
    const applications = await User.aggregate([
      {
        $match: {
          upmail: upmail,
          usertype: "Student"
        }
      },
      {
        $lookup: {
          from: "applications",
          localField: "applications",
          foreignField: "_id",
          as: "applications"
        }
      }
    ]);
    if (applications[0]["applications"].length > 0){
      res.send(applications[0]["applications"]);
    } else if (applications[0]["applications"].length === 0){
      res.send([]);
    } else {
      res.status(404).send("Error");
    }
    
  } catch (error) {
    res.status(500).send("An error has occured");
  }
}

export {
  getStudents,
  getStudentByStudentsNumber,
  getStudentByName,
  getStudentsSortedByFirstame,
  getStudentsSortedByLastname,
  getStudentsSortedByStudentNumber,
  addNewStudent,
  addStudentApplication,
  assignAdviser,
  getStudentAdviser,
  getApprovers,
  addApprover,
  deleteApprover,
  getApproverByName,
  getApproversSortedByName,
  getApplicationsByApprover
};
