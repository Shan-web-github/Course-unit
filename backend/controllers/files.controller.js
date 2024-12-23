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
  createClashesTable,
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

exports.createClashes = async (req, res) => {
  try {
    await existTableDrop("clashesTable");
    await createClashesTable();
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
    const coursesQuery = `SELECT DISTINCT CO_CODE FROM new_sem_reg WHERE CO_CODE NOT IN ( SELECT CASE WHEN course1 IN (${placeholders}) THEN course2 ELSE course1 END AS clash_subject FROM clashesTable WHERE course1 IN (${placeholders}) OR course2 IN (${placeholders})) AND CO_CODE NOT IN (${placeholders}) AND SEMESTER = '${semester}' AND LEVEL = ${level}`;

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
    const coursesQuery = `SELECT DISTINCT CO_CODE FROM new_sem_reg WHERE CO_CODE NOT IN ( SELECT CASE WHEN course1 IN (${placeholders}) THEN course2 ELSE course1 END AS clash_subject FROM clashesTable WHERE course1 IN (${placeholders}) OR course2 IN (${placeholders})) AND CO_CODE NOT IN (${placeholders}) AND CO_CODE NOT IN (${preSelectedSubjectArray}) AND SEMESTER = '${semester}' AND LEVEL = ${level}`;

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
//choose timetable 
// Below part is most important part in this Backend

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

const arrangeNoConflictSets1 = async (conflictArray) => {
  const result = [];

  while (conflictArray.length > 0) {
    const noConflictSet = [];
    const selectedSubjects = new Set(); // Track subjects added to this set in the current loop
    let totalStudents = 0; // Keep track of the total students in the current set

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
      // if (!maxConflictSubject) break;

      const subjectArray = [...noConflictSet, maxConflictSubject];
      const formattedSubjects = subjectArray
        .map((subject) => `'${subject}'`)
        .join(", ");

      const numOfStudentQuery = `SELECT COUNT(DISTINCT REG_NO) AS studentCount FROM new_sem_reg WHERE CO_CODE IN (${formattedSubjects})`;

      // Check if adding this subject will exceed the student count constraint
      const [rows] = await DBpool.query(numOfStudentQuery);
      if (rows.length > 0) {
        const count = rows[0].studentCount; // Assuming 'studentCount' is the column name
        if (count > 800 || !maxConflictSubject) break;
      } else {
        console.log("No data returned from query");
      }

      // Add the subject with max conflicts to the noConflictSet
      noConflictSet.push(maxConflictSubject);
      selectedSubjects.add(maxConflictSubject);
      totalStudents = rows[0].studentCount; // Update total students in the set
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
//************************ */
const arrangeNoConflictSets2 = (conflictArray) => {
  const noConflictSets = [];

  while (conflictArray.length > 0) {
    // Step 1: Arrange conflicts by number of conflicts (ascending order)
    conflictArray.sort((a, b) => a[1].length - b[1].length);

    const noConflictSet = [];
    const usedSubjects = new Set();

    // Step 2: Find the subject with the minimum conflicts as arr1
    const arr1 = conflictArray.shift(); // The first item is the one with minimum conflicts
    noConflictSet.push(arr1[0]);
    usedSubjects.add(arr1[0]);

    let potentialSubjects = conflictArray.filter(
      (subject) => !arr1[1].includes(subject[0])
    );

    while (potentialSubjects.length > 0) {
      // Step 3: Among non-conflicting subjects, pick the one with minimum conflicts
      potentialSubjects.sort((a, b) => a[1].length - b[1].length);
      const nextSubject = potentialSubjects.shift();

      noConflictSet.push(nextSubject[0]);
      usedSubjects.add(nextSubject[0]);

      // Step 4: Filter remaining subjects that are not in conflict with the current noConflictSet
      potentialSubjects = potentialSubjects.filter(
        (subject) =>
          !noConflictSet.some((addedSubject) =>
            subject[1].includes(addedSubject)
          )
      );
    }

    // Step 5: Add the current noConflictSet to the result and remove used subjects from the input
    noConflictSets.push(noConflictSet);
    conflictArray = conflictArray.filter(
      (subject) => !usedSubjects.has(subject[0])
    );
  }

  return noConflictSets;
};
//************************ */
const arrangeNoConflictSets3 = (conflictArray) => {
  const conflictSets = [];

  while (conflictArray.length > 0) {
    // Step 1: Sort conflicts in descending order of the number of conflicts
    conflictArray.sort((a, b) => b[1].length - a[1].length);

    const noConflictSet = [];
    const usedSubjects = new Set();

    // Step 2: Pick the subject with the maximum conflicts as arr1
    const arr1 = conflictArray.shift(); // The first item is the one with maximum conflicts
    noConflictSet.push(arr1[0]);
    usedSubjects.add(arr1[0]);

    // Step 3: Find subjects that do not conflict with arr1
    let potentialSubjects = conflictArray.filter(
      (subject) => !arr1[1].includes(subject[0])
    );

    while (potentialSubjects.length > 0) {
      // Step 4: Among non-conflicting subjects, pick the one with minimum conflicts
      potentialSubjects.sort((a, b) => a[1].length - b[1].length);
      const nextSubject = potentialSubjects.shift();

      noConflictSet.push(nextSubject[0]);
      usedSubjects.add(nextSubject[0]);

      // Step 5: Filter remaining subjects that are not in conflict with the current noConflictSet
      potentialSubjects = potentialSubjects.filter(
        (subject) =>
          !noConflictSet.some((addedSubject) =>
            subject[1].includes(addedSubject)
          )
      );
    }

    // Step 6: Add the current noConflictSet to the result and remove used subjects from the input
    conflictSets.push(noConflictSet);
    conflictArray = conflictArray.filter(
      (subject) => !usedSubjects.has(subject[0])
    );
  }

  return conflictSets;
};
//************************ */
const arrangeNoConflictSets4 = (conflictArray) => {
  const conflictSets = [];

  while (conflictArray.length > 0) {
    // Sort the array by the number of conflicts in descending order
    conflictArray.sort((a, b) => b[1].length - a[1].length);

    const noConflictSet = [];
    const usedSubjects = new Set();

    // Step 1: Pick the subject with the max conflicts (arr1)
    const arr1 = conflictArray.shift();
    noConflictSet.push(arr1[0]);
    usedSubjects.add(arr1[0]);

    // Step 2: Find subjects that do not conflict with the current set
    let potentialSubjects = conflictArray.filter(
      (subject) => !arr1[1].includes(subject[0])
    );

    while (potentialSubjects.length > 0) {
      // Sort potential subjects by the number of conflicts (ascending)
      potentialSubjects.sort((a, b) => a[1].length - b[1].length);

      // Step 3: Pick the subject with the least conflicts (arr2, arr3, ...)
      const nextSubject = potentialSubjects.shift();
      noConflictSet.push(nextSubject[0]);
      usedSubjects.add(nextSubject[0]);

      // Step 4: Update potential subjects to exclude conflicts with the current set
      potentialSubjects = potentialSubjects.filter(
        (subject) =>
          !noConflictSet.some((addedSubject) =>
            subject[1].includes(addedSubject)
          )
      );
    }

    // Add the current non-conflicting set to the result
    conflictSets.push(noConflictSet);

    // Remove used subjects from the input array
    conflictArray = conflictArray.filter(
      (subject) => !usedSubjects.has(subject[0])
    );
  }

  return conflictSets;
};
//***************************************************************************** */
const processInputArray = async (inputArray, conflictArray) => {
  // Get the input array length
  const j = inputArray.length;

  // Loop through the input array in reverse order
  for (let index = j - 1; index >= 0; index--) {
    // Step 1: Create arr1 by excluding the current element (inputArray[index])
    let arr1 = inputArray.filter((_, i) => i !== index);

    // Step 2: Sort arr1 based on descending order of element lengths
    arr1.sort((a, b) => b.length - a.length);

    // Step 3: Get the current element of inputArray
    const lastElement = inputArray[index];

    // Function to check if two sets are in conflict
    const isConflict = (set1, set2, conflictArray) => {
      // Create a map from conflictArray for quick lookup
      const conflictMap = new Map(conflictArray);
    
      for (let subject of set1) {
        // Get the list of conflicts for the current subject
        const conflicts = conflictMap.get(subject) || [];
    
        // Check if any subject in set2 is in the conflicts list
        for (let otherSubject of set2) {
          if (conflicts.includes(otherSubject)) {
            return true; // Conflict found
          }
        }
      }
    
      return false; // No conflict
    };
    

    // Step 4: Loop through arr1's elements and check conflicts
    for (let i = 0; i < arr1.length; i++) {
      const currentSet = arr1[i];

      // Check for conflicts and student count
      if (!isConflict(lastElement, currentSet, conflictArray)) {
        // Combine sets and check student count
        const combinedSet = [...new Set([...lastElement, ...currentSet])];

        const formattedSubjects = combinedSet
          .map((subject) => `'${subject}'`)
          .join(", ");

        const numOfStudentQuery = `SELECT COUNT(DISTINCT REG_NO) AS studentCount FROM new_sem_reg WHERE CO_CODE IN (${formattedSubjects})`;

        // Check if adding this subject will exceed the student count constraint
        const [rows] = await DBpool.query(numOfStudentQuery);

        if (rows[0].studentCount <= 800) {
          // Create a new input array with the combined set
          const newInputArray = [
            ...arr1.slice(0, i),
            combinedSet,
            ...arr1.slice(i + 1),
          ];

          // Process the new array recursively
          return await processInputArray(newInputArray);
        }
      }
    }
  }

  // Base case: Return the current input array if no valid combination is found
  return inputArray;
};

//**************************************************************************** */
exports.setupExam = async (req, res) => {
  try {
    // Step 1: Fetch conflict matrix
    const clashesQuery = `SELECT r1.CO_CODE AS course1,r2.CO_CODE AS course2, COUNT(DISTINCT r1.REG_NO) AS num_students FROM new_sem_reg r1 JOIN new_sem_reg r2 ON r1.REG_NO = r2.REG_NO AND r1.CO_CODE < r2.CO_CODE GROUP BY r1.CO_CODE, r2.CO_CODE HAVING num_students > 0`;
    const [conflicts] = await DBpool.query(clashesQuery);

    const conflictArray = generateConflictArray(conflicts);

    // Step 2: Apply graph coloring
    const output1 = await arrangeNoConflictSets1(conflictArray);
    const output_1 = await processInputArray(output1, conflictArray);

    const output2 = arrangeNoConflictSets2(conflictArray);
    const output_2 = await processInputArray(output2, conflictArray);

    const output3 = arrangeNoConflictSets3(conflictArray);
    const output_3 = await processInputArray(output3, conflictArray);
    
    const output4 = arrangeNoConflictSets4(conflictArray);
    const output_4 = await processInputArray(output4, conflictArray);


    const output = [output_1, output_2, output_3, output_4];

    // Step 3: Map colors to time slots
    console.log(output_1);
    // console.log(conflictArray);

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
