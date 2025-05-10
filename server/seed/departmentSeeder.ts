import 'dotenv/config'; // 👈 Add this at the top

import connectDB from '../config/connectDb';
import { Department } from '../models/Departments';

const departments = [
    { value: "computer-science", label: "Computer Science" },
    { value: "mechanical-engineering", label: "Mechanical Engineering" },
    { value: "electrical-engineering", label: "Electrical Engineering" },
    { value: "civil-engineering", label: "Civil Engineering" },
    { value: "business-management", label: "Business Management" },
    { value: "economics", label: "Economics" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
];

const seedDepartments = async () => {
    try {
        await connectDB();
        await Department.deleteMany();
        await Department.insertMany(departments);
        console.log("Departments seeded successfully");

        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDepartments();