const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function testPDF() {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margins: { top: 20, bottom: 20, left: 20, right: 20 }
  });

  const outputPath = path.join(__dirname, 'test_certificate.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  const info = {
    name: "Ankit Kumar",
    blood_group: "O+",
    hospital_name: "City General Hospital",
    date: "Mar 24, 2026",
    profile_pic: null 
  };

  // 1. Background Paper
  doc.rect(0, 0, 841.89, 595.28).fill('#FDFBF7');

  // 2. Thick Outer Border
  doc.lineWidth(14).strokeColor('#1F2937').rect(30, 30, 781.89, 535.28).stroke();
  
  // 3. Inner Double Gold Border
  doc.lineWidth(3).strokeColor('#D4AF37').rect(48, 48, 745.89, 499.28).stroke();
  doc.lineWidth(1).strokeColor('#D4AF37').rect(53, 53, 735.89, 489.28).stroke();
  
  // 4. Four Corner Ornaments
  doc.lineWidth(2).strokeColor('#1F2937').fillColor('#D4AF37');
  doc.rect(34, 34, 22, 22).fillAndStroke();
  doc.rect(785.89, 34, 22, 22).fillAndStroke();
  doc.rect(34, 539.28, 22, 22).fillAndStroke();
  doc.rect(785.89, 539.28, 22, 22).fillAndStroke();

  // 4.5 Certificate ID & Issuance
  doc.font('Helvetica-Oblique').fontSize(11).fillColor('#6B7280').text('CERTIFICATE ID: BDF-849X2-2026', 70, 70);
  doc.text('ISSUED ON: ' + info.date, 70, 85);

  // 5. Header / Title
  doc.font('Times-Bold').fontSize(38).fillColor('#B22222').text('CERTIFICATE OF APPRECIATION', 0, 115, { align: 'center', characterSpacing: 2 });
  
  // Divider Ribbon under title
  doc.lineWidth(2).strokeColor('#D4AF37').moveTo(250, 155).lineTo(590, 155).stroke();
  doc.lineWidth(1).strokeColor('#D4AF37').moveTo(300, 162).lineTo(540, 162).stroke();

  doc.font('Times-Italic').fontSize(22).fillColor('#4B5563').text('This is proudly presented to', 0, 185, { align: 'center' });
  
  doc.font('Times-BoldItalic').fontSize(44).fillColor('#111827').text(info.name, 0, 225, { align: 'center' });
  
  // Subtle line under name
  doc.lineWidth(1).strokeColor('#9CA3AF').moveTo(220, 280).lineTo(620, 280).stroke();

  // 📸 Optional Profile Picture (If available, render centered)
  let TEXT_START_Y = 310;
  if (info.profile_pic) {
    const imgPath = path.join(__dirname, info.profile_pic); 
    if (fs.existsSync(imgPath)) {
      doc.save();
      doc.circle(420.94, 335, 40).clip();
      doc.image(imgPath, 380.94, 295, { width: 80, height: 80 });
      doc.restore();
      doc.lineWidth(3).strokeColor('#D4AF37').circle(420.94, 335, 40).stroke();
      TEXT_START_Y = 390;
    }
  }

  // 6. Context Text
  doc.y = TEXT_START_Y;
  doc.font('Times-Roman').fontSize(18).fillColor('#374151');
  doc.text(`For the heroic and selfless, life-saving act of donating ${info.blood_group} blood.`, { align: 'center' });
  
  doc.moveDown(0.5);
  doc.text(`Your generous contribution at ${info.hospital_name} on ${info.date}`, { align: 'center' });
  
  doc.moveDown(0.5);
  doc.text(`has restored hope and saved a life.`, { align: 'center' });

  // 7. Signature Elements
  doc.lineWidth(1).strokeColor('#1F2937').moveTo(120, 510).lineTo(300, 510).stroke();
  doc.font('Times-Italic').fontSize(24).fillColor('#111827').text('AI Blood Network', 130, 475);
  doc.font('Helvetica-Oblique').fontSize(12).fillColor('#6B7280').text('Authorized Signature', 155, 520);

  // 8. Official Blue Verification Stamp (Bottom Right)
  doc.save(); 
  doc.translate(660, 480); 
  doc.rotate(-15); 
  doc.lineWidth(3).strokeColor('#2563EB').rect(-120, -30, 240, 60).stroke();
  doc.lineWidth(1).strokeColor('#2563EB').rect(-115, -25, 230, 50).stroke();
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#2563EB').text('AI-POWERED BLOOD FINDER', -102, -12);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563EB').text('★ OFFICIALLY VERIFIED ★', -70, 5);
  doc.restore();

  // 9. Central Red Authenticity Seal (Bottom Center)
  doc.circle(420.94, 495, 40).fill('#B22222');
  doc.lineWidth(3).strokeColor('#D4AF37').circle(420.94, 495, 36).stroke();
  doc.lineWidth(1).strokeColor('#D4AF37').circle(420.94, 495, 32).stroke();
  
  // Stars in the seal
  doc.font('Helvetica').fontSize(13).fillColor('#FDFBF7').text('★', 414, 465);
  doc.font('Times-Bold').fontSize(12).text('LIFE', 399, 485);
  doc.font('Times-Bold').fontSize(12).text('SAVER', 392, 500);

  // Finish PDF
  doc.end();

  stream.on('finish', () => {
    console.log('✅ PREMIUM TEST PDF SUCCESSFUL! Overlaps fixed.');
  });
}

testPDF();
