//Packages
const fs = require("fs");
const xlsx = require("node-xlsx");
// const DB = require("../models/db");
const DBpool = require("../models/db");
const {
  createTable,
  insertData,
  existTableDrop,
  createSpecialTable,
  checkTableExistence,
  createRepeatClashTable,
} = require("./files.functions");

exports.uploadFile = (req, res) => {
  const coursesFile = req.files["courses"] ? req.files["courses"][0] : null;
  const mappingFile = req.files["mapping"] ? req.files["mapping"][0] : null;
  const sem_regFile = req.files["sem_reg"] ? req.files["sem_reg"][0] : null;
  const offer_course_exmFile = req.files["offer_course_exm"]
    ? req.files["offer_course_exm"][0]
    : null;

  const fileArray = [
    coursesFile,
    mappingFile,
    sem_regFile,
    offer_course_exmFile,
  ];

  // Loop through each file
  try {
    fileArray.forEach((file) => {
      if (file) {
        const filePath = file.path;
        const tableName = file.fieldname;

        // Using Node-xlsx
        // Read and parse the Excel file
        const workbook = xlsx.parse(fs.readFileSync(filePath));

        // Assuming data is in the first sheet and that the first row contains headers
        const sheet = workbook[0].data;

        // Get headers and rows
        const headers = sheet[0];
        const rows = sheet.slice(1);

        // console.log(`Processing file for table: ${tableName}`);
        // console.log(`Headers: ${headers}`);
        // console.log(`Rows: ${rows.length}`);

        // Create table and insert data
        (async () => {
          await existTableDrop(tableName);
          await createTable(headers, tableName);
          await insertData(headers, rows, tableName);
        })();
      }
    });

    return res
      .status(201)
      .send("Tables created and data inserted successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
    return res.status(501).send(error.message);
  }
};

exports.requiredTablesExist = async (req, res) => {
  const requiredTables = ["courses", "mapping", "offer_course_exm", "sem_reg"];

  try {
    for (const tableName of requiredTables) {
      const tableExists = await checkTableExistence(tableName);
      if (!tableExists) {
        return res
          .status(401)
          .send(
            `Table '${tableName}' does not exist. All required tables must be present.`
          );
      }
    }
    return res.status(200).send("All required tables exist.");
  } catch (error) {
    console.error("Error checking table existence:", error.message);
    return res
      .status(500)
      .send("An error occurred while checking table existence.");
  }
};

exports.createNewSemReg = async (req, res) => {
  try {
    await existTableDrop("new_sem_reg");
    await createSpecialTable();
    return res.status(201).send("Table created and updated successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
    return res.status(501).send(error.message);
  }
};

exports.getFiles = async (req, res) => {
  const tableName = req.params.table;
  try {
    const [result, fields] = await DBpool.query(`SELECT * FROM ${tableName}`);
    const columnNames = fields.map((field) => field.name);
    return res.json({
      columns: columnNames,
      data: result,
    });
  } catch (error) {
    res.status(501).send(error);
    return;
  }
  // await DBpool.query(`SELECT * FROM ${tableName}`, (error, result, fields) => {
  //   if (error) {
  //     res.status(501).send(error);
  //     return;
  //   }

  //   const columnNames = fields.map((field) => field.name);
  //   // console.log(columnNames);

  //   return res.json({
  //     columns: columnNames,
  //     data: result,
  //   });
  // });
};

exports.createRepeatClashes = async (req, res) => {
  try {
    await existTableDrop("repeatClashes");
    await createRepeatClashTable();
    return res.status(201).send("Table created successfully.");
  } catch (error) {
    console.error("Error table creation:", error);
    return res.status(501).send(error.message);
  }
};

exports.getClashes = async (req, res) => {
  const level = req.params.level;
  try {
    const clashesQuery = `SELECT r1.CO_CODE AS course1,r2.CO_CODE AS course2, COUNT(DISTINCT r1.REG_NO) AS num_students FROM new_sem_reg r1 JOIN new_sem_reg r2 ON r1.REG_NO = r2.REG_NO AND r1.CO_CODE < r2.CO_CODE AND r1.LEVEL =${level} AND r2.LEVEL =${level} GROUP BY r1.CO_CODE, r2.CO_CODE HAVING num_students > 0`;
    const [result, fields] = await DBpool.query(clashesQuery);
    const columnNames = fields.map((field) => field.name);
    return res.json({
      columns: columnNames,
      data: result,
    });
  } catch (error) {
    res.status(501).send(error);
    return;
  }
};

exports.uploadClashes = (req, res) => {
  const level = req.params.level;
  const tableName = level + "_Level";
  const headers = req.body.headers;
  const rows = req.body.rows;
  // console.log(typeof headers);
  // console.log(rows);
  try {
    (async () => {
      await existTableDrop(tableName);
      await createTable(headers, tableName);
      await insertData(headers, rows, tableName);
    })();

    return res
      .status(201)
      .send("Tables created and data inserted successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
    return res.status(501).send(error.message);
  }
};

exports.getCourses = async (req, res) => {
  const coursesAttributes = req.params.coursesAttribute.split("-");
  const level = coursesAttributes[0];
  const semester = coursesAttributes[1];

  try {
    const coursesQuery = `SELECT CO_CODE FROM courses WHERE LEVEL = ${level} AND SEMESTER = '${semester}'`;
    const [result, fields] = await DBpool.query(coursesQuery);
    const columnNames = fields.map((field) => field.name);
    // console.log(result);
    return res.json({
      columns: columnNames,
      data: result,
    });
  } catch (error) {
    res.status(501).send(error);
    return;
  }
};

exports.getNotClashes1 = async (req, res) => {
  const coursesList = req.params.coursesList;
  const selectedSubjects = coursesList.split(",");
  const placeholders = selectedSubjects.map(() => "?").join(", ");

  const semester = req.query.semester;
  const level = req.query.level;

  if (!semester || !level) {
    return res.status(400).send("Semester and level are required.");
  }

  try {
    const coursesQuery = `SELECT DISTINCT CO_CODE FROM new_sem_reg WHERE CO_CODE NOT IN ( SELECT CASE WHEN course1 IN (${placeholders}) THEN course2 ELSE course1 END AS clash_subject FROM ${level}_level WHERE course1 IN (${placeholders}) OR course2 IN (${placeholders})) AND CO_CODE NOT IN (${placeholders}) AND SEMESTER = '${semester}' AND LEVEL = ${level}`;

    const queryParams = [
      ...selectedSubjects,
      ...selectedSubjects,
      ...selectedSubjects,
      ...selectedSubjects,
    ];

    const [result, fields] = await DBpool.query(coursesQuery, queryParams);

    const columnNames = fields.map((field) => field.name);
    return res.json({
      columns: columnNames,
      data: result,
    });
  } catch (error) {
    console.error("Error in getNotClashes:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getNotClashes2 = async (req, res) => {
  const coursesList = req.params.coursesList;
  const selectedSubjects = coursesList.split(",");
  const placeholders = selectedSubjects.map(() => "?").join(", ");

  const semester = req.query.semester;
  const level = req.query.level;
  const selectedSubjectArray = req.query.selectedSubjects;
  const preSelectedSubject = selectedSubjectArray.split(",");
  const preSelectedSubjectArray = preSelectedSubject
    .map((code) => `'${code}'`)
    .join(", ");

  if (!semester || !level) {
    return res.status(400).send("Semester and level are required.");
  }

  try {
    const coursesQuery = `SELECT DISTINCT CO_CODE FROM new_sem_reg WHERE CO_CODE NOT IN ( SELECT CASE WHEN course1 IN (${placeholders}) THEN course2 ELSE course1 END AS clash_subject FROM ${level}_level WHERE course1 IN (${placeholders}) OR course2 IN (${placeholders})) AND CO_CODE NOT IN (${placeholders}) AND CO_CODE NOT IN (${preSelectedSubjectArray}) AND SEMESTER = '${semester}' AND LEVEL = ${level}`;

    const queryParams = [
      ...selectedSubjects,
      ...selectedSubjects,
      ...selectedSubjects,
      ...selectedSubjects,
    ];

    const [result, fields] = await DBpool.query(coursesQuery, queryParams);

    const columnNames = fields.map((field) => field.name);
    return res.json({
      columns: columnNames,
      data: result,
    });
  } catch (error) {
    console.error("Error in getNotClashes:", error);
    res.status(500).send("Internal Server Error");
  }
};

//*************************************************************************************************************** */

const generateConflictArray = (sqlResult) => {
  const conflictMap = new Map();

  // Process each row from the SQL query result
  sqlResult.forEach(({ course1, course2 }) => {
    // Add course2 to course1's conflict list
    if (!conflictMap.has(course1)) {
      conflictMap.set(course1, new Set());
    }
    conflictMap.get(course1).add(course2);

    // Add course1 to course2's conflict list
    if (!conflictMap.has(course2)) {
      conflictMap.set(course2, new Set());
    }
    conflictMap.get(course2).add(course1);
  });

  // Convert the conflict map to the desired array format
  const conflictArray = Array.from(conflictMap.entries()).map(
    ([course, conflicts]) => [course, Array.from(conflicts)]
  );

  return conflictArray;
};

const arrangeConflictSets = (conflictArray) => {
  const result = [];

  while (conflictArray.length > 0) {
    const noConflictSet = [];
    const selectedSubjects = new Set(); // Track subjects added to this set in the current loop

    while (true) {
      // Find the subject with the maximum conflicts
      let maxConflictSubject = null;
      let maxConflicts = -1;

      for (const [subject, conflicts] of conflictArray) {
        // Skip subjects already selected in this noConflictSet
        if (selectedSubjects.has(subject)) continue;

        // Check if this subject conflicts with any in the current noConflictSet
        const conflictsWithCurrentSet = noConflictSet.some((setSubject) =>
          conflicts.includes(setSubject)
        );

        if (!conflictsWithCurrentSet && conflicts.length > maxConflicts) {
          maxConflictSubject = subject;
          maxConflicts = conflicts.length;
        }
      }

      // If no valid subject is found, break out of the loop
      if (!maxConflictSubject) break;

      // Add the subject with max conflicts to the noConflictSet
      noConflictSet.push(maxConflictSubject);
      selectedSubjects.add(maxConflictSubject);
    }

    // Add the current noConflictSet to the result
    result.push(noConflictSet);

    // Remove all subjects in the current noConflictSet from conflictArray
    conflictArray = conflictArray.filter(
      ([subject]) => !noConflictSet.includes(subject)
    );

    // Update remaining conflicts for subjects still in conflictArray
    conflictArray = conflictArray.map(([subject, conflicts]) => [
      subject,
      conflicts.filter((conflict) => !noConflictSet.includes(conflict)),
    ]);
  }

  return result;
};

exports.setupExam = async (req, res) => {
  try {
    // Step 1: Fetch conflict matrix
    const clashesQuery = `SELECT r1.CO_CODE AS course1,r2.CO_CODE AS course2, COUNT(DISTINCT r1.REG_NO) AS num_students FROM new_sem_reg r1 JOIN new_sem_reg r2 ON r1.REG_NO = r2.REG_NO AND r1.CO_CODE < r2.CO_CODE GROUP BY r1.CO_CODE, r2.CO_CODE HAVING num_students > 0`;
    const [conflicts] = await DBpool.query(clashesQuery);

    const conflictArray = generateConflictArray(conflicts);

    // Step 2: Apply graph coloring
    const output = arrangeConflictSets(conflictArray);

    // Step 3: Map colors to time slots
    console.log(output);
    console.log(conflictArray);

    // Step 4: Save timetable to database
    // await DBpool.query("DELETE FROM timetable"); // Clear old timetable
    // const insertValues = timetable.map(({ subject_id, time_slot }) => [subject_id, time_slot]);
    // await DBpool.query("INSERT INTO timetable (subject_id, time_slot) VALUES ?", [insertValues]);

    res.json({ success: true, output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
