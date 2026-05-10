"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [facility, setFacility] = useState("");
  const [dock, setDock] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [asset, setAsset] = useState("");
  const [defect, setDefect] = useState("");
  const [severity, setSeverity] = useState("");
  const [photo, setPhoto] = useState("");

  const recommendations: Record<string, string> = {
    "Track Misalignment":
      "Recommend immediate track realignment and hardware inspection.",
    "Seal Damage":
      "Recommend perimeter seal replacement to prevent energy loss.",
    "Hydraulic Leak":
      "Recommend hydraulic system inspection and seal replacement.",
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Cornerstone Dock & Door Solutions", 20, 20);
    doc.text("Inspection Report", 20, 35);

    doc.setFontSize(12);
    doc.text(`Facility: ${facility}`, 20, 55);
    doc.text(`Dock: ${dock}`, 20, 65);
    doc.text(`Contact: ${contact}`, 20, 75);
    doc.text(`Asset: ${asset}`, 20, 85);
    doc.text(`Defect: ${defect}`, 20, 95);
    doc.text(`Severity: ${severity}`, 20, 105);
    doc.text(`Notes: ${notes}`, 20, 115);

    doc.text(
      `Recommendation: ${recommendations[defect] || ""}`,
      20,
      130
    );

    if (photo) {
      doc.addImage(photo, "JPEG", 20, 145, 160, 90);
    }

    doc.save("cornerstone-inspection-report.pdf");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Cornerstone Field Inspection</h1>

      <input placeholder="Facility Name" onChange={(e) => setFacility(e.target.value)} />
      <br /><br />

      <input placeholder="Dock Number" onChange={(e) => setDock(e.target.value)} />
      <br /><br />

      <input placeholder="Site Contact" onChange={(e) => setContact(e.target.value)} />
      <br /><br />

      <select onChange={(e) => setAsset(e.target.value)}>
        <option>Select Asset</option>
        <option>Overhead Door</option>
        <option>Dock Leveler</option>
        <option>Dock Seal</option>
      </select>

      <br /><br />

      <select onChange={(e) => setDefect(e.target.value)}>
        <option>Select Defect</option>
        <option>Track Misalignment</option>
        <option>Seal Damage</option>
        <option>Hydraulic Leak</option>
      </select>

      <br /><br />

      <select onChange={(e) => setSeverity(e.target.value)}>
        <option>Select Severity</option>
        <option>Monitor</option>
        <option>Maintenance Needed</option>
        <option>Repair Recommended</option>
        <option>Immediate Safety Concern</option>
      </select>

      <br /><br />

      <input type="file" accept="image/*" onChange={handlePhotoUpload} />

      <br /><br />

      {photo && <img src={photo} alt="Inspection" style={{ maxWidth: "400px" }} />}

      <br /><br />

      <textarea placeholder="Inspection Notes" onChange={(e) => setNotes(e.target.value)} />

      <br /><br />

      <h3>Recommendation</h3>
      <p>{recommendations[defect] || "Select a defect to generate recommendation."}</p>

      <br /><br />

      <button onClick={generatePDF}>
        Generate PDF Inspection Report
      </button>
    </div>
  );
}