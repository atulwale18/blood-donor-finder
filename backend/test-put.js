const axios = require('axios');

async function testPut() {
  try {
    const res = await axios.put('https://blood-donor-backend.onrender.com/api/donor/profile/2', {
      name: "Test User",
      mobile: "123",
      email: "e",
      age: "",
      address: "",
      city: "",
      district: "",
      latitude: "",
      longitude: "",
      is_available: "Not Available"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
testPut();
