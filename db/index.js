const connection = require('../config/connection');
const inquirer = require('inquirer');
// can install npm i console.table at a later date
// require('console.table');

function accessDb() {
    inquirer.prompt([
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
                'Update a Role',
                'Update an Employee',
                'Quit'
            ]
        }
    ]).then((data) => {
        // switch statement is simpler syntax than if, if you are delivering something specific
        // function initiated based on answer

        // switch takes in the name from the prompt
        switch (data.action) {
            // case for each answer and the function run based on that answer
            // case is the answer given by the user
            case 'View Departments':
                viewDepartment();
                // break is your stop point, if x === x then do this one thing then stop
                break;

            case 'View Roles':
                viewRole();
                break;

            case 'View Employees':
                viewEmployee();
                break;

            case 'Create a Department':
                createDepartment();
                break;

            case 'Create a Role':
                createRole();
                break;

            case 'Create an Employee':
                createEmployee();
                break;

            case 'Update a Department':
                updateDepartment();
                break;

            case 'Update a Role':
                updateRole();
                break;

            case 'Update an Employee':
                updateEmployee();
                break;

            //  don't need to make a quit case, as the default already does this if quit is selected (because no other case was selected : works like 'else')
            default:
                connection.end();
                break;
        }
    })
};

function viewDepartment() {

};

function viewRole() {

};

function viewEmployee() {

};

function createDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you are creating?'
        }
    ]).then((data) => {
        connection.query(
            'INSERT INTO departments SET ?',
            {
                name: data.name
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${data.name} department created.\n`);
                // take the user back to the beginning after they've created a department
                accessDb();
            }
        );
    });
};

function createRole() {
    inquirer.prompt([
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
            type: 'number',
            name: 'department_id',
            message: 'What is the department ID for this role?'
        }
    ]).then((data) => {
        connection.query(
            'INSERT INTO roles SET ?',
            {
                title: data.title,
                salary: data.salary,
                department_id: data.department_id
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${data.title} role created.\n`);
                accessDb();
            }
        );
    });
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
            'INSERT INTO employees SET?',
            {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: data.role_id,
                manager_id: data.manager_id
            }
        );
    });
};

function updateDepartment() {

};

function updateRole() {

};

function updateEmployee() {

};

accessDb();