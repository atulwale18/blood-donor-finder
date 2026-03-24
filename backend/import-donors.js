require('dotenv').config();
const db = require('./config/db');
const axios = require('axios');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const getLatLngFromCity = async (address, city) => {
  try {
    const query = address
      ? `${address}, ${city}, Maharashtra, India`
      : `${city}, Maharashtra, India`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    const res = await axios.get(url, {
      headers: { "User-Agent": "blood-donor-finder-import" }
    });

    if (res.data && res.data.length > 0) {
      return {
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon)
      };
    }
  } catch (err) {
    // ignoring errors
  }
  return { latitude: null, longitude: null };
};

const donorsData = [
  {"Email":"sahilsangar659@gmail.com","FullName":"Sahil Dattatray Sangar","Mobile":"9373457062","BloodGroup":"A+","Age":"21","Gender":"Male","Address":"Shshsh","City":"Hdh"},
  {"Email":"atulwale4@gmail.com","FullName":"Atul Shivaling Wale","Mobile":"7820946531","BloodGroup":"AB+","Age":"22","Gender":"Male","Address":"Borgaon 688","City":"Kavathemahankal"},
  {"Email":"akshadabhosale2004@gmail.com","FullName":"Akshada Rajendra Bhosale","Mobile":"89539 71171","BloodGroup":"O+","Age":"22","Gender":"Female","Address":"Mangalwar Peth Near Shani Maruti Temp","City":"Miraj"},
  {"Email":"joshimangesh2002@gmail.com","FullName":"Joshi Mangesh Nitin","Mobile":"7249218913","BloodGroup":"O+","Age":"22","Gender":"Male","Address":"At post pangari tal bars","City":"Barshi"},
  {"Email":"stodkar498@gmail.com","FullName":"Shubham ulhas todkar","Mobile":"9022962564","BloodGroup":"O+","Age":"23","Gender":"Male","Address":"A/P Savalaj","City":"Tasgaon"},
  {"Email":"prathmeshyadav1434@gmail.com","FullName":"Prathmesh Amarjeet yadav","Mobile":"8485881434","BloodGroup":"O+","Age":"22","Gender":"Male","Address":"Mahuli","City":"Vita"},
  {"Email":"wankarvishal013@gmail.com","FullName":"Vishal Shankar Wankar","Mobile":"9284310749","BloodGroup":"A+","Age":"21","Gender":"Male","Address":"Kavthe mahankal","City":"Sangli"},
  {"Email":"sahilkatre80@gmail.com","FullName":"Sahil Rajakumar Katre","Mobile":"9529921294","BloodGroup":"O+","Age":"21","Gender":"Male","Address":"Sangli","City":"Sangli"},
  {"Email":"wavareaniket4@gmail.com","FullName":"Aniket balaso wavare","Mobile":"7058134632","BloodGroup":"B+","Age":"22","Gender":"Male","Address":"kongnoli","City":"Sangli"},
  {"Email":"patilshivani2912@gmail.com","FullName":"Shivani Tatyaso Patil","Mobile":"8799821381","BloodGroup":"A+","Age":"21","Gender":"Female","Address":"Kavalapur","City":"Sangli"},
  {"Email":"khadeankita606@gmail.com","FullName":"Ankita Anant Khade","Mobile":"7797926097","BloodGroup":"AB+","Age":"21","Gender":"Female","Address":"Kavalapur","City":"Sangli"},
  {"Email":"ajinkyabhosale1654@gmail.com","FullName":"Ajinkya Gulabrao Bhosale","Mobile":"9511883056","BloodGroup":"O+","Age":"22","Gender":"Male","Address":"Ranjani","City":"Kavathe Mahankal"},
  {"Email":"sujitzambare7000@gmail.com","FullName":"Sujit vijay zambare","Mobile":"9764535012","BloodGroup":"O+","Age":"22","Gender":"Male","Address":"Dongarsoni","City":"Tasgaon"},
  {"Email":"sakshipatil6772@gmail.com","FullName":"Sakshi Bajirao Patil","Mobile":"8625986772","BloodGroup":"O+","Age":"21","Gender":"Female","Address":"Shene","City":"Ishwarpur"},
  {"Email":"siddhinatil6486@gmail.com","FullName":"Patil Siddhi Manoj","Mobile":"8625087079","BloodGroup":"O+","Age":"21","Gender":"Female","Address":"Padmale","City":"Sangli"},
  {"Email":"patilmahesh9532@gmail.com","FullName":"Mahesh Vilas Patil","Mobile":"9763784013","BloodGroup":"O+","Age":"22","Gender":"Male","Address":"Borgaon","City":"Tasgaon"},
  {"Email":"nishantbaul@gmail.com","FullName":"Nishant Baul","Mobile":"9890533947","BloodGroup":"O+","Age":"20","Gender":"Male","Address":"Sharada nagar","City":"Sangli"},
  {"Email":"harshwardhan3170@gmail.com","FullName":"Harshwardhan More","Mobile":"7397810818","BloodGroup":"B+","Age":"21","Gender":"Male","Address":"Manik nagar","City":"Miraj"},
  {"Email":"aditya955218@gmail.com","FullName":"Aditya Raghunath Patil","Mobile":"9552185998","BloodGroup":"O+","Age":"21","Gender":"Male","Address":"borgaon","City":"Kavathe mahankal"},
  {"Email":"avia00700@gmail.com","FullName":"Aditya","Mobile":"8237655343","BloodGroup":"B+","Age":"22","Gender":"Male","Address":"Bedag","City":"Miraj"},
  {"Email":"ashishkatkar503@gmail.com","FullName":"Ashish Balkrishna Katka","Mobile":"7083594004","BloodGroup":"A+","Age":"22","Gender":"Male","Address":"Shailninagar","City":"Sangli"},
  {"Email":"nikitaligade04@gmail.com","FullName":"Nikita Rajesh Ligade","Mobile":"8080765981","BloodGroup":"A+","Age":"18","Gender":"Female","Address":"Borgaon","City":"Kavathe Mahankal"},
  {"Email":"khadesakshi36@gmail.com","FullName":"Sakshi Ashok Khade","Mobile":"9960499581","BloodGroup":"B+","Age":"23","Gender":"Female","Address":"Ganesh colony","City":"Pune"},
  {"Email":"vaishnavisamane8@gmail.com","FullName":"Vaishnavi Samane","Mobile":"9356874723","BloodGroup":"AB+","Age":"22","Gender":"Female","Address":"Omerga","City":"Omerga"},
  {"Email":"svaishnavi258@gmail.com","FullName":"Vaishnavi Shinde","Mobile":"8010252752","BloodGroup":"A-","Age":"23","Gender":"Female","Address":"Kavalapur","City":"Kavalapur"},
  {"Email":"sharvanimali313@gmail.com","FullName":"Sharvani Prakash Mali","Mobile":"8956922570","BloodGroup":"B+","Age":"21","Gender":"Female","Address":"Vasantdada industrial estate","City":"Sangli"},
  {"Email":"vishvajajadhav38@gmail.com","FullName":"Vishwaja Chandrakant J","Mobile":"8381050236","BloodGroup":"B+","Age":"21","Gender":"Female","Address":"Soni","City":"Miraj"},
  {"Email":"paurnimamane709@gmail.com","FullName":"Paurnima Vinayak Mane","Mobile":"9359364680","BloodGroup":"O+","Age":"22","Gender":"Female","Address":"Kashil","City":"Satara"},
  {"Email":"shreyadagade4@gmail.com","FullName":"Shreya Gorakh Dagade","Mobile":"7498827338","BloodGroup":"O+","Age":"22","Gender":"Female","Address":"Mayani","City":"Satara"},
  {"Email":"anujashinde210404@gmail.com","FullName":"Anuja suryakant shinde","Mobile":"9503563727","BloodGroup":"O+","Age":"22","Gender":"Female","Address":"jarandi","City":"Tasgaon"},
  {"Email":"tanayasalunkhe0312@gmail.com","FullName":"Shruti Kaustubh salunkhe","Mobile":"9922586027","BloodGroup":"B+","Age":"22","Gender":"Female","Address":"Reveni gali","City":"Sangli"},
  {"Email":"sanikapatil1073@gmail.com","FullName":"Sanika Shankar Patil","Mobile":"7028690731","BloodGroup":"AB+","Age":"20","Gender":"Female","Address":"Kumathe","City":"Kumathe"},
  {"Email":"bhandareneha958@gmail.com","FullName":"Neha Ashok Bhandare","Mobile":"9579507524","BloodGroup":"AB+","Age":"24","Gender":"Female","Address":"Mallewadi","City":"Miraj"}
];

const insertUser = (email) => {
  return new Promise((resolve, reject) => {
    const defaultPassword = "Password123";
    db.query("INSERT INTO users (email, password, role) VALUES (?, ?, 'donor')", [email, defaultPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          db.query("SELECT user_id FROM users WHERE email = ?", [email], (e, res) => {
            if (e) reject(e);
            else resolve(res[0].user_id);
          });
        } else {
          reject(err);
        }
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const insertDonor = (donor, user_id, loc) => {
  return new Promise((resolve, reject) => {
    const randomWeight = Math.floor(Math.random() * 40) + 50; 
    const randomHb = (Math.random() * (16.0 - 12.5) + 12.5).toFixed(1);
    const randomSurgery = Math.random() < 0.9 ? "No" : "Yes";
    const dateOfDonation = null;

    db.query(`
        INSERT INTO donors
        (user_id, name, age, weight, hemoglobin, recent_surgery, gender, blood_group, mobile, last_donation_date,
         latitude, longitude, address, city, district)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        donor.FullName,
        donor.Age,
        randomWeight,
        randomHb,
        randomSurgery,
        donor.Gender,
        donor.BloodGroup,
        donor.Mobile,
        dateOfDonation,
        loc.latitude,
        loc.longitude,
        donor.Address,
        donor.City,
        null
      ],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
             console.log(`  -> Duplicate donor entry for ${donor.FullName}`);
             resolve();
          } else {
            reject(err);
          }
        }
        else resolve();
      }
    );
  });
};

(async () => {
  let count = 0;
  for (let d of donorsData) {
    try {
      console.log(`Processing: ${d.FullName}`);
      let loc = await getLatLngFromCity(d.Address, d.City);
      if (!loc.latitude) {
         loc = await getLatLngFromCity(null, d.City);
      }
      
      const user_id = await insertUser(d.Email);
      await insertDonor(d, user_id, loc);
      count++;
      await sleep(1500); 
    } catch(err) {
      console.error("  -> Error caching", d.Email, err.message);
    }
  }
  console.log(`\nFinished processing! Successfully inserted/processed ${count} donors.`);
  db.end();
  process.exit(0);
})();









