require('dotenv').config();
const connection = require('./config/connection');
const inquirer = require('inquirer');

// can install npm i console.table at a later date
// require('console.table');

async function accessDb() {
    const responseData = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            // all options will be listed in choices
            choices: [
                'View Departments',
                'View Roles',
                'View Employees',
                'Create a Department',
                'Create a Role',
                'Create an Employee',
                // 'Update a Department',
                // 'Update a Role',
                // 'Update an Employee',
                'Quit'
            ]
        }
    ]);

    switch (responseData.action) {
        // case for each answer and the function run based on that answer
        // case is the answer given by the user
        case 'View Departments':
            return viewDepartment();

        case 'View Roles':
            return viewRole();

        case 'View Employees':
           return viewEmployee();

        case 'Create a Department':
            return createDepartment();

        case 'Create a Role':
            return createRole();

        case 'Create an Employee':
            return createEmployee();

        // case 'Update a Department':
        //     return updateDepartment();
        // 

        // case 'Update a Role':
        //     return updateRole();
        // 

        // case 'Update an Employee':
        //     return updateEmployee();
        // 

        case 'Quit':
            connection.end();
    }
};

function viewDepartment() {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        // take them back to the beginning after they've received the data they asked for
        accessDb();
    });
};

function viewRole() {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        // take them back to the beginning after they've received the data they asked for
        accessDb();
    });
};

function viewEmployee() {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log(`\n`);
        // take them back to the beginning after they've received the data they asked for
        accessDb();
    });
};

async function createDepartment() {
    const newDepartment = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department you are creating?'
        }
    ]);

    try {
        connection.query(
            'INSERT INTO departments (department_name) VALUES (?)',
            [
                newDepartment.department_name
            ],
        );
        console.log(`${newDepartment.department_name} department created.\n`);
        accessDb();
    } catch (error) {
        console.error(error);
        createDepartment();
    }
};

async function createRole() {
    const departmentsTableData = await connection.query('SELECT * FROM departments');

    // console.log(departmentsTableData);

    const departmentsArray = departmentsTableData.map((departments) => ({
        name: departments.department_name,
        value: departments.department_id,
    }));

    const newRole = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role you are creating?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'How much is the salary for this role?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What department does this role come under?',
            choices: departmentsArray
        }
    ]);

    try {
    connection.query(
        'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
        [
            newRole.title,
            newRole.salary,
            newRole.department_id
        ],
    );
    console.log(`${newRole.title} role created.\n`);
    accessDb();
    } catch (error) {
    console.error(error);
    // createRole();
    };
};

function createEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter last name:'
        },
        {
            input: 'number',
            name: 'role_id',
            message: 'What is the role ID for this role?'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'What is the manager ID for this employee?'
        }
    ]).then((data) => {
        connection.query(
            'INSERT INTO employees (first_name, last_name, role_id, SET ?',
            {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: data.role_id,
                manager_id: data.manager_id
            }
        );
    });
};

// function updateDepartment() {

// };

// function updateRole() {

// };

// function updateEmployee() {

// };

accessDb();