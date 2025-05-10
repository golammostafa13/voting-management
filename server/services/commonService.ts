import { Department, IDepartment } from "../models/Departments";

export const getDepartments = async (): Promise<IDepartment[]> => {
    try {
        const departments = await Department.find();
        console.log(departments)
        return departments;
    } catch (error) {
        throw new Error("Error fetching departments");
    }
};
