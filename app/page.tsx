"use client";

import React, { useState } from "react";

export default function Home() {
  const [facility, setFacility] = useState("");
  const [dock, setDock] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [asset, setAsset] = useState("");
  const [defect, setDefect] = useState("");
  const [severity, setSeverity] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

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
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Cornerstone Field Inspection</h1>

      <input
        placeholder="Facility Name"
        value={facility}
        onChange={(e) => setFacility(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Dock Number"
        value={dock}
        onChange={(e) => setDock(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Site Contact"
        value={contact}
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

      {photo && (
        <div>
          <h3>Uploaded Inspection Photo</h3>
          <img
            src={photo}
            alt="Inspection"
            style={{ maxWidth: "400px", borderRadius: "8px" }}
          />
        </div>
      )}

      <br />

      <textarea
        placeholder="Inspection Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br /><br />

      <h3>Recommendation</h3>
      <p>
        {recommendations[defect] ||
          "Select a defect to generate recommendation."}
      </p>
    </div>
  );
}