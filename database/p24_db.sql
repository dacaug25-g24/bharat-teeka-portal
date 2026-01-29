CREATE DATABASE  IF NOT EXISTS `p24_bharat_teeka_portal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `p24_bharat_teeka_portal`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: p24_bharat_teeka_portal
-- ------------------------------------------------------
-- Server version	8.0.42

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
  `booking_time` time NOT NULL,
  `status` enum('Pending','Completed','Cancelled') DEFAULT 'Pending',
  `remarks` text,
  PRIMARY KEY (`appointment_id`),
  KEY `patient_id` (`patient_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`slot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,1,1,1,1,'2024-01-18','10:30:00','Completed','First dose completed successfully'),(2,1,1,2,2,'2024-02-15','15:30:00','Pending','Second dose scheduled'),(3,2,2,4,1,'2024-01-19','11:00:00','Completed','No side effects observed'),(4,5,2,3,1,'2024-01-21','10:00:00','Pending','Child vaccination - BCG'),(5,6,2,4,1,'2024-01-22','11:30:00','Pending','Child vaccination - MMR');
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
  `hospital_name` varchar(100) NOT NULL,
  `registration_no` varchar(50) NOT NULL,
  `hospital_type` enum('Government','Private') NOT NULL,
  `city_id` int NOT NULL,
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
INSERT INTO `hospital` VALUES (1,2,'All India Institute of Medical Sciences','HOS001','Government',3),(2,3,'Kokilaben Dhirubhai Ambani Hospital','HOS002','Private',1),(3,4,'Apollo Hospitals Chennai','HOS003','Private',5),(4,5,'Civil Hospital Ahmedabad','HOS004','Government',6);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_child`
--

LOCK TABLES `parent_child` WRITE;
/*!40000 ALTER TABLE `parent_child` DISABLE KEYS */;
INSERT INTO `parent_child` VALUES (1,10,5,1),(2,10,6,1),(3,11,7,2),(4,11,8,2);
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
  `gender` enum('Male','Female','Other') NOT NULL,
  `aadhar_number` varchar(12) NOT NULL,
  `blood_group` varchar(5) NOT NULL,
  `is_adult` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `remarks` text,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `aadhar_number` (`aadhar_number`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,6,'Raj','Patel','1990-05-15','Male','123456789012','B+',1,1,'No allergies'),(2,7,'Priya','Sharma','1985-08-22','Female','234567890123','O+',1,1,'Hypertension patient'),(3,8,'Arun','Kumar','1978-12-10','Male','345678901234','A+',1,1,'Diabetes patient'),(4,9,'Meera','Shah','1992-03-18','Female','456789012345','AB+',1,1,'Regular checkups'),(5,NULL,'Rohan','Singh','2018-03-10','Male','567890123456','B+',0,1,'Child vaccination'),(6,NULL,'Ananya','Singh','2020-06-25','Female','678901234567','O+',0,1,'Infant vaccination'),(7,NULL,'Karan','Verma','2019-08-15','Male','789012345678','A+',0,1,'Toddler vaccination'),(8,NULL,'Sneha','Verma','2021-11-30','Female','890123456789','B-',0,1,'Newborn vaccination'),(9,18,'sham','sunder','1994-05-24','Male','787845125689','A+',1,1,'aefea aef aef a'),(10,20,'amit','patil','1990-01-24','Male','359059164182','B+',1,1,'sbefhg e yefuyewfyew');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationship`
--

LOCK TABLES `relationship` WRITE;
/*!40000 ALTER TABLE `relationship` DISABLE KEYS */;
INSERT INTO `relationship` VALUES (1,'Father'),(2,'Mother'),(3,'Guardian'),(4,'Grandfather'),(5,'Grandmother'),(6,'Uncle'),(7,'Aunt');
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
  PRIMARY KEY (`slot_id`),
  KEY `hospital_id` (`hospital_id`),
  KEY `vaccine_id` (`vaccine_id`),
  CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`hospital_id`),
  CONSTRAINT `slot_ibfk_2` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccine` (`vaccine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot`
--

LOCK TABLES `slot` WRITE;
/*!40000 ALTER TABLE `slot` DISABLE KEYS */;
INSERT INTO `slot` VALUES (1,1,'2024-01-20','09:00:00','11:00:00',50,10,1),(2,1,'2024-01-20','14:00:00','16:00:00',50,5,1),(3,2,'2024-01-22','09:00:00','11:00:00',30,3,3),(4,2,'2024-01-23','11:00:00','13:00:00',40,12,4),(5,3,'2024-01-24','15:00:00','17:00:00',40,7,5),(6,4,'2024-01-26','09:00:00','11:00:00',45,9,1),(7,4,'2024-01-27','14:00:00','16:00:00',40,6,2);
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
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'admin','admin123','admin@teeka.gov.in','9876543210','Government of India, New Delhi',1),(2,2,'aiims','hospital123','aiims@aiims.edu','9876543211','Ansari Nagar, New Delhi',1),(3,2,'kims','hospital123','contact@kims.com','9876543212','Andheri West, Mumbai',1),(4,2,'apollo','hospital123','info@apollo.com','9876543213','Greams Road, Chennai',1),(5,2,'civil','hospital123','civil@hospital.com','9876543220','Civil Lines, Ahmedabad',1),(6,3,'raj','patient123','raj.patel@gmail.com','9876543214','101, Shivaji Nagar, Pune',1),(7,3,'priya','patient123','priya.sharma@yahoo.com','9876543215','45, Rajpath, Delhi',1),(8,3,'arun','patient123','arun.k@gmail.com','9876543216','78, MG Road, Bangalore',1),(9,3,'meera','patient123','meera.shah@gmail.com','9876543217','22, Ellis Bridge, Ahmedabad',1),(10,4,'parent1','parent123','parent1@gmail.com','9876543218','22, Model Town, Jaipur',1),(11,4,'parent2','parent123','parent2@yahoo.com','9876543221','33, Saket, Delhi',1),(16,3,'shubham','shubham123','shubham@gmail.com','8956895623','gsidf ggsdfgysdgfygsu gfysdyfsd f | Personal Info: Full Name: Shubham ch, DOB: 2000-01-24, Gender: Male, Aadhaar: 124578451245, Remarks: hello this is shub',1),(17,0,'ram','ram123','ram@gmail.com','7845122356','hfu sufsegfesu fuseu fusiegf isief ',0),(18,3,'sham','sham123','smham@gmail.com','8978455623','afjs fgysug fygsyf guysgfgesf',1),(19,0,'asasas','aaaaaa','aaa@gmail.com','8888888888','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',0),(20,3,'amit','amit123','amit@gmail.com','7845124578','jagyfg yusg eyfsyef yuefyu',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccine`
--

DROP TABLE IF EXISTS `vaccine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccine` (
  `vaccine_id` int NOT NULL AUTO_INCREMENT,
  `vaccine_name` varchar(100) NOT NULL,
  `manufacturer` varchar(100) NOT NULL,
  `vaccine_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `side_effects` text NOT NULL,
  `min_age` int NOT NULL,
  `max_age` int NOT NULL,
  `dose_required` int NOT NULL,
  `dose_gap_days` int NOT NULL,
  `storage_temperature` int NOT NULL,
  `expiry_date` date NOT NULL,
  `manufacturing_date` date NOT NULL,
  PRIMARY KEY (`vaccine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccine`
--

LOCK TABLES `vaccine` WRITE;
/*!40000 ALTER TABLE `vaccine` DISABLE KEYS */;
INSERT INTO `vaccine` VALUES (1,'Covishield','Serum Institute of India','COVID-19','Adenovirus vector based vaccine for COVID-19','Mild fever, fatigue, headache',18,100,2,28,2,'2024-12-31','2023-01-15'),(2,'Covaxin','Bharat Biotech','COVID-19','Inactivated virus vaccine for COVID-19','Pain at injection site, mild fever',18,100,2,28,2,'2024-11-30','2023-02-20'),(3,'BCG','Serum Institute of India','Tuberculosis','Bacillus Calmette-Guérin vaccine for TB','Swelling at injection site, mild fever',0,1,1,0,5,'2025-06-30','2023-03-10'),(4,'MMR','GlaxoSmithKline','Measles, Mumps, Rubella','Combination vaccine for measles, mumps and rubella','Mild rash, fever, swollen glands',12,15,2,90,2,'2024-10-15','2023-04-05'),(5,'Hepatitis B','Bharat Biotech','Hepatitis','Recombinant vaccine for Hepatitis B','Soreness, fatigue, headache',0,100,3,30,2,'2024-09-20','2023-05-12'),(6,'Polio','Panacea Biotec','Polio','Inactivated polio vaccine','Redness or swelling at injection site',0,5,4,60,2,'2024-08-15','2023-06-10');
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

-- Dump completed on 2026-01-24 12:01:20
