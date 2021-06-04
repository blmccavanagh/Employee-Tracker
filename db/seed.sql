INSERT INTO departments(department_name) VALUES ("Administration"),("Education"),("Executive"),("Hospitality"),("HR"),("IT"),("Sales");

INSERT INTO roles(title, salary, department_id) VALUES ("Puppet Master", 60000, 3),("Professor", 90000, 2),("Assistant Buyer", 75000, 7),("Statistical Analysis and Data Reconfiguration", 100000, 6),("Head Chef", 140000, 4),("Chief Cologne Sprayer", 220000, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Joey", "Tribbiani", 6, NULL),("Monica", "Geller", 5, 1),("Chanandeler", "Bong", 4, 1),("Ross", "Geller", 2, 2),("Rachel", "Green", 3, 1),("Phoebe", "Buffay", 1, NULL);