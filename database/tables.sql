-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 07, 2024 at 04:01 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node-js`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `userid` int NOT NULL,
  `login` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `temp_password` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `truename` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `cpf` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `gender` int NOT NULL DEFAULT '0',
  `ip` varchar(50) CHARACTER SET utf8mb4 DEFAULT '0',
  `token` varchar(255) CHARACTER SET utf8mb4 DEFAULT '0',
  `adm` int DEFAULT '0',
  `diamond` varchar(255) CHARACTER SET utf8mb4 DEFAULT '0',
  `currency` varchar(250) CHARACTER SET utf8mb4 NOT NULL,
  `status` int DEFAULT '0',
  `creatime` varchar(255) CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `configs`
--

CREATE TABLE `configs` (
  `id` int NOT NULL,
  `server` varchar(255) NOT NULL,
  `site` varchar(255) NOT NULL,
  `theme` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `login` int NOT NULL,
  `register` int NOT NULL,
  `register_rewards` int NOT NULL,
  `recover` int NOT NULL,
  `confirm_email` int NOT NULL,
  `gold` int NOT NULL,
  `diamond` int NOT NULL,
  `mailer` longtext,
  `captcha` int NOT NULL,
  `site_key` varchar(255) NOT NULL,
  `secret_key` varchar(255) NOT NULL,
  `terms_rules` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `default_language` varchar(10) NOT NULL,
  `default_currency` varchar(50) NOT NULL,
  `gold_brl` varchar(255) NOT NULL,
  `gold_usd` varchar(255) NOT NULL,
  `gold_eur` varchar(255) NOT NULL,
  `diamond_brl` varchar(255) NOT NULL,
  `diamond_usd` varchar(255) NOT NULL,
  `diamond_eur` varchar(255) NOT NULL,
  `bonus` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `bonus_additional` longtext CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `configs`
--

INSERT INTO `configs` (`id`, `server`, `site`, `theme`, `login`, `register`, `register_rewards`, `recover`, `confirm_email`, `gold`, `diamond`, `mailer`, `captcha`, `site_key`, `secret_key`, `terms_rules`, `default_language`, `default_currency`, `gold_brl`, `gold_usd`, `gold_eur`, `diamond_brl`, `diamond_usd`, `diamond_eur`, `bonus`, `bonus_additional`) VALUES
(1, 'Perfect World Raiz', 'https://revoltz.dev/', 'light', 1, 1, 1, 1, 1, 500, 100, '{\"server\": \"gmail\", \"from\": \"mat.mcd@hotmail.com\", \"user\": \"revoltz@gmail.com\", \"password\": \"wqfvpmjcahlqfzii\"}', 0, '0x4AAAAAAAdTkJgPlvYKPUQh', '0x4AAAAAAAdTkBbFvbXBVv5KdDhps1bCwjw', 'https://revoltz.dev/', 'pt_BR', 'BRL', '100', '500', '600', '1', '2', '2.5', '25', '10: 5, 20: 10, 50: 25, 100: 50');

-- --------------------------------------------------------

--
-- Table structure for table `recover`
--

CREATE TABLE `recover` (
  `id` int NOT NULL,
  `login` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `expiration` varchar(255) NOT NULL,
  `creatime` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `register_rewards`
--

CREATE TABLE `register_rewards` (
  `id` int NOT NULL,
  `data` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `register_rewards`
--

INSERT INTO `register_rewards` (`id`, `data`) VALUES
(1, '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int NOT NULL,
  `login` varchar(250) NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 NOT NULL,
  `rewards` longtext CHARACTER SET utf8mb4 NOT NULL,
  `status` int NOT NULL,
  `redemption` longtext,
  `creatime` varchar(50) CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `login`, `type`, `message`, `rewards`, `status`, `redemption`, `creatime`) VALUES
(1, 'revoltz', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-02 20:56:53'),
(2, 'revoltz', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-02 20:58:33'),
(3, 'revoltz', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-02 21:00:10'),
(4, 'revoltzd', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-02 23:08:13'),
(5, 'testeas', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-02 23:24:14'),
(6, 'revoltzx', 'register', 'Rebeceu (4}) recompensas por criar essa conta', '[{\"type\":\"item\",\"name\":\"Alto-Falante\",\"desc\":\"Pode espalhar sua voz para todos os cantos do mundo. Se a colocar em seu inventário, você pode falar no canal de Global.\",\"count\":\"1\",\"icon\":\"12979.png\",\"id\":\"12979\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"item\",\"name\":\"Pedra de Teleporte\",\"desc\":\"Teletransporta você a um ponto de rota previamente ativado. Clique com o botão direito para usar. Não pode ser usado em combate.\",\"count\":\"1\",\"icon\":\"14351.png\",\"id\":\"14351\",\"max_count\":\"1\",\"proctype\":\"0\",\"expire_date\":\"0\",\"guid1\":\"0\",\"guid2\":\"0\",\"mask\":\"0\",\"data\":\"123\"},{\"type\":\"gold\",\"name\":\"500 Gold\",\"desc\":\"Vale 1500 Gold\",\"count\":\"1500\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"},{\"type\":\"diamond\",\"name\":\"25 Diamantes\",\"desc\":\"Vale 25 Diamantes\",\"count\":\"25\",\"icon\":\"\",\"id\":\"\",\"max_count\":\"\",\"proctype\":\"\",\"expire_date\":\"\",\"guid1\":\"\",\"guid2\":\"\",\"mask\":\"\",\"data\":\"\"}]', 0, '0', '2024-07-03 00:36:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `configs`
--
ALTER TABLE `configs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recover`
--
ALTER TABLE `recover`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `register_rewards`
--
ALTER TABLE `register_rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `configs`
--
ALTER TABLE `configs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recover`
--
ALTER TABLE `recover`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `register_rewards`
--
ALTER TABLE `register_rewards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
