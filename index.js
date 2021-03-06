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
                // 'Update a Role',
                'Update an Employee',
                'Delete a Department',
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

        // case 'Update a Role':
        //     return updateRole();

        case 'Update an Employee':
            return updateEmployee();

        case 'Delete a Department':
            return deleteDepartment();
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

    // console.log(rolesArray);

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

async function updateEmployee() {

    const rolesTableData = await connection.query('SELECT * FROM roles');

    const rolesArray = rolesTableData.map((roles) => ({
        name: roles.title,
        value: roles.id,
    }));

    const managerId = await connection.query('SELECT * FROM employees where manager_status is true');

    const managersArray = managerId.map((managers) => ({
        name: `${managers.first_name} ${managers.last_name}`,
        value: managers.id,
    }));

    managersArray.unshift({
        name: "N/A",
        value: null,
    });

    const getEmployee = await connection.query('SELECT * FROM employees');

    const employeeDetails = getEmployee.map((employees) => ({
        name: `${employees.first_name} ${employees.last_name}`,
        value: employees.id
        // first_name: employees.first_name,
        // last_name: employees.last_name,
        // role_id: employees.role_id,
        // manager_id: employees.manager_id,
        // manager_status: employees.manager_status
    }));

    const updatedEmployee = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employeeDetails
        },
        {
            type: 'confirm',
            name: 'update_first_name',
            message: 'Would you like to update their first name?',
            default: false
        },
        {
            type: 'input',
            name: 'first_name',
            message: 'Insert first name:',
            when: (answers) => answers.update_first_name === true,
        },
        {
            type: 'confirm',
            name: 'update_last_name',
            message: 'Would you like to update their last name?',
            default: false
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Insert last name:',
            when: (answers) => answers.update_last_name === true
        },
        {
            type: 'confirm',
            name: 'update_role_name',
            message: 'Would you like to update their role?',
            default: false
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the employee role?',
            choices: rolesArray,
            when: (answers) => answers.update_role_name === true,
        },
        {
            type: 'confirm',
            name: 'manager_status',
            message: 'Is this employee a manager?'
        },
        {
            type: 'confirm',
            name: 'update_manager',
            message: 'Would you like to update the manager for this employee?',
            default: false
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the manager for this employee?',
            choices: managersArray,
            when: (answers) => answers.update_manager === true,
        }]);

        // console.log(updatedEmployee);

        let updatedDetails = {};

        if (updatedEmployee.update_first_name) {
            updatedDetails.first_name = updatedEmployee.first_name;
        };

        if (updatedEmployee.update_last_name) {
            updatedDetails.last_name = updatedEmployee.last_name;
        };

        if (updatedEmployee.update_role_name) {
            updatedDetails.role_id = updatedEmployee.role_id;
        };

        if (updatedEmployee.update_manager_name) {
            updatedDetails.manager_id = updatedEmployee.manager_id;
        };
        
        try {
            connection.query(
                'UPDATE employees SET ? WHERE ?',
                [
                    updatedDetails,
                    {id: updatedEmployee.employee_id}
                ]
            );
            console.log(`Employee updated.\n`);
            accessDb();
        } catch (error) {
            console.error(error);
            updateEmployee();
        }

};

// Create DELETE department function not UPDATE
async function deleteDepartment() {
    const getDepartments = await connection.query('SELECT * FROM departments');

    const departmentChoices = getDepartments.map((departments) => ({
        name: departments.department_name,
        value: departments.id
    }));

    const deletedDepartment = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_selection',
            message: 'Which department would you like to delete?',
            choices: departmentChoices
        }
    ]);

    // console.log(deletedDepartment);

    const deletedDepartmentName = departmentChoices.filter((departments) => departments.value === deletedDepartment.department_selection);

    try {
        connection.query(
            'DELETE FROM departments WHERE id = (?)', [
            deletedDepartment.department_selection
        ]
        );
        console.log(`${deletedDepartmentName[0].name} deleted.\n`);
        accessDb();
    } catch (error) {
        console.error(error);
        deleteDepartment();

    }
};

accessDb();