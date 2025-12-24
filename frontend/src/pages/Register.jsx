import React from "react";

const Register = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <input style={styles.input} placeholder="Name" />
        <input style={styles.input} placeholder="Age" />
        <input style={styles.input} placeholder="Gender" />
        <input style={styles.input} placeholder="Blood Group" />
        <input style={styles.input} placeholder="Mobile Number" />
        <input style={styles.input} placeholder="Password" />

        <button style={styles.button}>Sign Up</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e53935",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Register;
