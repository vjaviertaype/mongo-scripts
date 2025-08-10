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

db.teachers.insertMany([
  {
    name: "Juana",
    age: 40,
    specialty: "Mathematics",
    department: "Sciences",
    yearsOfExperience: 15,
    email: "JeaneDArc@gmail.com",
    salary: 3200.0,
    active: true,
  },
  {
    name: "Pedro",
    age: 35,
    specialty: "History",
    yearsOfExperience: 10,
    salary: 3400.0,
    department: "Humanities",
    active: false,
  },
  {
    name: "Profesor Pancake de los Siete Sabores",
    age: 50,
    specialty: "Culinary Arts",
    yearsOfExperience: 25,
    salary: 4300.0,
    active: false,
    department: "Gastronomy",
  },
]);

const juana = db.teachers.findOne({ name: "Juana" });

db.courses.insertMany([
  {
    code: "MAT101",
    name: "Matematicas Basicas",
    credits: 4,
    teacherId: juana._id,
    schedule: {
      days: ["L", "M", "X"],
      timeSlots: [
        { start: "08:00", end: "10:00" },
        { start: "11:00", end: "13:00" },
      ],
    },
    maxCapacity: 30,
    enrolled: [],
  },
  {
    code: "HIS201",
    name: "Historia Universal",
    credits: 3,
    teacherId: juana._id,
    schedule: {
      days: ["J", "V"],
      timeSlots: [{ start: "09:00", end: "11:00" }],
    },
    maxCapacity: 25,
    enrolled: [],
  },
]);

const experiencedTeachers = db.teachers
  .find({ yearsOfExperience: { $gt: 15 } })
  .toArray();

const average = db.teachers
  .aggregate([
    { $match: { active: true } },
    {
      $group: {
        _id: null,
        avgAge: { $avg: "$age" },
      },
    },
  ])
  .toArray()[0].avgAge;

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
          status: "active",
        },
      },
    }
  );
}

enrollStudent("MAT101", new ObjectId());

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

print("Edad promedio de profesores activos: " + average + " años");
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
