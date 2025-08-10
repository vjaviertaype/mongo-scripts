use("fs-2025");

db.createCollection("teachers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "specialty", "yearsOfExperience"],
      properties: {
        name: { bsonType: "string", minLength: 2 },
        age: { bsonType: "int", minimum: 25, maximum: 70 },
        specialty: { bsonType: "string" },
        yearsOfExperience: { bsonType: "int", minimum: 0 },
      },
    },
  },
});

db.teachers.insertMany([
  {
    name: "Laura",
    age: 45,
    specialty: "Física",
    department: "Ciencias",
    yearsOfExperience: 20,
    email: "laura.phys@mail.com",
    salary: 3800.0,
    active: true,
  },
  {
    name: "Carlos",
    age: 38,
    specialty: "Filosofía",
    yearsOfExperience: 12,
    email: "carlos.phil@mail.com",
    salary: 3600.0,
    active: true,
  },
  {
    name: "María",
    age: 50,
    specialty: "Química",
    yearsOfExperience: 25,
    salary: 4200.0,
    active: true,
  },
  {
    name: "Jorge",
    age: 33,
    specialty: "Literatura",
    yearsOfExperience: 8,
    email: "jorge.lit@mail.com",
    salary: 3100.0,
  },
  {
    name: "Ana",
    age: 29,
    specialty: "Biología",
    department: "Ciencias",
    yearsOfExperience: 5,
    email: "ana.bio@mail.com",
    active: true,
  },
  {
    name: "Miguel",
    age: 41,
    specialty: "Economía",
    department: "Ciencias Sociales",
    yearsOfExperience: 18,
    salary: 4000.0,
    active: true,
  },
  {
    name: "Sofía",
    age: 36,
    specialty: "Psicología",
    yearsOfExperience: 14,
    email: "sofia.psych@mail.com",
    salary: 3700.0,
  },
  {
    name: "Fernando",
    age: 55,
    specialty: "Matemáticas",
    department: "Ciencias",
    yearsOfExperience: 30,
    email: "fernando.math@mail.com",
    salary: 4500.0,
    active: false,
  },
  {
    name: "Valentina",
    age: 28,
    specialty: "Historia",
    department: "Humanidades",
    yearsOfExperience: 4,
    email: "valentina.hist@mail.com",
    salary: 2800.0,
    active: true,
  },
  {
    name: "Ricardo",
    age: 47,
    specialty: "Filosofía",
    department: "Humanidades",
    yearsOfExperience: 22,
    email: "ricardo.phil@mail.com",
    active: true,
  },
]);

db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "code",
        "name",
        "teacherId",
        "schedule",
        "maxCapacity",
        "enrolled",
      ],
      properties: {
        code: { bsonType: "string", minLength: 6 },
        name: { bsonType: "string" },
        teacherId: { bsonType: "objectId" },
        credits: { bsonType: "int", minimum: 1 },
        schedule: {
          bsonType: "object",
          required: ["days", "timeSlots"],
          properties: {
            days: {
              bsonType: "array",
              minItems: 1,
              uniqueItems: true,
              items: {
                bsonType: "string",
                enum: ["L", "M", "X", "J", "V", "S"],
              },
            },
            timeSlots: {
              bsonType: "array",
              minItems: 1,
              maxItems: 3,
              items: {
                bsonType: "object",
                required: ["start", "end"],
                properties: {
                  start: {
                    bsonType: "string",
                    pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$",
                  },
                  end: {
                    bsonType: "string",
                    pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$",
                  },
                },
              },
            },
          },
        },
        enrolled: { bsonType: "array" },
        maxCapacity: { bsonType: "int", minimum: 1 },
      },
    },
  },
});

const pedro = db.teachers.findOne({ name: "Pedro" });
const maria = db.teachers.findOne({ name: "María" });
const miguel = db.teachers.findOne({ name: "Miguel" });

db.courses.insertMany([
  {
    code: "HIS301",
    name: "Historia Avanzada",
    credits: 4,
    teacherId: pedro._id,
    schedule: {
      days: ["L", "M", "J"],
      timeSlots: [{ start: "09:00", end: "11:00" }],
    },
    maxCapacity: 30,
    enrolled: [],
  },
  {
    code: "HIS302",
    name: "Historia Contemporánea",
    credits: 3,
    teacherId: pedro._id,
    schedule: {
      days: ["X", "V"],
      timeSlots: [{ start: "11:00", end: "13:00" }],
    },
    maxCapacity: 25,
    enrolled: [],
  },
  {
    code: "CHE101",
    name: "Química General",
    credits: 5,
    teacherId: maria._id,
    schedule: {
      days: ["M", "X", "V"],
      timeSlots: [
        { start: "10:00", end: "12:00" },
        { start: "13:00", end: "14:00" },
      ],
    },
    maxCapacity: 35,
    enrolled: [],
  },
  {
    code: "CHE102",
    name: "Química Orgánica",
    credits: 4,
    teacherId: maria._id,
    schedule: {
      days: ["L", "J"],
      timeSlots: [{ start: "09:00", end: "11:00" }],
    },
    maxCapacity: 30,
    enrolled: [],
  },
  {
    code: "ECO101",
    name: "Introducción a la Economía",
    credits: 3,
    teacherId: miguel._id,
    schedule: {
      days: ["J", "V"],
      timeSlots: [{ start: "08:00", end: "10:00" }],
    },
    maxCapacity: 40,
    enrolled: [],
  },
  {
    code: "ECO102",
    name: "Macroeconomía",
    credits: 4,
    teacherId: miguel._id,
    schedule: {
      days: ["L", "M"],
      timeSlots: [{ start: "14:00", end: "16:00" }],
    },
    maxCapacity: 35,
    enrolled: [],
  },
]);

const experiencedTeachers = db.teachers
  .find({ yearsOfExperience: { $gt: 15 } })
  .toArray();

const statsActiveTeachers = db.teachers
  .aggregate([
    { $match: { active: true } },
    {
      $group: {
        _id: null,
        age: { $avg: "$age" },
        yearsOfExperience: { $avg: "$yearsOfExperience" },
        salary: { $avg: "$salary" },
      },
    },
  ])
  .toArray()[0];

const statsByDepartment = db.teachers
  .aggregate([
    {
      $group: {
        _id: "$department",
        totalTeachers: { $sum: 1 },
        totalExperience: { $sum: "$yearsOfExperience" },
        avgSalary: { $avg: "$salary" },
        teacherNames: { $push: "$name" },
      },
    },
    { $sort: { _id: 1 } },
  ])
  .toArray();

function enrollStudent(courseCode, studentId) {
  db.courses.updateOne(
    { code: courseCode },
    {
      $push: {
        enrolled: {
          studentId: studentId,
          enrollmentDate: new Date(),
          status: "activo",
        },
      },
    }
  );
}

function enrollRandomStudentsUsingEnroll(courseCode, numberOfStudents) {
  for (let i = 0; i < numberOfStudents; i++) {
    const randomStudentId = new ObjectId();
    enrollStudent(courseCode, randomStudentId);
  }
}

enrollRandomStudentsUsingEnroll("MAT101", 5);
enrollRandomStudentsUsingEnroll("ECO102", 3);

const coursesWithAvailableSeats = db.courses
  .aggregate([
    {
      $addFields: {
        enrolledCount: { $size: "$enrolled" },
        seatsLeft: { $subtract: ["$maxCapacity", { $size: "$enrolled" }] },
      },
    },
    {
      $match: {
        seatsLeft: { $gt: 0 },
      },
    },
    {
      $project: {
        code: 1,
        name: 1,
        maxCapacity: 1,
        enrolledCount: 1,
        seatsLeft: 1,
      },
    },
  ])
  .toArray();

print("Profesores con más de 15 años de experiencia:");
printjson(experiencedTeachers);
print("----------------------------");

print("Estadísticas de los profesores activos:");
printjson(statsActiveTeachers);
print("----------------------------");

print("Estadísticas por departamento:");

statsByDepartment.forEach((dept, index) => {
  print(`Departamento: ${dept._id}`);
  print(`Número de profesores: ${dept.totalTeachers}`);
  print(`Experiencia total: ${dept.totalExperience}`);
  print(`Salario promedio: ${dept.avgSalary.toFixed(2)}`);
  print(`Listado de nombres: ${dept.teacherNames.join(", ")}`);
  if (statsByDepartment.length > index + 1)
    print("****************************");
});
print("----------------------------");

print("Cursos con cupos disponibles:");
printjson(coursesWithAvailableSeats);
print("----------------------------");

// no es comodo que mongodb no permita asociaciones,
// pero entiendo que no esta pensado para ser usado asi.
db.dropDatabase();
