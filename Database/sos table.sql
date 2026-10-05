-- CREATE DATABASE disaster_sos;
-- USE disaster_sos;

CREATE TABLE sos_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sos_id VARCHAR(30) UNIQUE NOT NULL,
    disaster_type VARCHAR(50) NOT NULL,
    description TEXT,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    accuracy DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Reported'
);

CREATE TABLE authorities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    authority_type VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    address VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);