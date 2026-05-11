"use client";

import React, { useState, useEffect } from "react";
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
  const [history, setHistory] = useState<any[]>([]);

  const recommendations: Record<string, string> = {
    "Track Misalignment":
      "Recommend immediate track realignment and hardware inspection.",
    "Seal Damage":
      "Recommend perimeter seal replacement to prevent energy loss.",
    "Hydraulic Leak":
      "Recommend hydraulic system inspection and seal replacement.",
  };

  useEffect(() => {
    const saved = localStorage.getItem("cornerstoneHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveInspection = () => {
    const newInspection = {
      facility,
      dock,
      defect,
      severity,
      date: new Date().toLocaleDateString(),
    };

    const updated = [...history, newInspection];

    setHistory(updated);

    localStorage.setItem(
      "cornerstoneHistory",
      JSON.stringify(updated)
    );
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    const reportId = `CDS-${Date.now()
      .toString()
      .slice(-6)}`;

    const logo = new Image();

    logo.src = "/cornerstone-logo.png";

    logo.onload = () => {
      // Header
      doc.setFillColor(245, 245, 245);

      doc.rect(0, 0, 210, 55, "F");

      // Logo
      doc.addImage(logo, "PNG", 12, 5, 60, 40);

      // Metadata
      doc.setTextColor(10, 25, 45);

      doc.setFontSize(10);

      doc.text(`Date: ${reportDate}`, 145, 18);

      doc.text(`Time: ${reportTime}`, 145, 26);

      doc.text(`Report ID: ${reportId}`, 145, 34);

      // Title
      doc.setFontSize(16);

      doc.text(
        "PROFESSIONAL INSPECTION REPORT",
        20,
        50
      );

      doc.setTextColor(0, 0, 0);

      doc.setFontSize(12);

      // Inspection Details
      doc.text(
        "Technician: Cornerstone Inspector",
        20,
        70
      );

      doc.text(`Facility: ${facility}`, 20, 85);

      doc.text(`Dock: ${dock}`, 20, 95);

      doc.text(`Contact: ${contact}`, 20, 105);

      doc.text(`Asset: ${asset}`, 20, 115);

      doc.text(`Defect: ${defect}`, 20, 125);

      // Severity colors
      if (severity === "Monitor") {
        doc.setTextColor(0, 150, 0);
      } else if (severity === "Maintenance Needed") {
        doc.setTextColor(220, 180, 0);
      } else if (
        severity === "Repair Recommended"
      ) {
        doc.setTextColor(255, 140, 0);
      } else if (
        severity === "Immediate Safety Concern"
      ) {
        doc.setTextColor(200, 0, 0);
      }

      doc.text(`Severity: ${severity}`, 20, 135);

      // Reset color
      doc.setTextColor(0, 0, 0);

      doc.text(`Notes: ${notes}`, 20, 150);

      doc.text(
        `Recommendation: ${
          recommendations[defect] || ""
        }`,
        20,
        165
      );

      // Photo
      if (photo) {
        const format = photo.includes("png")
          ? "PNG"
          : "JPEG";

        doc.addImage(
          photo,
          format,
          20,
          175,
          160,
          70
        );
      }

      // Signature
      doc.line(20, 245, 190, 245);

      doc.text(
        "Inspector Signature: ___________________",
        20,
        257
      );

      // SAVE PDF
      doc.save(
        `cornerstone-inspection-${reportId}.pdf`
      );
    };
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Cornerstone Field Inspection</h1>

      <input
        placeholder="Facility Name"
        onChange={(e) =>
          setFacility(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Dock Number"
        onChange={(e) => setDock(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Site Contact"
        onChange={(e) =>
          setContact(e.target.value)
        }
      />

      <br />
      <br />

      <select
        onChange={(e) => setAsset(e.target.value)}
      >
        <option>Select Asset</option>
        <option>Overhead Door</option>
        <option>Dock Leveler</option>
        <option>Dock Seal</option>
      </select>

      <br />
      <br />

      <select
        onChange={(e) => setDefect(e.target.value)}
      >
        <option>Select Defect</option>
        <option>Track Misalignment</option>
        <option>Seal Damage</option>
        <option>Hydraulic Leak</option>
      </select>

      <br />
      <br />

      <select
        onChange={(e) =>
          setSeverity(e.target.value)
        }
      >
        <option>Select Severity</option>
        <option>Monitor</option>
        <option>Maintenance Needed</option>
        <option>Repair Recommended</option>
        <option>Immediate Safety Concern</option>
      </select>

      <br />
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
      />

      <br />
      <br />

      <textarea
        placeholder="Inspection Notes"
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />
      <br />

      <button onClick={saveInspection}>
        Save Inspection
      </button>

      <button
        onClick={generatePDF}
        style={{ marginLeft: "15px" }}
      >
        Generate PDF
      </button>

      <h2 style={{ marginTop: "40px" }}>
        Inspection History
      </h2>

      {history.map((item, index) => (
        <div key={index}>
          {item.date} | {item.facility} |
          Dock {item.dock} | {item.defect}
        </div>
      ))}
    </div>
  );
}