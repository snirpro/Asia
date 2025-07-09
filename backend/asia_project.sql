create schema Asia_project;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  review TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  id_number VARCHAR(255) NOT NULL,
  number_of_guests INT NOT NULL CHECK (number_of_guests BETWEEN 2 AND 6),
  entry_date DATE NOT NULL ,
  exit_date DATE NOT NULL ,
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_type ENUM('cash', 'credit') NOT NULL,
  credit_card_number VARCHAR(255),
  card_validity DATE,
  cvv INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE photos (
  id INT AUTO_INCREMENT,
  Picture_classification VARCHAR(255),
  photo_url VARCHAR(255),
  PRIMARY KEY (id)
);
