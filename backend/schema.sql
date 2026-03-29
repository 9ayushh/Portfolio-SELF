-- Run this script in your MySQL interface (e.g. MySQL Workbench or phpMyAdmin)

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- 2. Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Make sure the JDBC credentials in ContactServlet.java 
-- match your MySQL local setup!
