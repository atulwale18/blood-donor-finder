require("dotenv").config();
const admin = require("../config/firebase-admin");
const db = require("../config/db");
const transporter = require("../config/mailer");
const PDFDocument = require("pdfkit");

let twilioClient;
if ((process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID) && process.env.TWILIO_AUTH_TOKEN) {
  const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
  twilioClient = require('twilio')(sid, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsApp = async (mobile, message) => {
  if (!twilioClient) {
    console.log("Twilio is not configured. Skipping WhatsApp message to", mobile);
    return;
  }
  if (!mobile) return;
  try {
    const toNum = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      to: `whatsapp:${toNum}`,
      body: message
    });
    console.log("WhatsApp message sent to:", mobile);
  } catch (err) {
    console.log("WhatsApp error:", err);
  }
};

const MAX_DISTANCE = 15;
const MAX_DONORS = 5;

/* =========================
   FIREBASE, EMAIL & WHATSAPP NOTIFICATION
========================= */
const sendNotifications = async (donors, bloodGroup, hospitalName, requestId) => {
  for (const donor of donors) {
    // 1. Send Push Notification via Firebase (High-Priority OS Popup)
    if (donor.fcm_token) {
      const message = {
        notification: {
          title: "🚨 Someone needs a blood donation near you",
          body: `Urgent! ${bloodGroup} blood is needed at ${hospitalName}. Please help save a life.`,
          image: "https://ai-powered-blood-donor-finder.vercel.app/logo512.png"
        },
        android: {
          priority: "high",
          notification: {
            channelId: "urgent_blood_alerts",
            defaultSound: true,
            defaultVibrateTimings: true,
            notificationCount: 1,
            clickAction: "FLUTTER_NOTIFICATION_CLICK"
          }
        },
        webpush: {
          headers: {
            Urgency: "high"
          },
          notification: {
            requireInteraction: true,
            icon: "https://ai-powered-blood-donor-finder.vercel.app/logo192.png",
            vibrate: [200, 100, 200, 100, 200]
          }
        },
        token: donor.fcm_token
      };

      try {
        admin.messaging().send(message)
          .then(() => console.log("High-Priority Push Notification sent to donor:", donor.donor_id))
          .catch((err) => console.log("Push Notification error:", err.message));
      } catch (err) {
        console.log("Push Notification Exception:", err.message);
      }
    }

    // 2. Send Urgent Email via Nodemailer
    if (donor.email) {
      const frontendUrl = process.env.REACT_APP_FRONTEND_URL || "https://ai-powered-blood-donor-finder.vercel.app";
      const mailOptions = {
        from: "Blood Donor Finder <blooddonorportal@gmail.com>",
        to: donor.email,
        subject: `🚨 URGENT: ${bloodGroup} Blood Needed at ${hospitalName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2 style="color: #d32f2f;">🩸 Urgent Blood Request</h2>
            <p><strong>${hospitalName}</strong> has just requested <strong>${bloodGroup}</strong> blood.</p>
            <p>You are receiving this alert because you are a matching nearby donor.</p>
            <br/>
            <a href="${frontendUrl}/donor/login?requestId=${requestId || ''}" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Open Blood Donor Finder
            </a>
            <br/><br/>
            <p style="color: #777; font-size: 12px;">This is an automated emergency alert.</p>
          </div>
        `
      };

      try {
        transporter.sendMail(mailOptions)
          .then(() => console.log("Email Notification sent to donor:", donor.donor_id))
          .catch((err) => console.log("Email Notification error:", err.message));
      } catch (err) {
        console.log("Email Exception:", err.message);
      }
    }

    // 3. Send WhatsApp via Twilio
    if (donor.mobile) {
      const frontendUrl = process.env.REACT_APP_FRONTEND_URL || "https://ai-powered-blood-donor-finder.vercel.app";
      const waMessage = `🚨 Emergency Blood Request\n\nBlood Group: ${bloodGroup}\nHospital: ${hospitalName}\n\nPlease respond immediately.\n\nClick here: ${frontendUrl}/donor/login?requestId=${requestId || ''}`;
      sendWhatsApp(donor.mobile, waMessage);
    }
  }
};


/* =========================
   ADMIN OVERVIEW (TODAY)
========================= */
exports.getAdminOverview = (req, res) => {

  const sql = `
    SELECT
      COUNT(*) AS total_emergencies,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted_emergencies,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_emergencies
    FROM emergency_requests
    WHERE DATE(created_at) = CURDATE()
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.error("Admin overview error:", err);
      return res.status(500).json({ message: "Failed to load admin overview" });
    }

    res.json(result[0]);

  });

};


/* =========================
   ADMIN MONTHLY REPORT
========================= */
exports.getMonthlyReport = (req, res) => {

  const sql = `
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month_key,
      DATE_FORMAT(created_at, '%M %Y') AS month,
      COUNT(*) AS total_emergencies
    FROM emergency_requests
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY
      DATE_FORMAT(created_at, '%Y-%m'),
      DATE_FORMAT(created_at, '%M %Y')
    ORDER BY month_key
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.error("Monthly report error:", err);
      return res.status(500).json({ message: "Failed to load monthly report" });
    }

    res.json(result);

  });

};


/* =========================
   CREATE EMERGENCY
========================= */
exports.createEmergency = (req, res) => {

  const { hospital_id, blood_group } = req.body;

  if (!hospital_id || !blood_group) {
    return res.status(400).json({ message: "Missing data" });
  }

  const expireAt = new Date(Date.now() + 10 * 60 * 1000);

  const insertEmergencySql = `
    INSERT INTO emergency_requests
    (hospital_id, blood_group, status, donor_visible, hospital_visible, donor_expire_at, created_at)
    VALUES (?, ?, 'pending', 1, 1, ?, NOW())
  `;

  db.query(insertEmergencySql, [hospital_id, blood_group, expireAt], (err, result) => {

    if (err) {
      console.error("Emergency create error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    const requestId = result.insertId;

    db.query(
      "SELECT hospital_name FROM hospitals WHERE hospital_id = ?",
      [hospital_id],
      (errH, hRows) => {

        const hospitalName = hRows?.[0]?.hospital_name || "Nearby Hospital";

        // 🧠 AI / Smart Matching Enhancement (Multi-factor Intelligent Ranking)
        const knnSql = `
          SELECT
            d.donor_id,
            d.fcm_token,
            d.mobile,
            u.email,
            (
              6371 * acos(
                cos(radians(h.latitude)) *
                cos(radians(d.latitude)) *
                cos(radians(d.longitude) - radians(h.longitude)) +
                sin(radians(h.latitude)) *
                sin(radians(d.latitude))
              )
            ) AS distance,
            
            /* AI Scoring: Distance weighted at 70%, Experience weighted at 30% */
            (
              (
                6371 * acos(
                  cos(radians(h.latitude)) * cos(radians(d.latitude)) *
                  cos(radians(d.longitude) - radians(h.longitude)) +
                  sin(radians(h.latitude)) * sin(radians(d.latitude))
                )
              ) * 0.7 
              + IF(d.last_donation_date IS NULL, 2.5, 0.0)
            ) AS smart_score
            
          FROM donors d
          JOIN users u ON u.user_id = d.user_id
          JOIN hospitals h ON h.hospital_id = ?
          WHERE d.blood_group = ?
            AND d.latitude IS NOT NULL
            AND d.longitude IS NOT NULL
            AND d.is_available = 'Available'
            AND d.age BETWEEN 18 AND 65
            AND (d.weight >= 50 OR d.weight IS NULL)
            AND (d.hemoglobin >= 12.5 OR d.hemoglobin IS NULL)
            AND (d.recent_surgery = 'no' OR d.recent_surgery IS NULL)
            AND (
              d.last_donation_date IS NULL
              OR DATEDIFF(CURDATE(), d.last_donation_date) >= 90
            )
          ORDER BY smart_score ASC, distance ASC
          LIMIT ?
        `;

        db.query(knnSql, [hospital_id, blood_group, MAX_DONORS], async (err, donors) => {

          if (err) {
            console.error("KNN donor error:", err);
            return res.status(500).json({ message: "KNN error" });
          }

          const validDonors = [];

          donors.forEach((d) => {

            if (d.distance <= MAX_DISTANCE) {

              validDonors.push(d);

              db.query(
                `
                INSERT INTO emergency_notified_donors
                (request_id, donor_id, distance_km, notified_at)
                VALUES (?, ?, ?, NOW())
                `,
                [requestId, d.donor_id, Number(d.distance.toFixed(2))]
              );

            }

          });

          await sendNotifications(validDonors, blood_group, hospitalName, requestId);

          res.status(201).json({
            message: "Emergency created & donors notified"
          });

        });

      }
    );

  });

};


/* =========================
   GET EMERGENCY FOR DONOR
========================= */
exports.getEmergencyForDonor = (req, res) => {

  const userId = req.params.userId;

  db.query(
    "SELECT donor_id FROM donors WHERE user_id = ?",
    [userId],
    (err, donorRows) => {

      if (err || donorRows.length === 0) return res.json(null);

      const donorId = donorRows[0].donor_id;

      const sql = `
        SELECT
          er.request_id,
          er.blood_group,
          er.created_at,
          er.status,
          er.accepted_donor_id,
          h.hospital_name,
          h.latitude AS h_lat,
          h.longitude AS h_lon,
          endn.distance_km
        FROM emergency_notified_donors endn
        JOIN emergency_requests er ON er.request_id = endn.request_id
        JOIN hospitals h ON h.hospital_id = er.hospital_id
        WHERE endn.donor_id = ?
          AND er.donor_visible = 1
          AND (
            (er.status = 'pending' AND er.donor_expire_at > NOW())
            OR er.status = 'accepted'
          )
        ORDER BY er.created_at DESC
        LIMIT 1
      `;

      db.query(sql, [donorId], (err2, rows) => {

        if (err2 || rows.length === 0) return res.json(null);

        const r = rows[0];

        res.json({
          request_id: r.request_id,
          blood_group: r.blood_group,
          hospital_name: r.hospital_name,
          created_at: r.created_at,
          distance_km: r.distance_km,
          h_lat: r.h_lat,
          h_lon: r.h_lon,
          status: r.status,
          accepted_donor_id: r.accepted_donor_id
        });

      });

    }
  );

};


/* =========================
   GET EMERGENCY FOR HOSPITAL
========================= */
exports.getEmergencyForHospital = (req, res) => {

  const hospitalId = req.params.hospitalId;

  const sql = `
    SELECT
      er.request_id,
      er.blood_group,
      er.status,
      er.created_at,
      d.name AS donor_name,
      d.mobile AS donor_mobile,
      d.city AS donor_city
    FROM emergency_requests er
    LEFT JOIN donors d
      ON d.donor_id = er.accepted_donor_id
    WHERE er.hospital_id = ?
      AND er.hospital_visible = 1
      AND er.created_at >= NOW() - INTERVAL 2 HOUR
    ORDER BY er.created_at DESC
  `;

  db.query(sql, [hospitalId], (err, result) => {

    if (err) {
      console.error("Hospital emergency fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);

  });

};


/* =========================
   GET NOTIFIED DONORS
========================= */
exports.getNotifiedDonorsForHospital = (req, res) => {

  const requestId = req.params.requestId;

  const sql = `
    SELECT
      d.name,
      d.mobile,
      d.hemoglobin,
      endn.distance_km
    FROM emergency_notified_donors endn
    JOIN donors d ON d.donor_id = endn.donor_id
    WHERE endn.request_id = ?
    ORDER BY endn.distance_km ASC
  `;

  db.query(sql, [requestId], (err, result) => {

    if (err) {
      console.error("Notified donors fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);

  });

};


/* =========================
   ACCEPT EMERGENCY
========================= */
exports.acceptEmergency = (req, res) => {

  const { request_id, donor_id } = req.body;

  if (!request_id || !donor_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'accepted',
        accepted_donor_id = ?
    WHERE request_id = ?
      AND status = 'pending'
    `,
    [donor_id, request_id],
    (err, result) => {

      if (err || result.affectedRows === 0) {
        return res.status(400).json({ message: "Invalid accept or already accepted by another donor." });
      }

      res.json({ message: "Accepted" });

      // Notify other notified donors that request was accepted
      const notifySql = `
        SELECT d.mobile, d.fcm_token, u.email
        FROM emergency_notified_donors endn
        JOIN donors d ON d.donor_id = endn.donor_id
        JOIN users u ON u.user_id = d.user_id
        WHERE endn.request_id = ? AND endn.donor_id != ?
      `;
      db.query(notifySql, [request_id, donor_id], async (err, others) => {
        if (!err && others.length > 0) {
          for (const other of others) {
            const msg = "Blood request already accepted by another donor. Thank you for your support!";
            
            // Push Notification
            if (other.fcm_token) {
              try {
                admin.messaging().send({
                  notification: { title: "Update on Blood Request", body: msg },
                  token: other.fcm_token
                }).catch(e => console.log("Push Notification Promise error:", e.message));
              } catch (e) {
                console.log("Push Notification error:", e.message);
              }
            }

            // WhatsApp Notification
            if (other.mobile) {
              sendWhatsApp(other.mobile, `🚨 Update\n\n${msg}`);
            }

            // Email Notification
            if (other.email) {
              const mailOptions = {
                from: "Blood Donor Finder <blooddonorportal@gmail.com>",
                to: other.email,
                subject: `Blood Request Update`,
                html: `<p>${msg}</p>`
              };
              try {
                transporter.sendMail(mailOptions).catch(e => console.log("Email error:", e));
              } catch (e) {
                console.log("Email error:", e.message);
              }
            }
          }
        }
      });

    }
  );

};


/* =========================
   DECLINE EMERGENCY
========================= */
exports.declineEmergency = (req, res) => {

  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID required" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'declined',
        donor_visible = 0,
        hospital_visible = 0
    WHERE request_id = ?
    `,
    [request_id],
    () => res.json({ message: "Declined" })
  );

};


/* =========================
   COMPLETE DONATION & SEND CERTIFICATE
========================= */
exports.completeEmergency = (req, res) => {

  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID required" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'completed',
        donor_visible = 0,
        hospital_visible = 0,
        completed_at = NOW()
    WHERE request_id = ?
    `,
    [request_id],
    (err, result) => {
      // Find the donor to update status AND generate Certificate
      const certSql = `
        SELECT d.donor_id, d.name, d.mobile, d.profile_pic, u.email, h.hospital_name, er.blood_group, DATE_FORMAT(er.completed_at, '%b %d, %Y') as date
        FROM emergency_requests er
        JOIN donors d ON d.donor_id = er.accepted_donor_id
        JOIN users u ON u.user_id = d.user_id
        JOIN hospitals h ON h.hospital_id = er.hospital_id
        WHERE er.request_id = ?
      `;

      db.query(certSql, [request_id], async (err, details) => {
        if (!err && details.length > 0) {
          const info = details[0];
          
          // Update Donor Status
          db.query(
            `UPDATE donors SET is_available = 'Donated Recently', last_donation_date = CURDATE() WHERE donor_id = ?`,
            [info.donor_id]
          );

          // 🎓 SEND E-CERTIFICATE VIA WHATSAPP
          if (info.mobile) {
            const waCert = `🏆 *CERTIFICATE OF APPRECIATION* 🏆\n\nThis certifies that *${info.name}* successfully donated *${info.blood_group}* blood at *${info.hospital_name}* on ${info.date}.\n\nYou are a real-life hero! ❤️ Someone is alive today because of you.\n\n- Blood Donor Finder`;
            sendWhatsApp(info.mobile, waCert);
          }

          // 🎓 SEND E-CERTIFICATE COMPONENT VIA EMAIL AS PDF ATTACHMENT
          if (info.email) {
            
            // 1. Initialize PDF Document
            const doc = new PDFDocument({
              size: 'A4',
              layout: 'landscape',
              margins: { top: 20, bottom: 20, left: 20, right: 20 }
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            // 2. Complete PDF rendering and trigger Email send
            doc.on('end', async () => {
              const pdfData = Buffer.concat(buffers);

              const mailOptions = {
                from: "Blood Donor Finder <blooddonorportal@gmail.com>",
                to: info.email,
                subject: `🏆 Certificate of Appreciation - You Saved a Life!`,
                html: `<p>Dear <b>${info.name}</b>,</p><p>Thank you for your heroic donation of ${info.blood_group} blood at ${info.hospital_name}!</p><p>Please find attached your <b>Official Certificate of Appreciation</b> dynamically generated as a PDF document.</p><br/><p>Warm Regards,<br/><b>Blood Donor Finder System</b></p>`,
                attachments: [
                  {
                    filename: 'Certificate_of_Appreciation.pdf',
                    content: pdfData,
                    contentType: 'application/pdf'
                  }
                ]
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log("PDF Certificate emailed successfully to", info.email);
              } catch (e) {
                console.log("Email Certificate error:", e);
              }
            });

            // 3. 🎨 DRAW THE VISUAL CERTIFICATE USING PDFKIT

            const uniqueCertId = `BDF-${request_id}-${info.donor_id}`;
            const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            // Background Paper
            doc.rect(0, 0, 841.89, 595.28).fill('#FDFBF7');

            // Thick Outer Border
            doc.lineWidth(14).strokeColor('#1F2937').rect(30, 30, 781.89, 535.28).stroke();
            
            // Inner Double Gold Border
            doc.lineWidth(3).strokeColor('#D4AF37').rect(48, 48, 745.89, 499.28).stroke();
            doc.lineWidth(1).strokeColor('#D4AF37').rect(53, 53, 735.89, 489.28).stroke();
            
            // Four Corner Ornaments
            doc.lineWidth(2).strokeColor('#1F2937').fillColor('#D4AF37');
            doc.rect(34, 34, 22, 22).fillAndStroke();
            doc.rect(785.89, 34, 22, 22).fillAndStroke();
            doc.rect(34, 539.28, 22, 22).fillAndStroke();
            doc.rect(785.89, 539.28, 22, 22).fillAndStroke();

            // Certificate ID & Issuance
            doc.font('Helvetica-Oblique').fontSize(11).fillColor('#6B7280').text(`CERTIFICATE ID: ${uniqueCertId}`, 70, 70);
            doc.text('ISSUED ON: ' + issueDate, 70, 85);

            // Header / Title
            doc.font('Times-Bold').fontSize(38).fillColor('#B22222').text('CERTIFICATE OF APPRECIATION', 0, 115, { align: 'center', characterSpacing: 2 });
            
            // Divider Ribbon
            doc.lineWidth(2).strokeColor('#D4AF37').moveTo(250, 155).lineTo(590, 155).stroke();
            doc.lineWidth(1).strokeColor('#D4AF37').moveTo(300, 162).lineTo(540, 162).stroke();

            doc.font('Times-Italic').fontSize(22).fillColor('#4B5563').text('This is proudly presented to', 0, 185, { align: 'center' });
            
            doc.font('Times-BoldItalic').fontSize(44).fillColor('#111827').text(info.name.toUpperCase(), 0, 225, { align: 'center' });
            
            // Subtle line under name
            doc.lineWidth(1).strokeColor('#9CA3AF').moveTo(220, 280).lineTo(620, 280).stroke();

            // 📸 Optional Profile Picture
            let TEXT_START_Y = 310;
            if (info.profile_pic) {
              const fs = require('fs');
              const path = require('path');
              const imgPath = path.join(__dirname, '..', info.profile_pic); 
              if (fs.existsSync(imgPath)) {
                doc.save();
                doc.circle(420.94, 335, 40).clip();
                doc.image(imgPath, 380.94, 295, { width: 80, height: 80 });
                doc.restore();
                doc.lineWidth(3).strokeColor('#D4AF37').circle(420.94, 335, 40).stroke();
                TEXT_START_Y = 390;
              }
            }

            // Context Text
            doc.y = TEXT_START_Y;
            doc.font('Times-Roman').fontSize(18).fillColor('#374151');
            doc.text(`For the heroic and selfless, life-saving act of donating ${info.blood_group} blood.`, { align: 'center' });
            
            doc.moveDown(0.5);
            doc.text(`Your generous contribution at ${info.hospital_name} on ${info.date}`, { align: 'center' });
            
            doc.moveDown(0.5);
            doc.text(`has restored hope and saved a life.`, { align: 'center' });

            // Signature Elements
            doc.lineWidth(1).strokeColor('#1F2937').moveTo(120, 510).lineTo(300, 510).stroke();
            doc.font('Times-Italic').fontSize(24).fillColor('#111827').text('AI Blood Network', 130, 475);
            doc.font('Helvetica-Oblique').fontSize(12).fillColor('#6B7280').text('Authorized Signature', 155, 520);

            // Official Blue Stamp
            doc.save(); 
            doc.translate(660, 480); 
            doc.rotate(-15); 
            doc.lineWidth(3).strokeColor('#2563EB').rect(-120, -30, 240, 60).stroke();
            doc.lineWidth(1).strokeColor('#2563EB').rect(-115, -25, 230, 50).stroke();
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#2563EB').text('AI-POWERED BLOOD FINDER', -102, -12);
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('★ OFFICIALLY VERIFIED ★', -70, 5);
            doc.restore();

            // Central Red Authenticity Seal
            doc.circle(420.94, 495, 40).fill('#B22222');
            doc.lineWidth(3).strokeColor('#D4AF37').circle(420.94, 495, 36).stroke();
            doc.lineWidth(1).strokeColor('#D4AF37').circle(420.94, 495, 32).stroke();
            doc.font('Helvetica').fontSize(13).fillColor('#FDFBF7').text('★', 414, 465);
            doc.font('Times-Bold').fontSize(12).text('LIFE', 399, 485);
            doc.font('Times-Bold').fontSize(12).text('SAVER', 392, 500);

            // Render the file completely
            doc.end();
          }
        }
      });
      
      res.json({ message: "Completed and Certificate Sent" });
    }
  );
};

console.log("EXPORTS:", Object.keys(module.exports));