-- drop DATABASE create TABLE column names, input type etc

-- drop
-- create
-- use

-- create tables
-- >>>> department, role, employee
-- department THEN role THEN employee

-- foreign key to relate info from one table to another

-- create table
-- give it the type
-- department is big daddy
-- role id = integer not NULL
-- foregin key = department id
-- role is big mamma
-- employee id = integer not NULL 
-- foreign key = role id

DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (30) NOT NULL,
    PRIMARY KEY(id),
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    PRIMARY KEY(id),
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    PRIMARY KEY(id),
);

