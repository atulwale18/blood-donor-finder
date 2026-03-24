-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: blood_donor_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_reports`
--

DROP TABLE IF EXISTS `admin_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `report_month` varchar(7) DEFAULT NULL,
  `total_requests` int DEFAULT '0',
  `pending_requests` int DEFAULT '0',
  `completed_requests` int DEFAULT '0',
  `total_blood_units` int DEFAULT '0',
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_reports`
--

LOCK TABLES `admin_reports` WRITE;
/*!40000 ALTER TABLE `admin_reports` DISABLE KEYS */;
INSERT INTO `admin_reports` VALUES (1,'2026-01',2,2,0,25,'2026-01-01 10:05:44');
/*!40000 ALTER TABLE `admin_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_banks`
--

DROP TABLE IF EXISTS `blood_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_banks` (
  `bloodbank_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT 'Sangli',
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bloodbank_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_banks`
--

LOCK TABLES `blood_banks` WRITE;
/*!40000 ALTER TABLE `blood_banks` DISABLE KEYS */;
INSERT INTO `blood_banks` VALUES (1,'MSI Blood Bank','Vishrambag','Pandurang Arcade, Ganesh Nagar, Vishrambag, Sangli 416416','Sangli','8888800040','msibloodbank@gmail.com',16.8541000,74.5649000,'2025-12-31 07:36:25'),(2,'Dr. Shirgaonkar Blood Bank','Vishrambag','Civil Hospital Road, Vishrambag, Sangli 416416','Sangli','02332672233',NULL,16.8526000,74.5812000,'2025-12-31 07:36:25'),(3,'Hindratna Prakashbapu Patil Blood Bank','Vishrambag','Siddhi Vinayak Complex, Vishrambag, Sangli 416416','Sangli','02332672233','hindratnabloodbank@gmail.com',16.8538000,74.5662000,'2025-12-31 07:36:25'),(4,'Shree Basaveshwar Blood Bank','Ganesh Nagar','Opp Civil Hospital, Garpir Road, Sangli 416416','Sangli','9225812369','adarshbloodbank@gmail.com',16.8529000,74.5805000,'2025-12-31 07:36:25'),(5,'Civil Hospital Blood Bank','South Shivaji Nagar','Civil Hospital Campus, Sangli 416416','Sangli','02332623232',NULL,16.8524000,74.5815000,'2025-12-31 07:36:25'),(6,'Akshay Blood Bank','Miraj MIDC','Near Anand Nursing Home, Miraj Sangli Road, Miraj 416410','Miraj','9403723536','abbmiraj@gmail.com',16.8317000,74.6402000,'2025-12-31 07:36:25'),(7,'Miraj Serological Institute Blood Bank','Zaribag','Dr Bhalchandra Patil Hospital, Zaribag, Miraj 416410','Miraj','9420041490','msibloodbank@gmail.com',16.8303000,74.6397000,'2025-12-31 07:36:25'),(8,'Vasantdada Patil Blood Bank','City Police Station Area','Mirasaheb Shopping Complex, Miraj 416410','Miraj','9422614033','svpbb1984@rediffmail.com',16.8298000,74.6381000,'2025-12-31 07:36:25'),(9,'Shashwat Blood Bank','Chandanwadi','Sangli Miraj Road, Chandanwadi, Miraj 416410','Miraj','02332221400',NULL,16.8332000,74.6375000,'2025-12-31 07:36:25'),(10,'Bharati Vidyapeeth Blood Bank','Vishrambag','Sangli Miraj Road, Vishrambag, Sangli 416416','Sangli','02332602100',NULL,16.8554000,74.5698000,'2025-12-31 07:36:25'),(11,'Government Medical College & Hospital Blood Bank','GMCH Campus, Sangli–Miraj Road','Government Medical College & Hospital Campus,','SANGLI','0233-2300800','mailto:gmchsangli.bloodbank@gmail.com',16.8524000,74.5815000,'2026-01-09 05:51:16');
/*!40000 ALTER TABLE `blood_banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blood_inventory`
--

DROP TABLE IF EXISTS `blood_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blood_inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `bloodbank_id` int DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `units_available` int DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  KEY `bloodbank_id` (`bloodbank_id`),
  CONSTRAINT `blood_inventory_ibfk_1` FOREIGN KEY (`bloodbank_id`) REFERENCES `blood_banks` (`bloodbank_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blood_inventory`
--

LOCK TABLES `blood_inventory` WRITE;
/*!40000 ALTER TABLE `blood_inventory` DISABLE KEYS */;
INSERT INTO `blood_inventory` VALUES (1,1,'O+',5,'2025-12-31 08:02:20'),(2,1,'A+',3,'2025-12-31 08:02:20'),(3,1,'B+',2,'2025-12-31 08:02:20'),(4,2,'O+',8,'2025-12-31 08:02:20'),(5,2,'AB+',4,'2025-12-31 08:02:20'),(6,3,'O-',2,'2025-12-31 08:02:20'),(7,3,'B-',1,'2025-12-31 08:02:20');
/*!40000 ALTER TABLE `blood_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donors`
--

DROP TABLE IF EXISTS `donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donors` (
  `donor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `last_donation_date` date DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_available` varchar(30) DEFAULT 'Available',
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `hemoglobin` decimal(4,2) DEFAULT NULL,
  `recent_surgery` varchar(10) DEFAULT NULL,
  `fcm_token` text,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`donor_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `mobile` (`mobile`),
  KEY `idx_blood_group` (`blood_group`),
  KEY `idx_availability` (`is_available`),
  KEY `idx_location` (`latitude`,`longitude`),
  CONSTRAINT `donors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donors`
--

LOCK TABLES `donors` WRITE;
/*!40000 ALTER TABLE `donors` DISABLE KEYS */;
INSERT INTO `donors` VALUES (14,2,'Test',20,'Male','AB+','123','2025-12-11',1.0000000,1.0000000,'Available','a','c','d','uploads/donors/1772817874579-donor',65,14.00,'no','ch2wRle52hslkoibrppZGh:APA91bHYulZ_r1NPKOL3NV6peUVv9e4ns2WQy2FJhVzl6iUCt99ShWGK6X_EkxCqJ-7wz92I8W7Bh7K2ta0FRnCoV-WG4nZDweIP7RR8wGn3cyWavdfu4D4','e'),(15,7,'Akshada Rajendra Bhosale ',21,'Female','O+','89539 71171 ','2026-03-24',16.8367210,74.6418790,'Donated Recently','Mangalwar Peth , Miraj','Miraj','Sangli',NULL,60,13.00,'no','eUjWTSyfT-WHguGyCr52A5:APA91bEXkOcLuEbGpCh3YWnD05kKTaIQBG8kqbwCA_9ipxXFlaUHaNtkjwDzv-3frGQPbhgLY4Rvt_5X06L7Jj41LLRJoREEVMplckUhjaGD9qF5fNdNGbk',NULL),(17,12,'Sakshi Bajirao Patil ',21,'Female','B+','8625986772','2026-03-16',16.8395000,74.6510000,'Donated Recently','ganesh talav ','miraj','sangli',NULL,NULL,NULL,NULL,'d-lGHLw5fYceKRdijcWmvz:APA91bFayvB7PVu_na404psGfHGmXHhKEsbp1LGIy9OKn0FapMBJoI-qyZURUPguf6GVtddKt_7AB51PEe-_9hyvkEnEjsdqyqCEU5dfZZA1La5gdfhufd8',NULL),(18,13,'Sahil Dattatray Sangar',21,'Male','A+','9373457062',NULL,NULL,NULL,'Available','Shshsh','Hdh',NULL,NULL,51,14.90,'No',NULL,NULL),(21,16,'Joshi Mangesh Nitin',22,'Male','O+','7249218913',NULL,18.2341108,75.6875109,'Available','At post pangari tal bars','Barshi',NULL,NULL,68,15.30,'No',NULL,NULL),(22,17,'Shubham ulhas todkar',23,'Male','O+','9022962564',NULL,17.0904859,74.6832675,'Available','A/P Savalaj','Tasgaon',NULL,NULL,73,14.90,'No',NULL,NULL),(23,18,'Prathmesh Amarjeet yadav',22,'Male','O+','8485881434',NULL,17.2719770,74.5372841,'Available','Mahuli','Vita',NULL,NULL,71,13.90,'No',NULL,NULL),(24,19,'Vishal Shankar Wankar',21,'Male','A+','9284310749',NULL,17.1726928,74.5867654,'Available','Kavthe mahankal','Sangli',NULL,NULL,73,14.50,'No',NULL,NULL),(25,20,'Sahil Rajakumar Katre',21,'Male','O+','9529921294',NULL,16.8502534,74.5948885,'Available','Sangli','Sangli',NULL,'uploads/donors/1774354036143-donor',87,15.20,'No','eUjWTSyfT-WHguGyCr52A5:APA91bEXkOcLuEbGpCh3YWnD05kKTaIQBG8kqbwCA_9ipxXFlaUHaNtkjwDzv-3frGQPbhgLY4Rvt_5X06L7Jj41LLRJoREEVMplckUhjaGD9qF5fNdNGbk',NULL),(26,21,'Aniket balaso wavare',22,'Male','B+','7058134632',NULL,17.1726928,74.5867654,'Available','kongnoli','Sangli',NULL,NULL,55,15.80,'Yes',NULL,NULL),(27,22,'Shivani Tatyaso Patil',21,'Female','A+','8799821381',NULL,16.9219602,74.6136474,'Available','Kavalapur','Sangli',NULL,NULL,81,14.80,'No',NULL,NULL),(28,23,'Ankita Anant Khade',21,'Female','AB+','7797926097',NULL,16.9219602,74.6136474,'Available','Kavalapur','Sangli',NULL,NULL,72,15.20,'No','ch2wRle52hslkoibrppZGh:APA91bHYulZ_r1NPKOL3NV6peUVv9e4ns2WQy2FJhVzl6iUCt99ShWGK6X_EkxCqJ-7wz92I8W7Bh7K2ta0FRnCoV-WG4nZDweIP7RR8wGn3cyWavdfu4D4',NULL),(29,24,'Ajinkya Gulabrao Bhosale',22,'Male','O+','9511883056',NULL,16.9776840,74.9398700,'Available','Ranjani','Kavathe Mahankal',NULL,NULL,59,13.60,'Yes',NULL,NULL),(30,25,'Sujit vijay zambare',22,'Male','O+','9764535012',NULL,17.0904859,74.6832675,'Available','Dongarsoni','Tasgaon',NULL,NULL,67,12.90,'Yes',NULL,NULL),(32,27,'Patil Siddhi Manoj',21,'Female','O+','8625087079',NULL,16.8913752,74.5437866,'Available','Padmale','Sangli',NULL,NULL,61,13.80,'No',NULL,NULL),(33,28,'Mahesh Vilas Patil',22,'Male','O+','9763784013',NULL,17.1276337,74.5371227,'Available','Borgaon','Tasgaon',NULL,NULL,86,14.70,'Yes',NULL,NULL),(34,29,'Nishant Baul',20,'Male','O+','9890533947',NULL,17.1726928,74.5867654,'Available','Sharada nagar','Sangli',NULL,NULL,59,13.90,'Yes',NULL,NULL),(35,30,'Harshwardhan More',21,'Male','B+','7397810818','2026-03-16',16.8585161,74.7108947,'Donated Recently','Manik nagar','Miraj',NULL,NULL,80,13.20,'No','ch2wRle52hslkoibrppZGh:APA91bHYulZ_r1NPKOL3NV6peUVv9e4ns2WQy2FJhVzl6iUCt99ShWGK6X_EkxCqJ-7wz92I8W7Bh7K2ta0FRnCoV-WG4nZDweIP7RR8wGn3cyWavdfu4D4',NULL),(36,31,'Aditya Raghunath Patil',21,'Male','O+','9552185998',NULL,17.0067674,74.8651451,'Available','borgaon','Kavathe mahankal',NULL,NULL,84,13.70,'No',NULL,NULL),(37,32,'Aditya',22,'Male','B+','8237655343',NULL,16.7977007,74.7400117,'Available','Bedag','Miraj',NULL,NULL,50,14.80,'No',NULL,NULL),(38,33,'Ashish Balkrishna Katka',22,'Male','A+','7083594004',NULL,17.1726928,74.5867654,'Available','Shailninagar','Sangli',NULL,NULL,75,15.10,'No',NULL,NULL),(39,34,'Nikita Rajesh Ligade',18,'Female','A+','8080765981',NULL,17.0067674,74.8651451,'Available','Borgaon','Kavathe Mahankal',NULL,NULL,56,15.40,'No',NULL,NULL),(40,35,'Sakshi Ashok Khade',23,'Female','B+','9960499581',NULL,18.6258412,73.8665470,'Available','Ganesh colony','Pune',NULL,NULL,76,15.30,'No',NULL,NULL),(41,36,'Vaishnavi Samane',22,'Female','AB+','9356874723',NULL,17.8397264,76.6188503,'Available','Omerga','Omerga',NULL,NULL,79,12.90,'No',NULL,NULL),(42,37,'Vaishnavi Shinde',23,'Female','A-','8010252752',NULL,16.9194780,74.6121080,'Available','Kavalapur','Kavalapur',NULL,NULL,78,15.30,'No',NULL,NULL),(43,38,'Sharvani Prakash Mali',21,'Female','B+','8956922570',NULL,17.1726928,74.5867654,'Available','Vasantdada industrial estate','Sangli',NULL,NULL,61,15.90,'No',NULL,NULL),(44,39,'Vishwaja Chandrakant J',21,'Female','B+','8381050236',NULL,16.9529147,74.6887332,'Available','Soni','Miraj',NULL,NULL,66,15.40,'Yes',NULL,NULL),(45,40,'Paurnima Vinayak Mane',22,'Female','O+','9359364680',NULL,17.6361289,74.2982781,'Available','Kashil','Satara',NULL,NULL,86,14.50,'No',NULL,NULL),(46,41,'Shreya Gorakh Dagade',22,'Female','O+','7498827338',NULL,17.4428824,74.5489394,'Available','Mayani','Satara',NULL,NULL,64,15.20,'No',NULL,NULL),(47,42,'Anuja suryakant shinde',22,'Female','O+','9503563727',NULL,17.1831276,74.8350477,'Available','jarandi','Tasgaon',NULL,NULL,82,15.00,'No',NULL,NULL),(48,43,'Shruti Kaustubh salunkhe',22,'Female','B+','9922586027',NULL,17.1726928,74.5867654,'Available','Reveni gali','Sangli',NULL,NULL,85,15.10,'No',NULL,NULL),(49,44,'Sanika Shankar Patil',20,'Female','AB+','7028690731',NULL,16.9615248,74.6512627,'Available','Kumathe','Kumathe',NULL,NULL,70,15.80,'No',NULL,NULL),(50,45,'Neha Ashok Bhandare',24,'Female','AB+','9579507524',NULL,16.8494392,74.7432411,'Temporarily Inactive','Mallewadi','Miraj','',NULL,83,14.20,'No','fAkAHKaXXS2NatamtjfZCM:APA91bHty6Uq-5vJLqw3Eion9DU6lIutWsmcTv6LZkNf8Tb7qbgHOvOaQZsY4YmiwnlH5IKN5_dnfPFQQwC0jTgHVe14Z6mPeB-doKMUiEzkuxkDHB0zA2k',''),(52,14,'Atul Shivaling Wale',22,'Male','AB+','7820946531','2025-12-11',16.8367210,74.6418790,'Available','borgaon ','kvathemahankal','Sangli',NULL,65,14.00,'no','eUjWTSyfT-WHguGyCr52A5:APA91bEXkOcLuEbGpCh3YWnD05kKTaIQBG8kqbwCA_9ipxXFlaUHaNtkjwDzv-3frGQPbhgLY4Rvt_5X06L7Jj41LLRJoREEVMplckUhjaGD9qF5fNdNGbk',NULL);
/*!40000 ALTER TABLE `donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_notified_donors`
--

DROP TABLE IF EXISTS `emergency_notified_donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_notified_donors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `donor_id` int NOT NULL,
  `distance_km` decimal(5,2) DEFAULT NULL,
  `notified_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_notified_donors`
--

LOCK TABLES `emergency_notified_donors` WRITE;
/*!40000 ALTER TABLE `emergency_notified_donors` DISABLE KEYS */;
INSERT INTO `emergency_notified_donors` VALUES (1,66,15,2.13,'2026-03-10 20:44:15'),(2,67,15,2.13,'2026-03-10 21:23:30'),(3,68,15,2.13,'2026-03-11 13:26:08'),(4,69,15,2.13,'2026-03-11 14:23:45'),(5,70,15,2.13,'2026-03-11 14:39:25'),(6,71,15,2.13,'2026-03-11 14:53:51'),(7,72,15,2.13,'2026-03-12 20:02:06'),(8,73,15,2.13,'2026-03-12 20:19:56'),(9,74,15,2.13,'2026-03-12 20:53:17'),(10,75,15,2.13,'2026-03-12 21:07:12'),(11,76,15,2.13,'2026-03-12 21:22:37'),(12,77,15,2.13,'2026-03-13 20:26:51'),(13,78,15,2.13,'2026-03-13 20:40:03'),(14,79,15,2.13,'2026-03-13 20:48:40'),(15,80,15,2.13,'2026-03-13 20:57:17'),(16,81,15,2.13,'2026-03-13 21:26:41'),(17,82,15,2.13,'2026-03-13 21:46:16'),(18,89,15,2.13,'2026-03-13 22:13:10'),(19,90,15,2.13,'2026-03-13 22:13:13'),(20,91,15,2.13,'2026-03-13 22:13:14'),(21,96,17,2.58,'2026-03-13 22:51:58'),(22,97,17,2.58,'2026-03-13 22:52:01'),(23,98,15,2.13,'2026-03-14 19:06:53'),(24,98,25,6.27,'2026-03-14 19:06:53'),(25,98,32,13.36,'2026-03-14 19:06:53'),(26,99,15,2.13,'2026-03-14 19:07:02'),(27,99,25,6.27,'2026-03-14 19:07:02'),(28,99,32,13.36,'2026-03-14 19:07:02'),(29,100,15,2.13,'2026-03-14 19:26:33'),(30,100,25,6.27,'2026-03-14 19:26:34'),(31,100,32,13.36,'2026-03-14 19:26:34'),(32,101,50,11.25,'2026-03-15 21:38:27'),(33,101,28,12.01,'2026-03-15 21:38:27'),(34,102,50,11.25,'2026-03-15 21:40:29'),(35,102,28,12.01,'2026-03-15 21:40:29'),(36,103,50,11.25,'2026-03-15 21:41:31'),(37,103,28,12.01,'2026-03-15 21:41:31'),(38,104,14,2.13,'2026-03-15 21:46:12'),(39,104,50,11.25,'2026-03-15 21:46:12'),(40,104,28,12.01,'2026-03-15 21:46:12'),(41,105,14,2.13,'2026-03-15 21:50:48'),(42,105,50,11.25,'2026-03-15 21:50:48'),(43,105,28,12.01,'2026-03-15 21:50:48'),(44,106,17,2.58,'2026-03-15 21:53:07'),(45,106,35,8.55,'2026-03-15 21:53:07'),(46,106,37,10.57,'2026-03-15 21:53:07'),(47,107,14,2.13,'2026-03-15 22:25:15'),(48,107,52,2.13,'2026-03-15 22:25:15'),(49,107,50,11.25,'2026-03-15 22:25:15'),(50,107,28,12.01,'2026-03-15 22:25:15'),(51,108,14,2.13,'2026-03-15 22:25:37'),(52,108,52,2.13,'2026-03-15 22:25:37'),(53,108,50,11.25,'2026-03-15 22:25:37'),(54,108,28,12.01,'2026-03-15 22:25:37'),(55,109,14,2.13,'2026-03-15 22:25:50'),(56,109,52,2.13,'2026-03-15 22:25:50'),(57,109,50,11.25,'2026-03-15 22:25:50'),(58,109,28,12.01,'2026-03-15 22:25:50'),(59,110,14,2.13,'2026-03-15 22:26:06'),(60,110,52,2.13,'2026-03-15 22:26:06'),(61,110,50,11.25,'2026-03-15 22:26:06'),(62,110,28,12.01,'2026-03-15 22:26:06'),(63,111,52,2.13,'2026-03-16 11:01:07'),(64,111,28,12.01,'2026-03-16 11:01:07'),(65,112,17,2.58,'2026-03-16 11:05:40'),(66,112,35,8.55,'2026-03-16 11:05:40'),(67,112,37,10.57,'2026-03-16 11:05:40'),(68,113,52,2.13,'2026-03-16 14:30:25'),(69,113,28,12.01,'2026-03-16 14:30:25'),(70,114,35,8.55,'2026-03-16 15:18:23'),(71,114,37,10.57,'2026-03-16 15:18:23'),(72,115,35,8.55,'2026-03-16 15:25:16'),(73,115,37,10.57,'2026-03-16 15:25:16'),(74,116,27,12.01,'2026-03-23 10:55:36'),(75,117,27,12.01,'2026-03-23 10:55:39'),(76,118,15,2.13,'2026-03-23 10:55:50'),(77,118,25,6.27,'2026-03-23 10:55:50'),(78,118,32,13.36,'2026-03-23 10:55:50'),(79,119,15,2.13,'2026-03-23 10:55:52'),(80,119,25,6.27,'2026-03-23 10:55:52'),(81,119,32,13.36,'2026-03-23 10:55:52'),(82,120,15,2.13,'2026-03-23 10:55:53'),(83,120,25,6.27,'2026-03-23 10:55:53'),(84,120,32,13.36,'2026-03-23 10:55:53'),(85,122,15,2.13,'2026-03-23 11:27:02'),(86,122,25,6.27,'2026-03-23 11:27:02'),(87,122,32,13.36,'2026-03-23 11:27:02'),(88,123,15,2.13,'2026-03-23 13:21:06'),(89,123,25,6.27,'2026-03-23 13:21:06'),(90,123,32,13.36,'2026-03-23 13:21:06'),(91,124,15,2.13,'2026-03-23 13:21:07'),(92,124,25,6.27,'2026-03-23 13:21:07'),(93,124,32,13.36,'2026-03-23 13:21:07'),(94,125,52,2.13,'2026-03-24 16:14:16'),(95,125,28,12.01,'2026-03-24 16:14:16'),(96,126,52,2.13,'2026-03-24 16:18:26'),(97,126,28,12.01,'2026-03-24 16:18:26'),(98,127,52,2.13,'2026-03-24 16:40:51'),(99,127,28,12.01,'2026-03-24 16:40:51'),(100,128,15,2.13,'2026-03-24 17:05:45'),(101,128,25,6.27,'2026-03-24 17:05:45'),(102,128,32,13.36,'2026-03-24 17:05:45'),(103,129,15,2.13,'2026-03-24 17:05:46'),(104,129,25,6.27,'2026-03-24 17:05:46'),(105,129,32,13.36,'2026-03-24 17:05:46'),(106,130,15,2.13,'2026-03-24 17:05:49'),(107,130,25,6.27,'2026-03-24 17:05:49'),(108,130,32,13.36,'2026-03-24 17:05:49'),(109,131,15,2.13,'2026-03-24 17:05:51'),(110,131,25,6.27,'2026-03-24 17:05:51'),(111,131,32,13.36,'2026-03-24 17:05:51'),(112,133,15,2.13,'2026-03-24 18:13:42'),(113,133,25,6.27,'2026-03-24 18:13:42'),(114,133,32,13.36,'2026-03-24 18:13:42'),(115,134,15,2.13,'2026-03-24 18:13:49'),(116,134,25,6.27,'2026-03-24 18:13:49'),(117,134,32,13.36,'2026-03-24 18:13:49');
/*!40000 ALTER TABLE `emergency_notified_donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_requests`
--

DROP TABLE IF EXISTS `emergency_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL,
  `blood_group` varchar(5) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_donor_id` int DEFAULT NULL,
  `donor_visible` tinyint(1) DEFAULT '1',
  `hospital_visible` tinyint(1) DEFAULT '1',
  `donor_expire_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_requests`
--

LOCK TABLES `emergency_requests` WRITE;
/*!40000 ALTER TABLE `emergency_requests` DISABLE KEYS */;
INSERT INTO `emergency_requests` VALUES (11,3,'AB+','completed','2026-01-03 14:07:53',1,0,0,'2026-01-03 19:47:54','2026-01-05 13:24:53'),(12,4,'O+','completed','2026-01-04 08:00:22',8,0,0,'2026-01-04 13:40:22','2026-01-05 13:49:58'),(13,2,'B+','completed','2026-01-04 08:07:57',3,0,0,'2026-01-04 13:47:57','2026-01-04 14:07:39'),(14,4,'O+','pending','2026-01-05 08:20:02',NULL,1,1,'2026-01-05 14:00:03',NULL),(15,7,'A-','pending','2026-01-05 08:36:32',NULL,1,1,'2026-01-05 14:16:32',NULL),(16,7,'O+','pending','2026-01-05 08:42:00',NULL,1,1,'2026-01-05 14:22:00',NULL),(17,7,'A-','pending','2026-01-05 08:42:09',NULL,1,1,'2026-01-05 14:22:10',NULL),(18,7,'A-','pending','2026-01-05 08:56:39',NULL,1,1,'2026-01-05 14:36:39',NULL),(19,7,'A-','pending','2026-01-05 09:15:56',NULL,1,1,'2026-01-05 14:55:56',NULL),(20,7,'A-','pending','2026-01-05 09:36:11',NULL,1,1,'2026-01-05 15:16:12',NULL),(21,7,'A-','pending','2026-01-06 04:53:23',NULL,1,1,'2026-01-06 10:33:24',NULL),(22,7,'A-','pending','2026-01-06 05:07:10',NULL,1,1,'2026-01-06 10:47:11',NULL),(23,7,'A-','pending','2026-01-06 05:18:21',NULL,1,1,'2026-01-06 10:58:22',NULL),(24,7,'O+','pending','2026-01-06 05:26:51',NULL,1,1,'2026-01-06 11:06:52',NULL),(25,7,'A-','pending','2026-01-06 05:27:02',NULL,1,1,'2026-01-06 11:07:02',NULL),(26,2,'AB+','completed','2026-01-06 05:28:32',1,0,0,'2026-01-06 11:08:33','2026-01-06 11:24:21'),(27,2,'O+','pending','2026-01-06 05:30:10',NULL,1,1,'2026-01-06 11:10:10',NULL),(28,2,'AB+','completed','2026-01-06 05:54:28',1,0,0,'2026-01-06 11:34:29','2026-01-06 11:31:14'),(29,2,'AB+','pending','2026-01-06 06:17:44',NULL,1,1,'2026-01-06 11:57:45',NULL),(30,3,'O+','pending','2026-01-06 07:29:51',NULL,1,1,'2026-01-06 13:09:51',NULL),(31,3,'B+','pending','2026-01-06 07:31:10',NULL,1,1,'2026-01-06 13:11:11',NULL),(32,3,'AB+','pending','2026-01-06 08:06:17',NULL,1,1,'2026-01-06 13:46:18',NULL),(33,3,'AB+','pending','2026-01-06 09:27:40',NULL,1,1,'2026-01-06 15:07:40',NULL),(34,3,'AB+','pending','2026-01-08 08:10:40',NULL,1,1,'2026-01-08 13:50:41',NULL),(35,3,'O+','pending','2026-01-09 05:59:36',NULL,1,1,'2026-01-09 11:39:37',NULL),(36,7,'A+','pending','2026-01-09 06:07:56',NULL,1,1,'2026-01-09 11:47:56',NULL),(37,7,'A+','active','2026-01-09 06:18:23',NULL,1,1,'2026-01-09 11:58:23',NULL),(38,7,'A+','pending','2026-01-12 14:27:13',NULL,1,1,'2026-01-12 20:07:14',NULL),(39,7,'A+','pending','2026-01-12 14:40:47',NULL,1,1,'2026-01-12 20:20:47',NULL),(40,7,'A-','pending','2026-01-12 15:03:09',NULL,1,1,'2026-01-12 20:43:10',NULL),(41,7,'A+','pending','2026-01-15 07:23:54',NULL,1,1,'2026-01-15 13:03:54',NULL),(42,7,'A-','pending','2026-01-15 07:33:44',NULL,1,1,'2026-01-15 13:13:44',NULL),(43,3,'AB+','pending','2026-01-15 07:43:32',NULL,1,1,'2026-01-15 13:23:32',NULL),(44,7,'A+','pending','2026-01-15 08:01:23',NULL,1,1,'2026-01-15 13:41:24',NULL),(45,7,'A+','pending','2026-01-15 08:15:00',NULL,1,1,'2026-01-15 13:55:01',NULL),(46,7,'A+','pending','2026-01-15 08:17:27',NULL,1,1,'2026-01-15 13:57:27',NULL),(47,7,'A+','completed','2026-01-17 08:57:43',12,0,0,'2026-01-17 14:37:43','2026-01-17 14:38:04'),(48,7,'A+','pending','2026-01-17 09:06:22',NULL,1,1,'2026-01-17 14:46:23',NULL),(49,6,'A+','pending','2026-01-17 09:28:49',NULL,1,1,NULL,NULL),(50,7,'A-','accepted','2026-01-19 10:28:19',9,1,1,'2026-01-19 16:08:20',NULL),(51,7,'A+','pending','2026-01-22 07:44:31',NULL,1,1,NULL,NULL),(52,7,'A-','accepted','2026-01-22 07:46:32',9,1,1,'2026-01-22 13:26:33',NULL),(53,3,'A+','pending','2026-02-06 06:20:09',NULL,1,1,NULL,NULL),(54,7,'A+','accepted','2026-02-06 06:23:27',12,1,1,'2026-02-06 12:03:28',NULL),(55,7,'A+','completed','2026-02-15 12:31:13',12,0,0,'2026-02-15 18:11:13','2026-02-15 18:04:24'),(56,3,'AB+','pending','2026-02-15 12:33:57',NULL,1,1,NULL,NULL),(57,7,'A+','accepted','2026-02-15 13:03:45',12,1,1,'2026-02-15 18:43:45',NULL),(58,7,'A+','accepted','2026-02-15 13:04:53',12,1,1,'2026-02-15 18:44:54',NULL),(59,7,'A+','pending','2026-02-20 04:44:32',NULL,1,1,NULL,NULL),(60,7,'A+','accepted','2026-02-20 04:45:49',12,1,1,'2026-02-20 10:25:50',NULL),(61,7,'A+','accepted','2026-02-20 06:21:05',12,1,1,'2026-02-20 12:01:06',NULL),(62,10,'O+','pending','2026-03-10 14:54:31',NULL,1,1,'2026-03-10 20:34:32',NULL),(63,10,'O+','pending','2026-03-10 15:00:31',NULL,1,1,'2026-03-10 20:40:32',NULL),(64,10,'O+','pending','2026-03-10 15:07:09',NULL,1,1,'2026-03-10 20:47:09',NULL),(65,10,'O+','pending','2026-03-10 15:09:45',NULL,1,1,'2026-03-10 20:49:45',NULL),(66,10,'O+','completed','2026-03-10 15:14:15',15,0,0,'2026-03-10 20:54:16','2026-03-10 20:45:29'),(67,10,'O+','accepted','2026-03-10 15:53:30',15,1,1,'2026-03-10 21:33:30',NULL),(68,10,'O+','completed','2026-03-11 07:56:08',15,0,0,'2026-03-11 13:36:08','2026-03-11 13:27:41'),(69,10,'O+','pending','2026-03-11 08:53:45',NULL,1,1,'2026-03-11 14:33:46',NULL),(70,10,'O+','pending','2026-03-11 09:09:25',NULL,1,1,'2026-03-11 14:49:25',NULL),(71,10,'O+','pending','2026-03-11 09:23:51',NULL,1,1,'2026-03-11 15:03:52',NULL),(72,10,'O+','pending','2026-03-12 14:32:06',NULL,1,1,'2026-03-12 20:12:07',NULL),(73,10,'O+','pending','2026-03-12 14:49:56',NULL,1,1,'2026-03-12 20:29:57',NULL),(74,10,'O+','pending','2026-03-12 15:23:17',NULL,1,1,'2026-03-12 21:03:17',NULL),(75,10,'O+','pending','2026-03-12 15:37:12',NULL,1,1,'2026-03-12 21:17:12',NULL),(76,10,'O+','accepted','2026-03-12 15:52:37',15,1,1,'2026-03-12 21:32:37',NULL),(77,10,'O+','pending','2026-03-13 14:56:51',NULL,1,1,'2026-03-13 20:36:52',NULL),(78,10,'O+','pending','2026-03-13 15:10:03',NULL,1,1,'2026-03-13 20:50:04',NULL),(79,10,'O+','completed','2026-03-13 15:18:40',15,0,0,'2026-03-13 20:58:41','2026-03-13 20:57:24'),(80,10,'O+','pending','2026-03-13 15:27:17',NULL,1,1,'2026-03-13 21:07:17',NULL),(81,10,'O+','pending','2026-03-13 15:56:41',NULL,1,1,'2026-03-13 21:36:41',NULL),(82,10,'O+','pending','2026-03-13 16:16:16',NULL,1,1,'2026-03-13 21:56:16',NULL),(83,10,'AB+','pending','2026-03-13 16:33:45',NULL,1,1,'2026-03-13 22:13:46',NULL),(84,10,'AB+','pending','2026-03-13 16:34:32',NULL,1,1,'2026-03-13 22:14:32',NULL),(85,10,'B+','pending','2026-03-13 16:38:44',NULL,1,1,'2026-03-13 22:18:44',NULL),(86,10,'B+','pending','2026-03-13 16:42:30',NULL,1,1,'2026-03-13 22:22:31',NULL),(87,10,'B+','pending','2026-03-13 16:42:46',NULL,1,1,'2026-03-13 22:22:46',NULL),(88,10,'AB+','pending','2026-03-13 16:42:57',NULL,1,1,'2026-03-13 22:22:57',NULL),(89,10,'O+','accepted','2026-03-13 16:43:10',15,1,1,'2026-03-13 22:23:10',NULL),(90,10,'O+','pending','2026-03-13 16:43:13',NULL,1,1,'2026-03-13 22:23:13',NULL),(91,10,'O+','pending','2026-03-13 16:43:14',NULL,1,1,'2026-03-13 22:23:14',NULL),(92,10,'B+','pending','2026-03-13 16:55:50',NULL,1,1,'2026-03-13 22:35:51',NULL),(93,10,'B+','pending','2026-03-13 16:58:10',NULL,1,1,'2026-03-13 22:38:10',NULL),(94,10,'B+','pending','2026-03-13 17:02:52',NULL,1,1,'2026-03-13 22:42:52',NULL),(95,10,'B+','pending','2026-03-13 17:06:22',NULL,1,1,'2026-03-13 22:46:22',NULL),(96,10,'B+','pending','2026-03-13 17:21:58',NULL,1,1,'2026-03-13 23:01:59',NULL),(97,10,'B+','pending','2026-03-13 17:22:01',NULL,1,1,'2026-03-13 23:02:01',NULL),(98,10,'O+','pending','2026-03-14 13:36:53',NULL,1,1,'2026-03-14 19:16:53',NULL),(99,10,'O+','pending','2026-03-14 13:37:02',NULL,1,1,'2026-03-14 19:17:03',NULL),(100,10,'O+','accepted','2026-03-14 13:56:33',25,1,1,'2026-03-14 19:36:34',NULL),(101,10,'AB+','pending','2026-03-15 16:08:27',NULL,1,1,'2026-03-15 21:48:28',NULL),(102,10,'AB+','pending','2026-03-15 16:10:29',NULL,1,1,'2026-03-15 21:50:29',NULL),(103,10,'AB+','pending','2026-03-15 16:11:31',NULL,1,1,'2026-03-15 21:51:32',NULL),(104,10,'AB+','completed','2026-03-15 16:16:12',14,0,0,'2026-03-15 21:56:12','2026-03-15 21:53:24'),(105,10,'AB+','pending','2026-03-15 16:20:48',NULL,1,1,'2026-03-15 22:00:48',NULL),(106,10,'B+','pending','2026-03-15 16:23:07',NULL,1,1,'2026-03-15 22:03:07',NULL),(107,10,'AB+','pending','2026-03-15 16:55:15',NULL,1,1,'2026-03-15 22:35:15',NULL),(108,10,'AB+','pending','2026-03-15 16:55:37',NULL,1,1,'2026-03-15 22:35:38',NULL),(109,10,'AB+','pending','2026-03-15 16:55:50',NULL,1,1,'2026-03-15 22:35:50',NULL),(110,10,'AB+','completed','2026-03-15 16:56:06',14,0,0,'2026-03-15 22:36:06','2026-03-15 23:10:31'),(111,10,'AB+','pending','2026-03-16 05:31:07',NULL,1,1,'2026-03-16 11:11:08',NULL),(112,10,'B+','completed','2026-03-16 05:35:40',17,0,0,'2026-03-16 11:15:40','2026-03-16 11:08:38'),(113,10,'AB+','accepted','2026-03-16 09:00:25',28,1,1,'2026-03-16 14:40:25',NULL),(114,10,'B+','accepted','2026-03-16 09:48:23',35,1,1,'2026-03-16 15:28:23',NULL),(115,10,'B+','completed','2026-03-16 09:55:16',35,0,0,'2026-03-16 15:35:17','2026-03-16 15:27:50'),(116,10,'A+','pending','2026-03-23 05:25:36',NULL,1,1,'2026-03-23 11:05:37',NULL),(117,10,'A+','pending','2026-03-23 05:25:39',NULL,1,1,'2026-03-23 11:05:40',NULL),(118,10,'O+','pending','2026-03-23 05:25:50',NULL,1,1,'2026-03-23 11:05:50',NULL),(119,10,'O+','pending','2026-03-23 05:25:52',NULL,1,1,'2026-03-23 11:05:52',NULL),(120,10,'O+','pending','2026-03-23 05:25:53',NULL,1,1,'2026-03-23 11:05:53',NULL),(121,8,'AB+','pending','2026-03-23 05:45:04',NULL,1,1,NULL,NULL),(122,10,'O+','accepted','2026-03-23 05:57:02',25,1,1,'2026-03-23 11:37:02',NULL),(123,10,'O+','pending','2026-03-23 07:51:06',NULL,1,1,'2026-03-23 13:31:06',NULL),(124,10,'O+','accepted','2026-03-23 07:51:07',25,1,1,'2026-03-23 13:31:08',NULL),(125,10,'AB+','pending','2026-03-24 10:44:16',NULL,1,1,'2026-03-24 16:24:16',NULL),(126,10,'AB+','pending','2026-03-24 10:48:25',NULL,1,1,'2026-03-24 16:28:26',NULL),(127,10,'AB+','pending','2026-03-24 11:10:51',NULL,1,1,'2026-03-24 16:50:52',NULL),(128,10,'O+','pending','2026-03-24 11:35:45',NULL,1,1,'2026-03-24 17:15:45',NULL),(129,10,'O+','pending','2026-03-24 11:35:46',NULL,1,1,'2026-03-24 17:15:47',NULL),(130,10,'O+','pending','2026-03-24 11:35:49',NULL,1,1,'2026-03-24 17:15:49',NULL),(131,10,'O+','pending','2026-03-24 11:35:51',NULL,1,1,'2026-03-24 17:15:51',NULL),(132,10,'A+','pending','2026-03-24 12:10:14',NULL,1,1,NULL,NULL),(133,10,'O+','pending','2026-03-24 12:43:42',NULL,1,1,'2026-03-24 18:23:42',NULL),(134,10,'O+','completed','2026-03-24 12:43:49',15,0,0,'2026-03-24 18:23:50','2026-03-24 18:15:03');
/*!40000 ALTER TABLE `emergency_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `hospital_name` varchar(150) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`hospital_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `mobile` (`mobile`),
  CONSTRAINT `hospitals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (8,3,'Bharati Hospital','0233-2212960',16.8257000,74.6297000,'Wanlesswadi','Sangli','Sangli',NULL),(9,4,'Wanless Hospital','0233-2600310',16.8306000,74.6411000,'Miraj Road, Wanlesswadi','Miraj','Sangli',NULL),(10,5,'Civil Hospital Miraj','0233-2222606',16.8176000,74.6429000,'Pandharpur Road','Miraj','Sangli',NULL),(11,6,'Sangli Civil Hospital','0233-2373900',16.8571000,74.5746000,'Civil Hospital Area, Khanbhag','Sangli','Sangli',NULL);
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('donor','hospital','bloodbank','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com',NULL,'admin@1','admin','2026-03-06 17:19:17',NULL,NULL),(2,'e','123','atul','donor','2026-03-06 17:23:38',NULL,NULL),(3,'info@bvdu.edu.in','0233-2212960','hospital@123','hospital','2026-03-10 14:38:50',NULL,NULL),(4,'wanlesshospital@gmail.com','0233-2600310','hospital@123','hospital','2026-03-10 14:40:38',NULL,NULL),(5,'mirajcivilhospital@gmail.com','0233-2222606','hospital@123','hospital','2026-03-10 14:42:37',NULL,NULL),(6,'sanglicivilhospital@gmail.com','0233-2373900','hospital@123','hospital','2026-03-10 14:46:26',NULL,NULL),(7,'akshadabhosale2004@gmail.com','89539 71171 ','aakshee','donor','2026-03-10 14:53:10',NULL,NULL),(8,'aryanwale96@gmail.com',NULL,'aryan','donor','2026-03-13 16:37:48',NULL,NULL),(12,'sakshipatil6772@gmail.com','8625986772','sakshi','donor','2026-03-13 16:55:09',NULL,NULL),(13,'sahilsangar659@gmail.com','9373457062','Password123','donor','2026-03-14 13:28:44',NULL,NULL),(14,'atulwale4@gmail.com','9876543210','Password123','donor','2026-03-15 16:40:54',NULL,NULL),(16,'joshimangesh2002@gmail.com','7249218913','Password123','donor','2026-03-14 13:28:52',NULL,NULL),(17,'stodkar498@gmail.com','9022962564','Password123','donor','2026-03-14 13:28:55',NULL,NULL),(18,'prathmeshyadav1434@gmail.com','8485881434','Password123','donor','2026-03-14 13:28:58',NULL,NULL),(19,'wankarvishal013@gmail.com','9284310749','Password123','donor','2026-03-14 13:29:00',NULL,NULL),(20,'sahilkatre80@gmail.com','9529921294','Password123','donor','2026-03-14 13:29:02',NULL,NULL),(21,'wavareaniket4@gmail.com','7058134632','Password123','donor','2026-03-14 13:29:04',NULL,NULL),(22,'patilshivani2912@gmail.com','8799821381','Password123','donor','2026-03-14 13:29:06',NULL,NULL),(23,'khadeankita606@gmail.com','7797926097','Password123','donor','2026-03-14 13:29:08',NULL,NULL),(24,'ajinkyabhosale1654@gmail.com','9511883056','Password123','donor','2026-03-14 13:29:09',NULL,NULL),(25,'sujitzambare7000@gmail.com','9764535012','Password123','donor','2026-03-14 13:29:12',NULL,NULL),(27,'siddhinatil6486@gmail.com','8625087079','Password123','donor','2026-03-14 13:29:16',NULL,NULL),(28,'patilmahesh9532@gmail.com','9763784013','Password123','donor','2026-03-14 13:29:18',NULL,NULL),(29,'nishantbaul@gmail.com','9890533947','Password123','donor','2026-03-14 13:29:20',NULL,NULL),(30,'harshwardhan3170@gmail.com','7397810818','Password123','donor','2026-03-14 13:29:22',NULL,NULL),(31,'aditya955218@gmail.com','9552185998','Password123','donor','2026-03-14 13:29:25',NULL,NULL),(32,'avia00700@gmail.com','8237655343','Password123','donor','2026-03-14 13:29:27',NULL,NULL),(33,'ashishkatkar503@gmail.com','7083594004','Password123','donor','2026-03-14 13:29:29',NULL,NULL),(34,'nikitaligade04@gmail.com','8080765981','Password123','donor','2026-03-14 13:29:32',NULL,NULL),(35,'khadesakshi36@gmail.com','9960499581','Password123','donor','2026-03-14 13:29:34',NULL,NULL),(36,'vaishnavisamane8@gmail.com','9356874723','Password123','donor','2026-03-14 13:29:36',NULL,NULL),(37,'svaishnavi258@gmail.com','8010252752','Password123','donor','2026-03-14 13:29:39',NULL,NULL),(38,'sharvanimali313@gmail.com','8956922570','Password123','donor','2026-03-14 13:29:41',NULL,NULL),(39,'vishvajajadhav38@gmail.com','8381050236','Password123','donor','2026-03-14 13:29:43',NULL,NULL),(40,'paurnimamane709@gmail.com','9359364680','Password123','donor','2026-03-14 13:29:45',NULL,NULL),(41,'shreyadagade4@gmail.com','7498827338','Password123','donor','2026-03-14 13:29:47',NULL,NULL),(42,'anujashinde210404@gmail.com','9503563727','Password123','donor','2026-03-14 13:29:49',NULL,NULL),(43,'tanayasalunkhe0312@gmail.com','9922586027','Password123','donor','2026-03-14 13:29:51',NULL,NULL),(44,'sanikapatil1073@gmail.com','7028690731','Password123','donor','2026-03-14 13:29:54',NULL,NULL),(45,'','9579507524','Password123','donor','2026-03-14 13:29:56',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24 21:10:54
