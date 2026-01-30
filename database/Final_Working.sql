CREATE DATABASE  IF NOT EXISTS `p24_bharat_teeka_portal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `p24_bharat_teeka_portal`;
-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: p24_bharat_teeka_portal
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `slot_id` int NOT NULL,
  `dose_number` int NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `remarks` tinytext,
  PRIMARY KEY (`appointment_id`),
  KEY `patient_id` (`patient_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`slot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,1,1,1,1,'2024-01-18','10:30:00','COMPLETED','Vaccination completed successfully'),(2,1,1,2,2,'2024-02-15','15:30:00','CANCELLED','Patient not available'),(3,2,2,4,1,'2024-01-19','11:00:00','COMPLETED','No side effects observed'),(4,5,2,3,1,'2024-01-21','10:00:00','COMPLETED','Patient visited today'),(5,6,2,4,1,'2024-01-22','11:30:00','BOOKED','Vaccination done'),(76,1,1,1,1,'2026-01-29','10:15:00','COMPLETED','done with proper vaccinec gause'),(77,2,1,1,1,'2026-01-29','10:45:00','COMPLETED','done'),(78,3,1,1,1,'2026-01-28','11:00:00','BOOKED','VAine given on left arm DOne sucess'),(79,4,1,1,2,'2026-01-29','11:15:00','COMPLETED','done'),(80,5,1,1,1,'2026-01-29','11:30:00','BOOKED','Confirmed'),(81,6,2,3,1,'2026-01-29','10:00:00','BOOKED','Dose COmpleted'),(82,7,2,4,1,'2026-01-29','10:30:00','BOOKED','done'),(83,8,2,9,1,'2026-01-29','09:15:00','BOOKED','dose have beenn givin on right arm'),(84,9,2,3,1,'2026-01-29','11:45:00','BOOKED','vacine serach'),(85,10,2,4,2,'2026-01-29','11:50:00','BOOKED','done'),(86,11,4,10,1,'2026-01-27','09:30:00','BOOKED','Done'),(87,12,4,10,1,'2026-01-28','10:30:00','BOOKED','absent'),(88,13,4,11,1,'2026-01-27','14:15:00','BOOKED','done ok'),(89,14,4,11,1,'2026-01-29','14:30:00','BOOKED','com'),(90,15,4,10,2,'2026-01-29','11:00:00','v','Done ok'),(106,1,1,1,1,'2026-01-29','20:00:00','COMPLETED','DOne'),(107,2,1,1,1,'2026-01-29','20:15:00','COMPLETED','doone'),(108,3,1,1,1,'2026-01-29','20:30:00','COMPLETED','done'),(109,4,1,1,2,'2026-01-28','20:45:00','BOOKED','Ok done'),(110,5,1,1,1,'2026-01-29','21:00:00','BOOKED','Given on Right Arm'),(111,6,2,3,1,'2026-01-28','20:00:00','BOOKED','Done with o=no'),(112,7,2,4,1,'2026-01-29','20:15:00','BOOKED','Confirmed'),(113,8,2,9,1,'2026-01-28','20:30:00','BOOKED','Confirmed'),(114,9,2,3,1,'2026-01-28','20:45:00','BOOKED','Late night'),(115,10,2,4,2,'2026-01-29','21:00:00','BOOKED','Follow-up confirmed'),(116,11,4,10,1,'2026-01-29','20:00:00','BOOKED','Confirmed'),(117,12,4,10,1,'2026-01-29','20:15:00','BOOKED','Absent'),(118,13,4,11,1,'2026-01-29','20:30:00','BOOKED','Confirmed'),(119,14,4,11,1,'2026-01-29','20:45:00','BOOKED','Not availabale'),(120,15,4,10,2,'2026-01-29','21:00:00','BOOKED','dome'),(121,17,1,30,2,'2026-01-29','10:00:00','COMPLETED','ok'),(122,18,3,25,3,'2026-01-28','09:00:00','BOOKED',NULL),(123,17,1,36,1,'2026-01-30','09:00:00','Cancelled','Cancelled by patient-service'),(124,19,1,34,1,'2026-01-30','13:00:00','CANCELLED','Cancelled by patient-service'),(125,19,1,30,3,'2026-01-29','10:00:00','COMPLETED','Bhai chal gaya'),(126,19,1,28,3,'2026-01-29','04:04:00','Cancelled','Cancelled by patient-service'),(127,17,1,35,1,'2026-01-30','09:00:00','CANCELLED','Cancelled by patient-service'),(128,20,1,35,1,'2026-01-30','09:00:00','CANCELLED','Cancelled by patient-service'),(129,20,1,29,1,'2026-01-30','09:00:00','COMPLETED','okkkk'),(130,17,1,39,2,'2026-01-30','20:00:00','BOOKED',NULL),(131,21,1,29,1,'2026-01-30','09:00:00','CANCELLED','Cancelled by patient-service'),(132,22,1,39,2,'2026-01-30','20:00:00','COMPLETED','sdfwesd'),(133,23,4,23,2,'2026-01-30','09:11:00','COMPLETED','righ arm innjected'),(134,24,4,19,1,'2026-01-30','11:30:00','COMPLETED','bkhb'),(135,23,4,19,2,'2026-01-30','11:30:00','CANCELLED','gigi'),(136,25,1,41,1,'2026-01-31','09:10:00','COMPLETED','ok done beta');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) NOT NULL,
  `state_id` int NOT NULL,
  PRIMARY KEY (`city_id`),
  KEY `state_id` (`state_id`),
  CONSTRAINT `city_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `state` (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Mumbai',1),(2,'Pune',1),(3,'Delhi',2),(4,'Bangalore',3),(5,'Chennai',4),(6,'Ahmedabad',5),(7,'Jaipur',6);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital`
--

DROP TABLE IF EXISTS `hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `hospital_name` varchar(255) DEFAULT NULL,
  `registration_no` varchar(50) NOT NULL,
  `hospital_type` enum('Government','Private') NOT NULL,
  `city_id` int NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hospital_id`),
  UNIQUE KEY `registration_no` (`registration_no`),
  KEY `user_id` (`user_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `hospital_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `hospital_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital`
--

LOCK TABLES `hospital` WRITE;
/*!40000 ALTER TABLE `hospital` DISABLE KEYS */;
INSERT INTO `hospital` VALUES (1,2,'All India Institute of Medical Sciences','HOS001','Government',3,NULL,NULL),(2,3,'Kokilaben Dhirubhai Ambani Hospital','HOS002','Private',1,NULL,NULL),(3,4,'Apollo Hospitals Chennai','HOS003','Private',5,NULL,NULL),(4,5,'Civil Hospital Ahmedabad','HOS004','Government',6,NULL,NULL);
/*!40000 ALTER TABLE `hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `vaccine_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `slot_id` int DEFAULT NULL,
  `appointment_id` int DEFAULT NULL,
  `status` enum('Unread','Read') DEFAULT 'Unread',
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `vaccine_id` (`vaccine_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `patient_id` (`patient_id`),
  KEY `slot_id` (`slot_id`),
  KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccine` (`vaccine_id`),
  CONSTRAINT `notification_ibfk_3` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `notification_ibfk_4` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`),
  CONSTRAINT `notification_ibfk_5` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`slot_id`),
  CONSTRAINT `notification_ibfk_6` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,6,'Appointment Confirmed','Your appointment for Covishield vaccine is confirmed',1,1,1,1,1,'Read'),(2,6,'Reminder','Your second dose is due on 15th February 2024',1,1,1,2,2,'Unread'),(3,7,'Vaccination Completed','Your first dose of Covaxin has been administered successfully',2,2,2,4,3,'Read'),(4,10,'Child Vaccination Due','BCG vaccine is scheduled for Rohan Singh tomorrow',3,2,5,3,4,'Unread'),(5,10,'Child Vaccination Scheduled','MMR vaccine is scheduled for Ananya Singh',4,2,6,4,5,'Unread');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_child`
--

DROP TABLE IF EXISTS `parent_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_child` (
  `parent_child_id` int NOT NULL AUTO_INCREMENT,
  `parent_user_id` int NOT NULL,
  `child_patient_id` int NOT NULL,
  `relation_id` int NOT NULL,
  PRIMARY KEY (`parent_child_id`),
  KEY `parent_user_id` (`parent_user_id`),
  KEY `child_patient_id` (`child_patient_id`),
  KEY `relation_id` (`relation_id`),
  CONSTRAINT `parent_child_ibfk_1` FOREIGN KEY (`parent_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `parent_child_ibfk_2` FOREIGN KEY (`child_patient_id`) REFERENCES `patient` (`patient_id`),
  CONSTRAINT `parent_child_ibfk_3` FOREIGN KEY (`relation_id`) REFERENCES `relationship` (`relation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_child`
--

LOCK TABLES `parent_child` WRITE;
/*!40000 ALTER TABLE `parent_child` DISABLE KEYS */;
INSERT INTO `parent_child` VALUES (1,10,5,1),(2,10,6,1),(3,11,7,2),(4,11,8,2),(7,29,20,1),(8,30,22,8),(9,31,24,9),(10,29,25,8);
/*!40000 ALTER TABLE `parent_child` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `aadhar_number` varchar(12) NOT NULL,
  `blood_group` varchar(5) NOT NULL,
  `is_adult` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `remarks` tinytext,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `aadhar_number` (`aadhar_number`),
  UNIQUE KEY `uk_patient_aadhar` (`aadhar_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,6,'Raj','Patel','1990-05-15','Male','123456789012','B+',1,1,'No allergies'),(2,7,'Priya','Sharma','1985-08-22','Female','234567890123','O+',1,1,'Hypertension patient'),(3,8,'Arun','Kumar','1978-12-10','Male','345678901234','A+',1,1,'Diabetes patient'),(4,9,'Meera','Shah','1992-03-18','Female','456789012345','AB+',1,1,'Regular checkups'),(5,NULL,'Rohan','Singh','2018-03-10','Male','567890123456','B+',0,1,'Child vaccination'),(6,NULL,'Ananya','Singh','2020-06-25','Female','678901234567','O+',0,1,'Infant vaccination'),(7,NULL,'Karan','Verma','2019-08-15','Male','789012345678','A+',0,1,'Toddler vaccination'),(8,NULL,'Sneha','Verma','2021-11-30','Female','890123456789','B-',0,1,'Newborn vaccination'),(9,18,'sham','sunder','1994-05-24','Male','787845125689','A+',1,1,'aefea aef aef a'),(10,20,'amit','patil','1990-01-24','Male','359059164182','B+',1,1,'sbefhg e yefuyewfyew'),(11,21,'Sumit','Patil','2003-04-04','Male','335678979876','B+',1,1,'No Allergies'),(12,22,'Amit','Patil','2003-04-04','Male','390559164184','B+',1,1,'no allergies'),(13,23,'Tejas','Tarole','2019-01-01','Other','789567654324','AB-',0,1,'dust Allergies'),(14,24,'Virat','Kohli','2024-02-09','Female','343454656878','AB-',0,1,'no allaergues'),(15,26,'tttttt','tttttt','2026-01-27','Other','000000000000','A+',0,1,'no'),(17,29,'pass','fail','2007-08-10','Male','123456789067','A+',1,1,'nothingggg'),(18,NULL,'Amit','patil','2014-06-03','Female','359057817890','A-',0,0,'deadjshaojs'),(19,NULL,'ch1','chlnmae','2026-01-13','Male','545454545454','A+',0,0,'yfqyfdfqy dyeydgyew'),(20,NULL,'d1','d11','2026-01-06','Male','359057817777','A-',0,1,'asasasa'),(21,30,'manav','chauhan','2002-12-21','Male','522277828828','O+',1,1,'amit bewakoof'),(22,NULL,'Amit','patil','2026-01-02','Male','463576866763','B+',0,1,NULL),(23,31,'Yash','Sinhe','1989-10-25','Male','390559164563','O+',1,1,'knoon de do'),(24,NULL,'Amit','chauhan','2026-01-05','Female','545454545445','B-',0,1,'dedd'),(25,NULL,'Sumit','Patil','2026-01-29','Male','545454545567','B+',0,1,'asfwesc'),(26,32,'Jyotsna','Patil','1981-03-11','Female','632483244982','B+',1,1,'No allergy,More tension ,More Dokedukhi');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationship`
--

DROP TABLE IF EXISTS `relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relationship` (
  `relation_id` int NOT NULL AUTO_INCREMENT,
  `relationship_name` varchar(50) NOT NULL,
  PRIMARY KEY (`relation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationship`
--

LOCK TABLES `relationship` WRITE;
/*!40000 ALTER TABLE `relationship` DISABLE KEYS */;
INSERT INTO `relationship` VALUES (1,'Father'),(2,'Mother'),(3,'Guardian'),(4,'Grandfather'),(5,'Grandmother'),(6,'Uncle'),(7,'Aunt'),(8,'Son'),(9,'Daughter');
/*!40000 ALTER TABLE `relationship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (0,'Pending'),(1,'Admin'),(2,'Hospital'),(3,'Patient'),(4,'Parent');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slot`
--

DROP TABLE IF EXISTS `slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slot` (
  `slot_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL,
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `capacity` int NOT NULL,
  `booked_count` int DEFAULT '0',
  `vaccine_id` int NOT NULL,
  `is_booked` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`slot_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `vaccine_id` (`vaccine_id`),
  CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `slot_ibfk_2` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccine` (`vaccine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot`
--

LOCK TABLES `slot` WRITE;
/*!40000 ALTER TABLE `slot` DISABLE KEYS */;
INSERT INTO `slot` VALUES (1,1,'2026-01-26','10:00:00','12:00:00',80,10,1,0,1),(2,1,'2024-01-20','14:00:00','16:00:00',50,5,1,0,1),(3,2,'2026-01-26','10:00:00','12:00:00',80,3,1,0,1),(4,2,'2026-01-26','10:00:00','12:00:00',80,12,1,0,1),(6,4,'2024-01-26','09:00:00','11:00:00',45,9,1,0,0),(9,2,'2026-01-26','09:00:00','10:00:00',20,0,1,0,1),(10,4,'2026-01-27','20:00:00','21:00:00',20,0,1,0,1),(11,4,'2026-01-27','21:00:00','22:00:00',30,0,2,0,1),(12,4,'2026-01-28','20:00:00','21:00:00',30,0,5,0,0),(13,2,'2026-01-28','09:00:00','10:00:00',100,0,2,0,0),(14,2,'2026-01-28','11:00:00','12:00:00',20,0,2,0,0),(15,2,'2026-01-28','10:00:00','10:00:00',20,0,3,0,0),(16,2,'2026-01-29','07:18:00','09:20:00',6,0,2,0,0),(17,2,'2026-01-29','13:09:00','14:10:00',60,0,2,0,1),(18,2,'2026-01-31','13:20:00','13:20:00',20,0,5,0,1),(19,4,'2026-01-30','11:30:00','12:20:00',16,2,3,0,1),(20,4,'2026-01-28','19:56:00','22:59:00',100,0,5,0,1),(21,4,'2026-01-27','16:20:00','16:40:00',10,0,5,0,1),(22,2,'2026-01-28','12:00:00','13:00:00',20,0,6,0,1),(23,4,'2026-01-30','09:11:00','11:01:00',10,1,5,0,0),(24,4,'2026-01-31','01:01:00','11:01:00',10,0,3,0,1),(25,3,'2026-01-28','09:00:00','11:11:00',10,1,5,0,1),(26,1,'2026-01-30','10:00:00','11:00:00',10,0,3,0,1),(27,1,'2026-01-28','11:00:00','12:00:00',10,0,3,0,1),(28,1,'2026-01-29','04:04:00','06:09:00',45,0,3,0,0),(29,1,'2026-01-30','09:00:00','10:00:00',10,1,2,0,1),(30,1,'2026-01-29','10:00:00','12:00:00',100,2,2,0,0),(31,1,'2026-01-28','14:00:00','15:00:00',20,0,1,0,0),(32,1,'2026-01-30','02:00:00','03:00:00',10,0,6,0,0),(33,1,'2026-01-29','11:00:00','12:00:00',20,0,5,0,1),(34,1,'2026-01-30','13:00:00','15:00:00',10,0,6,0,1),(35,1,'2026-01-30','09:00:00','10:00:00',10,0,3,0,1),(36,1,'2026-01-30','09:00:00','10:00:00',20,0,5,0,1),(37,3,'2026-01-30','12:00:00','13:00:00',10,0,2,0,1),(38,3,'2026-01-30','09:00:00','10:00:00',20,0,4,0,1),(39,1,'2026-01-30','20:00:00','21:00:00',10,2,3,0,1),(40,4,'2026-01-30','23:00:00','23:30:00',100,0,2,0,1),(41,1,'2026-01-31','09:10:00','10:00:00',89,1,1,0,1);
/*!40000 ALTER TABLE `slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `state_id` int NOT NULL AUTO_INCREMENT,
  `state_name` varchar(50) NOT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (1,'Maharashtra'),(2,'Delhi'),(3,'Karnataka'),(4,'Tamil Nadu'),(5,'Gujarat'),(6,'Rajasthan');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'admin','$2a$10$1TTboMkb1V.bVttMIDLGxO7jTO.O/ZnBBNh.nPmfjZWU45aE7Ke12','admin@teeka.gov.in','9876543210','Government of India, New Delhi',1),(2,2,'aiims','$2a$10$tBq.ubEFFyZd/VCx0Jf04uS/kW6Yc/hNmOnMdcNNRsh2wQJ.5Up6q','aiims@aiims.edu','9876543211','Ansari Nagar, New Delhi',1),(3,2,'kims','hospital123','contact@kims.com','9876543212','Andheri West, Mumbai',1),(4,2,'apollo','hospital123','info@apollo.com','9876543213','Greams Road, Chennai',1),(5,2,'civil','hospital123','civil@hospital.com','9876543220','Civil Lines, Ahmedabad',1),(6,3,'raj','patient123','raj.patel@gmail.com','9876543214','101, Shivaji Nagar, Pune',1),(7,3,'priya','patient123','priya.sharma@yahoo.com','9876543215','45, Rajpath, Delhi',1),(8,3,'arun','patient123','arun.k@gmail.com','9876543216','78, MG Road, Bangalore',1),(9,3,'meera','patient123','meera.shah@gmail.com','9876543217','22, Ellis Bridge, Ahmedabad',1),(10,4,'parent1','parent123','parent1@gmail.com','9876543218','22, Model Town, Jaipur',1),(11,4,'parent2','parent123','parent2@yahoo.com','9876543221','33, Saket, Delhi',1),(16,3,'shubham','shubham123','shubham@gmail.com','8956895623','gsidf ggsdfgysdgfygsu gfysdyfsd f | Personal Info: Full Name: Shubham ch, DOB: 2000-01-24, Gender: Male, Aadhaar: 124578451245, Remarks: hello this is shub',1),(17,0,'ram','ram123','ram@gmail.com','7845122356','hfu sufsegfesu fuseu fusiegf isief ',0),(18,3,'sham','sham123','smham@gmail.com','8978455623','afjs fgysug fygsyf guysgfgesf',1),(19,0,'asasas','aaaaaa','aaa@gmail.com','8888888888','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0),(20,3,'amit','amit123','amit@gmail.com','7845124578','jagyfg yusg eyfsyef yuefyu',1),(21,3,'SumitP','sumit123','sumit@gmail.com','9637857375','Shree Swaminarayan Mandir Rd\nMaauli Nagar, Shri Ram Housing Society',1),(22,3,'ApXp','Amit@123','patilamit4181@gmail.com','7020558887','VIT Chennai Kelambakkam - Vandalur Road\nRoom no 1603',1),(23,4,'Tejas','1234567','tej@gmail.com','7857869998','Shri Shri Apartment Mauli nagar Jamner Road Bhusawal',1),(24,4,'virat','1234567','viart@gmail.com','9862635688','VIT Chennai Kelambakkam - Vandalur Road\nRoom no 1603',1),(25,0,'tttttttttt','tttttt','tttttt@gmail.com','9999999990','aaaaaayhguy yguytgy. tyutyut7uyg',0),(26,4,'ttttttttt','tttttt','ttttt@gmail.com','9899999990','assdeffghftgft jhhiuj',1),(27,0,'dfvdgnf','123456','patilamit181@gmail.com','7020558899','VIT Chennai Kelambakkam - Vandalur Road\nRoom no 1603',0),(29,4,'pass','$2a$10$LslLO1ZL.NyPwIzx.wYHOeuz15OUira6KVOMUeI4wAqK3VKkP1jc2','pass@gmail.com','9988776000','karvenager,puneeee',0),(30,4,'sher','123456','manav@123','9876543771','Shree Swaminarayan Mandir Rd',0),(31,4,'YashSinhe','yash@123','yashsinhe@gmail.com','8764563452','VIT Chennai Kelambakkam - Vandalur Road',1),(32,4,'Jyotp','$2a$10$HyEHG5AIGarKi6Qb82HKE.knmiLOQuiK6yoNMTVWYz2dk7.r3GHji','jyot@gmail.com','8459536549','Shri Shri Apartment Mauli nagar Jamner Road Bhusawal',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccination_record`
--

DROP TABLE IF EXISTS `vaccination_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccination_record` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `dose_number` int NOT NULL,
  `patient_id` int NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `vaccination_date` date NOT NULL,
  `appointment_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `slot_id` int NOT NULL,
  `vaccine_id` int NOT NULL,
  PRIMARY KEY (`record_id`),
  UNIQUE KEY `uk_vacc_record_appt` (`appointment_id`),
  KEY `FKqj2xsvd6beu7b4t6lyxfojbs4` (`hospital_id`),
  KEY `FK61jrml0l4lel8ljvycies4sjv` (`slot_id`),
  KEY `FKru2cuo4cdbhtgrkgnc1qwar0f` (`vaccine_id`),
  CONSTRAINT `FK61jrml0l4lel8ljvycies4sjv` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`slot_id`),
  CONSTRAINT `FKli9hb6d0df8bqr2i5q39v62pu` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`),
  CONSTRAINT `FKqj2xsvd6beu7b4t6lyxfojbs4` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `FKru2cuo4cdbhtgrkgnc1qwar0f` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccine` (`vaccine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccination_record`
--

LOCK TABLES `vaccination_record` WRITE;
/*!40000 ALTER TABLE `vaccination_record` DISABLE KEYS */;
INSERT INTO `vaccination_record` VALUES (31,'BT-BATCH-V1','2026-01-27 22:47:40.000000',1,1,'Administered','2026-01-27',1,1,1,1),(32,'BT-BATCH-V1','2026-01-27 22:47:40.000000',1,2,'Administered','2026-01-27',2,1,2,1),(33,'BT-BATCH-V1','2026-01-27 22:47:40.000000',1,3,'Administered','2026-01-27',76,1,3,1),(34,'BT-BATCH-V1','2026-01-27 22:47:40.000000',1,4,'Administered','2026-01-27',106,1,4,1),(35,'BT-BATCH-V2','2026-01-27 22:47:40.000000',1,5,'Administered','2026-01-28',3,1,9,1),(36,'BT-BATCH-V2','2026-01-27 22:47:40.000000',1,6,'Administered','2026-01-28',77,1,13,1),(37,'BT-BATCH-V2','2026-01-27 22:47:40.000000',1,7,'Administered','2026-01-28',107,1,14,1),(38,'BT-BATCH-V3','2026-01-27 22:47:40.000000',1,8,'Administered','2026-01-29',78,1,15,1),(39,'BT-BATCH-V3','2026-01-27 22:47:40.000000',1,9,'Administered','2026-01-29',108,1,16,1),(40,'BT-BATCH-V3','2026-01-27 22:47:40.000000',1,10,'Administered','2026-01-29',79,1,17,1),(41,'Batch-002','2026-01-28 13:00:01.289153',2,4,'Ok done','2026-01-28',109,1,1,1),(42,'Batch-007','2026-01-28 19:11:33.008175',2,5,'Given on Right Arm','2026-01-28',110,1,1,1),(43,'Batvh','2026-01-29 16:10:51.409747',1,17,'ok','2026-01-29',121,1,30,2),(44,'BATCH-4181','2026-01-29 16:29:42.942186',1,19,'Bhai chal gaya','2026-01-29',125,1,30,2),(45,'Batch-12','2026-01-30 13:03:02.475455',1,20,'okkkk','2026-01-30',129,1,29,2),(46,'batch-78','2026-01-30 17:14:25.599342',1,22,'sdfwesd','2026-01-30',132,1,39,3),(47,'batch 566','2026-01-30 17:32:51.692942',1,23,'righ arm innjected','2026-01-30',133,4,23,5),(48,'jbjhv','2026-01-30 17:33:08.281931',1,24,'bkhb','2026-01-30',134,4,19,3),(49,'Btach-009','2026-01-31 00:54:44.350477',1,25,'ok done beta','2026-01-31',136,1,41,1);
/*!40000 ALTER TABLE `vaccination_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccine`
--

DROP TABLE IF EXISTS `vaccine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccine` (
  `vaccine_id` int NOT NULL AUTO_INCREMENT,
  `vaccine_name` varchar(255) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `vaccine_type` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `side_effects` text NOT NULL,
  `min_age` int NOT NULL,
  `max_age` int NOT NULL,
  `dose_required` int NOT NULL,
  `dose_gap_days` int NOT NULL,
  `storage_temperature` int NOT NULL,
  `expiry_date` date NOT NULL,
  `manufacturing_date` date NOT NULL,
  `doses_required` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `dose_count` int DEFAULT NULL,
  PRIMARY KEY (`vaccine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccine`
--

LOCK TABLES `vaccine` WRITE;
/*!40000 ALTER TABLE `vaccine` DISABLE KEYS */;
INSERT INTO `vaccine` VALUES (1,'Covishield','Serum Institute of India','COVID-19','Adenovirus vector based vaccine for COVID-19','Mild fever, fatigue, headache',18,100,2,28,2,'2026-12-31','2023-01-15',0,NULL,NULL,NULL),(2,'Covaxin','Bharat Biotech','COVID-19','Inactivated virus vaccine for COVID-19','Pain at injection site, mild fever',18,100,2,28,2,'2026-11-30','2023-02-20',0,NULL,NULL,NULL),(3,'BCG','Serum Institute of India','Tuberculosis','Bacillus Calmette-Guérin vaccine for TB','Swelling at injection site, mild fever',0,1,1,0,5,'2026-01-30','2023-03-10',0,NULL,NULL,NULL),(4,'MMR','GlaxoSmithKline','Measles, Mumps, Rubella','Combination vaccine for measles, mumps and rubella','Mild rash, fever, swollen glands',12,15,2,90,2,'2024-10-15','2023-04-05',0,NULL,NULL,NULL),(5,'Hepatitis B','Bharat Biotech','Hepatitis','Recombinant vaccine for Hepatitis B','Soreness, fatigue, headache',0,100,3,30,2,'2026-02-20','2023-05-12',0,NULL,NULL,NULL),(6,'Polio','Panacea Biotec','Polio','Inactivated polio vaccine','Redness or swelling at injection site',0,5,4,60,2,'2024-08-15','2023-06-10',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `vaccine` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-31  1:01:35
