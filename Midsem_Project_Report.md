# 🩸 AI-Powered Blood Donor Finder - Midsem Project Report

This is a comprehensive technical report prepared for your mid-semester evaluation. It covers the complete architecture, technologies used, algorithms implemented, and the specific role of "AI" in this project. You can use this document as a primary reference when explaining your project to teachers and external examiners.

---

## 1. Project Overview & Problem Statement
**Problem:** Traditional blood donation systems rely on manual searching, phone calls, and broadcasting requests to large groups, resulting in delayed responses during critical emergencies. Often, donors who are far away or ineligible are notified unnecessarily.
**Solution:** The **AI-Powered Blood Donor Finder** is a geo-location-based, intelligent application that bridges the gap between hospitals and blood donors. It instantly matches emergency blood requests with the nearest, eligible, and available donors, significantly reducing the time taken to procure blood.

---

## 2. Technology Stack
Explain to your examiners that this project uses a modern **MERN/PERN-like stack** (replacing MongoDB/PostgreSQL with MySQL for structured relational data).

* **Frontend:** React.js (JavaScript), React Router DOM (for navigation), Axios (for API requests), standard CSS/Glassmorphism UI.
* **Backend:** Node.js, Express.js (RESTful API architecture).
* **Database:** MySQL (Relational Database Management System).
* **Cloud & APIs:** Firebase Cloud Messaging (FCM) for real-time mobile/web push notifications, HTML5 Geolocation API.

---

## 3. The Role of "AI" and Algorithms 
*This is the most important section for your externals. When they ask "Where is the AI?", this is what you explain.*

In this project, "AI" refers to the **Smart Rule-Based Expert System** combined with **Spatial Data Algorithms**. It does not use Machine Learning models (like Neural Networks), but instead uses specialized computational algorithms to make autonomous, intelligent decisions that a human would otherwise have to make manually.

### A. The Geo-Spatial Algorithm (K-Nearest Neighbors / Haversine Formula)
**What it does:** When a hospital raises an emergency, the system doesn't just notify everyone. It calculates the exact curvature of the Earth to find donors within a specific radius (e.g., 15 kilometers).
**Algorithm Used:** The **Haversine Formula**.
**Where it is in the code:** In your backend `emergencyController.js` and `donorController.js`. It runs as a highly optimized mathematical SQL query:
```sql
SELECT donor_id, (
  6371 * acos(
    cos(radians(hospital_lat)) * cos(radians(donor_lat)) *
    cos(radians(donor_lon) - radians(hospital_lon)) +
    sin(radians(hospital_lat)) * sin(radians(donor_lat))
  )
) AS distance
FROM donors ...
```
*Explain to the teacher:* "We use the Haversine spatial algorithm directly inside our database queries to calculate the spherical distance between the hospital's GPS coordinates and the donor's GPS coordinates in real-time."

### B. Smart Algorithmic Filtering (Rule-Based AI Matchmaking)
**What it does:** The system autonomously decides who is legally and medically allowed to donate before sending an alert.
**Algorithm Logic:** A multi-layered boolean logic tree.
**Where it is in the code:** Inside the `emergencyController.js` SQL query `WHERE` clauses.
The system checks:
1. **Distance:** Must be <= 15 km.
2. **Medical Eligibility:** `age BETWEEN 18 AND 65`, `weight >= 50`, `hemoglobin >= 12.5`, `recent_surgery = 'no'`.
3. **Recovery Period (Gap Check):** Dates are compared dynamically to ensure `last_donation_date` is at least **90 days** in the past.
4. **Real-time Availability:** The donor's `is_available` status must be strictly set to `'Available'`.

### C. Autonomous State Management System
**What it does:** The system learns and reacts to user actions without human admin intervention.
**Where it is in the code:** `emergencyController.js` -> `completeEmergency` endpoint.
**Execution:** When a hospital clicks "Complete Donation", the system automatically finds the donor who accepted the request and dynamically changes their availability status to `'Donated Recently'`, preventing them from receiving spam for the next 90 days.

---

## 4. System Workflow (How it Works)
Walk your examiners through this real-world scenario:
1. **Onboarding:** A donor registers, and their precise Latitude and Longitude are captured using the browser's GPS API.
2. **Emergency Triggered:** A hospital creates an emergency for a specific blood group (e.g., "O+").
3. **AI Processing:** The backend runs the Haversine & Rule-based filters. It finds 5 matching donors who are physically nearby, medically eligible, and actively available.
4. **Push Notifications:** The server uses `Firebase Admin SDK` to beam a real-time push notification instantly to those 5 specific donors.
5. **Concurrency Control:** When Donor A clicks "Accept", the system immediately flags the request as `accepted`. If Donor B tries to click it later, the UI dynamically blocks them with a message: *"Already accepted by another donor"*.

---

## 5. Core Features Implemented to Date
If asked what modules you have completed, list these:
* **Role-Based Authentication:** Distinct logins for Admins, Hospitals, and Donors.
* **Smart Dashboards:** Dedicated interactive dashboards for each role.
* **Profile & Settings Engine:** Users can update personal data, securely change passwords, and update their exact GPS coordinates at any time.
* **Granular Availability Control:** Donors aren't just "On or Off". They possess states: *Available, Not Available, Donated Recently, Temporarily Inactive*.
* **Find Blood Banks Module:** Allows users to search for stationary blood banks nearby.
* **Actionable Emergencies:** Hospitals can track which precise donors have been alerted, and can manually complete or decline requests.

---

## 6. Real-World Readiness & Best Practices Used
Impress your examiners with these technical best practices implemented in the code:
* **Password Hashing:** (If implemented with bcrypt) Secure storage of passwords inside the database.
* **Separation of Concerns:** React handles the View, Express routes handle endpoints, and Controllers handle the heavy algorithmic business logic.
* **Scalable Data Structure:** Users are kept in a master `users` table, while specific roles reside in `donors` or `hospitals` tables linked via Foreign Keys (`user_id`).
* **Responsive UI/UX:** The application is built using modern layout principles (Glassmorphism, gradients, Flexbox) meaning it works perfectly on both Mobile and Desktop screens.

---
*Good luck with your midsem presentation! You have built a highly technical, intelligent, and socially impactful software system.*
