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

    const now = new Date();
    const reportDate = now.toLocaleDateString();
    const reportTime = now.toLocaleTimeString();
    const reportId = `CDS-${Date.now().toString().slice(-6)}`;

    // Header
    doc.setFillColor(180, 0, 0);
    doc.rect(0, 0, 210, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CORNERSTONE", 20, 18);
    doc.text("DOCK & DOOR SOLUTIONS", 20, 28);

    doc.setFontSize(12);
    doc.text("Professional Inspection Report", 20, 40);

    // Metadata
    doc.setFontSize(9);
    doc.text(`Date: ${reportDate}`, 145, 18);
    doc.text(`Time: ${reportTime}`, 145, 25);
    doc.text(`Report ID: ${reportId}`, 145, 32);

    doc.setTextColor(0, 0, 0);

    // Inspection Details
    doc.setFontSize(12);
    doc.text("Technician: Cornerstone Inspector", 20, 58);

    doc.text(`Facility: ${facility}`, 20, 72);
    doc.text(`Dock: ${dock}`, 20, 82);
    doc.text(`Contact: ${contact}`, 20, 92);
    doc.text(`Asset: ${asset}`, 20, 102);
    doc.text(`Defect: ${defect}`, 20, 112);

    // Severity colors
    if (severity === "Monitor") {
      doc.setTextColor(0, 150, 0);
    } else if (severity === "Maintenance Needed") {
      doc.setTextColor(220, 180, 0);
    } else if (severity === "Repair Recommended") {
      doc.setTextColor(255, 140, 0);
    } else if (severity === "Immediate Safety Concern") {
      doc.setTextColor(200, 0, 0);
    }

    doc.text(`Severity: ${severity}`, 20, 122);

    doc.setTextColor(0, 0, 0);

    doc.text(`Notes: ${notes}`, 20, 136);

    doc.text(
      `Recommendation: ${recommendations[defect] || ""}`,
      20,
      151
    );

    if (photo) {
      const format = photo.includes("png") ? "PNG" : "JPEG";
      doc.addImage(photo, format, 20, 165, 160, 55);
    }

    doc.line(20, 240, 190, 240);
    doc.text("Inspector Signature: ___________________", 20, 252);

    doc.save("cornerstone-inspection-report.pdf");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Cornerstone Field Inspection</h1>

      <input
        placeholder="Facility Name"
        onChange={(e) => setFacility(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Dock Number"
        onChange={(e) => setDock(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Site Contact"
        onChange={(e) => setContact(e.target.value)}
      />
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

      <textarea
        placeholder="Inspection Notes"
        onChange={(e) => setNotes(e.target.value)}
      />

      <br /><br />

      <h3>Recommendation</h3>
      <p>
        {recommendations[defect] ||
          "Select a defect to generate recommendation."}
      </p>

      <br /><br />

      <button onClick={generatePDF}>
        Generate PDF Inspection Report
      </button>
    </div>
  );
}