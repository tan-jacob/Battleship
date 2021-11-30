-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 30, 2021 at 02:33 AM
-- Server version: 5.7.31
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isaproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `apikey`
--

DROP TABLE IF EXISTS `apikey`;
CREATE TABLE IF NOT EXISTS `apikey` (
  `apikeyid` int(11) NOT NULL AUTO_INCREMENT,
  `apikey` varchar(200) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`apikeyid`),
  KEY `fk_has_user` (`userid`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf16;

--
-- Dumping data for table `apikey`
--

INSERT INTO `apikey` (`apikeyid`, `apikey`, `userid`, `stat`, `description`) VALUES
(1, 'catorcatappapikey', 1, 0, 'My First App)'),
(2, 'myadminkey', 4, 0, 'new admin key');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `commentID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `pictureID` int(11) DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`commentID`),
  KEY `userID` (`userID`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`commentID`, `userID`, `pictureID`, `comment`) VALUES
(1, 1, 5, 'hahaha'),
(2, 1, 5, 'hello'),
(3, 1, 5, ''),
(4, 1, 5, ''),
(5, 1, 5, 'hello2'),
(6, 1, 5, ''),
(7, 1, 10, 'Hooray number 1'),
(8, 1, 10, 'Hooray number 1'),
(9, 1, 5, 'test'),
(10, 1, 10, 'hello2'),
(11, 1, 11, 'donut cat'),
(12, 1, 10, 'way to go!'),
(14, 3, 10, 'hello you are handosme cat'),
(15, 3, 9, 'big cat'),
(18, 6, 10, '11551');

-- --------------------------------------------------------

--
-- Table structure for table `picture`
--

DROP TABLE IF EXISTS `picture`;
CREATE TABLE IF NOT EXISTS `picture` (
  `pictureID` int(11) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pictureID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `picture`
--

INSERT INTO `picture` (`pictureID`, `url`) VALUES
(1, 'https://cdn2.thecatapi.com/images/Tbc8_VStM.jpg'),
(2, 'https://thatcopy.github.io/catAPI/imgs/jpg/9812dfc.jpg'),
(38, 'https://thatcopy.github.io/catAPI/imgs/webp/9812dfc.webp'),
(14, 'https://thatcopy.github.io/catAPI/imgs/webp/41442c0.webp'),
(11, 'https://thatcopy.github.io/catAPI/imgs/webp/2d84bf8.webp'),
(41, 'https://thatcopy.github.io/catAPI/imgs/webp/a408e80.webp'),
(25, 'https://thatcopy.github.io/catAPI/imgs/webp/6e6b0ec.webp'),
(53, 'https://thatcopy.github.io/catAPI/imgs/webp/ef8c75a.webp'),
(26, 'https://thatcopy.github.io/catAPI/imgs/webp/71d87f4.webp'),
(42, 'https://thatcopy.github.io/catAPI/imgs/webp/a540eaa.webp'),
(45, 'https://thatcopy.github.io/catAPI/imgs/webp/b065166.webp'),
(7, 'https://thatcopy.github.io/catAPI/imgs/webp/2869233.webp'),
(58, 'https://thatcopy.github.io/catAPI/imgs/webp/f64da8b.webp'),
(32, 'https://thatcopy.github.io/catAPI/imgs/webp/8dd0478.webp'),
(36, 'https://thatcopy.github.io/catAPI/imgs/webp/96aff96.webp'),
(21, 'https://thatcopy.github.io/catAPI/imgs/webp/60343c6.webp'),
(23, 'https://thatcopy.github.io/catAPI/imgs/webp/695c074.webp'),
(51, 'https://thatcopy.github.io/catAPI/imgs/webp/e3c40e6.webp'),
(6, 'https://thatcopy.github.io/catAPI/imgs/webp/2039314.webp'),
(17, 'https://thatcopy.github.io/catAPI/imgs/webp/4ca6ff3.webp'),
(54, 'https://thatcopy.github.io/catAPI/imgs/webp/fa7117a.webp'),
(10, 'https://thatcopy.github.io/catAPI/imgs/webp/2d7c152.webp'),
(49, 'https://thatcopy.github.io/catAPI/imgs/webp/c67fbd1.webp'),
(22, 'https://thatcopy.github.io/catAPI/imgs/webp/6554b20.webp'),
(57, 'https://thatcopy.github.io/catAPI/imgs/webp/d69158d.webp'),
(47, 'https://thatcopy.github.io/catAPI/imgs/webp/b4971c1.webp'),
(43, 'https://thatcopy.github.io/catAPI/imgs/webp/aa4e7f9.webp'),
(27, 'https://thatcopy.github.io/catAPI/imgs/webp/72db2f6.webp'),
(24, 'https://thatcopy.github.io/catAPI/imgs/webp/6c7c5e1.webp'),
(44, 'https://thatcopy.github.io/catAPI/imgs/webp/aea9421.webp'),
(33, 'https://thatcopy.github.io/catAPI/imgs/webp/9098db4.webp'),
(5, 'https://thatcopy.github.io/catAPI/imgs/webp/1313846.webp'),
(28, 'https://thatcopy.github.io/catAPI/imgs/webp/7f62f17.webp'),
(12, 'https://thatcopy.github.io/catAPI/imgs/webp/32b998f.webp'),
(56, 'https://thatcopy.github.io/catAPI/imgs/webp/5e953c2.webp'),
(16, 'https://thatcopy.github.io/catAPI/imgs/webp/467710b.webp'),
(46, 'https://thatcopy.github.io/catAPI/imgs/webp/b198aa3.webp'),
(3, 'https://thatcopy.github.io/catAPI/imgs/webp/10ca6cb.webp'),
(9, 'https://thatcopy.github.io/catAPI/imgs/webp/2b74f7c.webp'),
(8, 'https://thatcopy.github.io/catAPI/imgs/webp/2ac57b8.webp'),
(31, 'https://thatcopy.github.io/catAPI/imgs/webp/8636ed3.webp'),
(37, 'https://thatcopy.github.io/catAPI/imgs/webp/9757789.webp'),
(18, 'https://thatcopy.github.io/catAPI/imgs/webp/54adb30.webp'),
(40, 'https://thatcopy.github.io/catAPI/imgs/webp/a0dc431.webp'),
(29, 'https://thatcopy.github.io/catAPI/imgs/webp/84f477e.webp'),
(34, 'https://thatcopy.github.io/catAPI/imgs/webp/91de70b.webp'),
(55, 'https://thatcopy.github.io/catAPI/imgs/webp/fb607a3.webp'),
(30, 'https://thatcopy.github.io/catAPI/imgs/webp/8506672.webp'),
(52, 'https://thatcopy.github.io/catAPI/imgs/webp/e751db9.webp'),
(50, 'https://thatcopy.github.io/catAPI/imgs/webp/cf6f500.webp'),
(35, 'https://thatcopy.github.io/catAPI/imgs/webp/9541262.webp'),
(19, 'https://thatcopy.github.io/catAPI/imgs/webp/568c863.webp'),
(20, 'https://thatcopy.github.io/catAPI/imgs/webp/5fc67d7.webp'),
(48, 'https://thatcopy.github.io/catAPI/imgs/webp/b8df2d1.webp'),
(15, 'https://thatcopy.github.io/catAPI/imgs/webp/457ad37.webp'),
(13, 'https://thatcopy.github.io/catAPI/imgs/webp/34513fd.webp'),
(4, 'https://thatcopy.github.io/catAPI/imgs/webp/1206c62.webp'),
(39, 'https://thatcopy.github.io/catAPI/imgs/webp/9f12113.webp');

-- --------------------------------------------------------

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
CREATE TABLE IF NOT EXISTS `resource` (
  `resourceid` int(11) NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) NOT NULL,
  `stat` int(11) NOT NULL DEFAULT '0',
  `method` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`resourceid`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resource`
--

INSERT INTO `resource` (`resourceid`, `uri`, `stat`, `method`) VALUES
(2, '/login', 4, 'POST'),
(1, '/register', 17, 'POST'),
(4, '/api/v1/cat/', 65, 'GET'),
(5, '/api/v1/cat/pictureid', 27, 'GET'),
(3, '/api/v1/user', 0, 'GET'),
(7, '/api/v1/leaderboard/top', 29, 'GET'),
(9, '/api/v1/cat/comments/user/userid', 40, 'GET'),
(10, '/api/v1/cat/comments/pictureid', 3, 'POST'),
(11, '/api/v1/cat/comments/delete/commentid', 6, 'DELETE'),
(12, '/api/v1/cat/vote/pictureid', 7, 'PUT'),
(13, '/adminlogin', 39, 'POST');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `username`, `password`) VALUES
(1, 'Francis', 'fran123', 'password'),
(2, 'fran', 'fran', '$2b$10$E.S9bXArxXC52NpRVYY5Du30Iz2A1oLy2krc88gx1qAvrb8JbkQ7a'),
(3, 'fram', 'fram', '$2b$10$LYpY9Xol7mkCWBRxqgQTEu3pqrryfSfYAwWvzc6jvPdtuNP6cevbi'),
(4, 'admin', 'admin', '$2b$10$o4n.Yw9LL.GZP/xEu3MhKO1Et2E.IKBo7jlfoKMCmc0vYC4YHDcLK'),
(5, 'fram', 'fram123', '$2b$10$QozFu8t3LnMOTSWUPSU7v.C1QRmXsKN96gmZxdM8LTTKeMngbKvMq'),
(6, 'fram', 'framfram', '$2b$10$7fC.OkMwB3Kc1X73b8me/uJemT5FLUERVShrLBqqP5tporaC0OLK6'),
(7, 'fram', 'framframfram', '$2b$10$UUV7G/GTOja8VLSMy28IeOY7XDx.GjJUSbs7OOs5IZwtaUxijg0xm');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
CREATE TABLE IF NOT EXISTS `votes` (
  `pictureID` int(11) NOT NULL,
  `votes` int(11) DEFAULT NULL,
  PRIMARY KEY (`pictureID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`pictureID`, `votes`) VALUES
(1, 15),
(2, 4),
(3, 5),
(4, 2),
(5, 14),
(6, 11),
(7, 15),
(8, 8),
(9, 18),
(10, 21),
(11, 6),
(12, 8),
(13, 1),
(14, 3),
(15, 17),
(20, 3),
(54, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
