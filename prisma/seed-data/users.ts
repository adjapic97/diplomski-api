import { UserType } from "@prisma/client";

export const users = [
    {
        email: 'djapic97@outlook.com',
        password: '12345',
        userType: UserType.ADMIN,
        firstName: 'Andrej',
        lastName: 'Djapic',
        username: 'djapic97',
        phoneNumber: '+381611180389',
        dateOfBirth: '1997-12-30T00:00:00-00:00',
    },
    {
        email: 'dummy_employee@yopmail.com',
        password: '12345',
        userType: UserType.EMPlOYEE,
        firstName: 'Dummy',
        lastName: 'Employee',
        username: 'employee',
        phoneNumber: '+381609553141',
        dateOfBirth: '1989-12-30T00:00:00-00:00',
    },
    {
        email: 'dummy_employer@yopmail.com',
        password: '12345',
        userType: UserType.EMPLOYER,
        firstName: 'Dummy',
        lastName: 'Employer',
        username: 'employer',
        phoneNumber: '+381616430792',
        dateOfBirth: '1990-12-30T00:00:00-00:00',
    },
    
]