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
                'Update a Department',
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

        case 'Update a Department':
            return updateDepartment();
        

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

    // changed value: departments.department_id - accessing wrong table info

    const departmentsArray = departmentsTableData.map((departments) => ({
        name: departments.department_name,
        value: departments.id,
    }));

    // console.log(departmentsArray);

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
        createRole();
    };
};

async function createEmployee() {

    const rolesTableData = await connection.query('SELECT * FROM roles');

    const rolesArray = rolesTableData.map((roles) => ({
        name: roles.title,
        value: roles.id,
    }));

    console.log(rolesArray);

    const managerId = await connection.query('SELECT * FROM employees where manager_status is true');

    const managersArray = managerId.map((managers) => ({
        name: `${managers.first_name} ${managers.last_name}`,
        value: managers.id,
    }));

    managersArray.unshift({
        name: "N/A",
        value: null,
    });

    const newEmployee = await inquirer.prompt([
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
            type: 'list',
            name: 'role_id',
            message: 'What is the employee role?',
            choices: rolesArray
        },
        {
            type: 'confirm',
            name: 'manager_status',
            message: 'Is this employee a manager?',
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the manager for this employee?',
            choices: managersArray
        }
    ]);

    try {
        connection.query(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_status) VALUES (?, ?, ?, ?, ?)',
            [
                newEmployee.first_name,
                newEmployee.last_name,
                newEmployee.role_id,
                newEmployee.manager_id,
                newEmployee.manager_status
            ]
        );
        console.log(`${newEmployee.first_name} ${newEmployee.last_name} created.\n`);
        accessDb();
    } catch (error) {
        console.error(error);
        createEmployee();
    };
};

async function updateDepartment() {
    const getDepartments = await connection.query('SELECT * FROM departments');

    const departmentChoices = getDepartments.map((departments) => ({
        name: departments.department_name
    }));

    const updateDepartmentInfo = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_selection',
            message: 'Which department would you like to update?',
            choices: departmentChoices
        },
        {
            type: 'input',
            name: 'updated_department',
            message: 'What is the name of the updated department?'
        }
    ]);

    try {
        connection.query(
            'UPDATE departments SET department_name = ? WHERE id = ?', [
            updateDepartmentInfo.updated_department,
            updateDepartmentInfo.department_selection,
        ]
        );
        console.log(`${updateDepartmentInfo.updated_department} updated.\n`);
        accessDb();
    } catch (error) {
        console.error(error);
        updateDepartment();
    };
};

// function updateRole() {

// };

// function updateEmployee() {

// };

accessDb();