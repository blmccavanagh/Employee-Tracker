INSERT INTO departments(department_name) VALUES ("Administrator"),("Accounting"),("Sales"),("IT"),("Executive");

INSERT INTO roles(title, salary, department_id) VALUES ("Admin Assistant", 60000, 1),("Accountant", 90000, 2),("Customer Service Officer", 75000, 3),("Statistical Analysis and Data Reconfiguration", 100000, 4),("Solution Architect", 140000, 4),("CEO", 220000, 5);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Joey", "Tribbiani", 6, NULL),("Monica", "Gellar", 5, 1),("Chanandeler", "Bong", 4, 1),("Phoebe", "Buffay", 3, NULL),("Rachel", "Green", 2, 2),("Ross", "Gellar", 1, 4);