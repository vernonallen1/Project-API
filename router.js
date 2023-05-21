import {
  getStudents,
  getStudentByStudentsNumber,
  getStudentsSortedByFirstame,
  getStudentsSortedByLastname,
  getStudentsSortedByStudentNumber,
  addNewStudent,
  addStudentApplication,
  assignAdviser,
  getApprovers,
  addApprover,
  deleteApprover
} from "./controllers/student-controller.js";

export default function router(app) {
  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    next();
  });

  //Student
  app.get("/get-all-students", getStudents); //working
  app.post("/get-student-by-studentnumber", getStudentByStudentsNumber); //working
  app.post("/get-students-sorted-by-firstname", getStudentsSortedByFirstame); //working
  app.post("/get-students-sorted-by-lastname", getStudentsSortedByLastname); //working
  app.post(
    "/get-students-sorted-by-studentnumber",
    getStudentsSortedByStudentNumber
  ); //working
  app.post("/add-new-student", addNewStudent); //working
  app.post("/add-student-application", addStudentApplication); //working
  app.post("/assign-adviser", assignAdviser); //testing

  //Approver
  app.get("/get-all-approvers", getApprovers); //working
  app.post("/add-approver", addApprover); //working
  app.delete("/delete-approver/:approverEmail", deleteApprover);

  // Student Application APIs
}
