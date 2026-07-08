-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 10:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sokogardenonline`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_details`
--

CREATE TABLE `product_details` (
  `product_id` int(50) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_description` varchar(10000) NOT NULL,
  `product_cost` int(50) NOT NULL,
  `product_photo` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_details`
--

INSERT INTO `product_details` (`product_id`, `product_name`, `product_description`, `product_cost`, `product_photo`) VALUES
(1, 'Android smartphone1', 'This is a very good phone', 50000, '<FileStorage: \'smartphone1.jfif\' (\'application/octet-stream\')>'),
(2, 'Android smartphone1', 'This is a very good phone', 50000, '<FileStorage: \'smartphone1.jfif\' (\'application/octet-stream\')>'),
(3, 'Android smartphone1', 'This is a very good phone', 50000, '<FileStorage: \'smartphone1.jfif\' (\'application/octet-stream\')>'),
(4, 'Android smartphone1', 'This is a very good phone', 50000, '<FileStorage: \'smartphone1.jfif\' (\'application/octet-stream\')>'),
(5, 'lenovo', 'very Nice', 50000, '<FileStorage: \'lenovo.jfif\' (\'application/octet-stream\')>'),
(6, 'laptop2', 'very Nice', 17000, '<FileStorage: \'lenovo.jfif\' (\'application/octet-stream\')>'),
(7, 'laptop3', 'very Nice', 17000, '<FileStorage: \'laptop3.jfif\' (\'application/octet-stream\')>'),
(8, 'laptop4', 'very Nice', 17000, '<FileStorage: \'laptop3.jfif\' (\'application/octet-stream\')>'),
(9, 'laptop5', 'very Nice', 17000, '<FileStorage: \'laptop5.jfif\' (\'application/octet-stream\')>');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `phone`, `password`) VALUES
(1, 'Gregory', 'gregoryisaac473@gmail.com', '0708352076', '1234'),
(2, 'Gregory', 'gregoryisaac473@gmail.com', '0708352076', '1234'),
(3, 'Ryan', 'ryan47@gmail.com', '0755149353', '4734');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product_details`
--
ALTER TABLE `product_details`
  MODIFY `product_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
