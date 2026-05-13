"use client";

import React, {
  useState,
  useEffect,
} from "react";

import jsPDF from "jspdf";

export default function Home() {
  const [facility, setFacility] = useState("");
  const [dock, setDock] = useState("");
  const [contact, setContact] = useState("");
  const [asset, setAsset] = useState("");
  const [defect, setDefect] = useState("");
  const [severity, setSeverity] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("");
  const [history, setHistory] = useState<
    any[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem(
      "cornerstoneHistory"
    );

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveInspection = () => {
    const newInspection = {
      facility,
      dock,
      contact,
      asset,
      defect,
      severity,
      notes,
      date: new Date().toLocaleDateString(),
    };

    const updated = [
      ...history,
      newInspection,
    ];

    setHistory(updated);

    localStorage.setItem(
      "cornerstoneHistory",
      JSON.stringify(updated)
    );

    alert("Inspection Saved");
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

  const reportDate =
    now.toLocaleDateString();

  const reportTime =
    now.toLocaleTimeString();

  const reportId = `CDS-${Date.now()
    .toString()
    .slice(-6)}`;

  doc.setFillColor(245, 245, 245);

  doc.rect(0, 0, 210, 55, "F");

  const logo = new Image();

  logo.src = "/cornerstone-logo.png";

  try {
    doc.addImage(
      logo,
      "PNG",
      12,
      6,
      58,
      38
    );
  } catch (error) {
    console.log("Logo skipped");
  }

  doc.setTextColor(10, 25, 45);

  doc.setFontSize(14);

  doc.text(
    "Professional Inspection Report",
    20,
    48
  );

  doc.setFontSize(10);

  doc.text(
    `Date: ${reportDate}`,
    145,
    18
  );

  doc.text(
    `Time: ${reportTime}`,
    145,
    26
  );

  doc.text(
    `Report ID: ${reportId}`,
    145,
    34
  );

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);

  doc.text(
    `Facility: ${facility}`,
    20,
    75
  );

  doc.text(`Dock: ${dock}`, 20, 90);

  doc.text(
    `Contact: ${contact}`,
    20,
    105
  );

  doc.text(`Asset: ${asset}`, 20, 120);

  doc.text(
    `Defect: ${defect}`,
    20,
    135
  );

  doc.text(
    `Severity: ${severity}`,
    20,
    150
  );

  doc.text(
  `Notes: ${notes}`,
  20,
  165
);

  if (photo) {
  const format = "PNG";

  doc.addImage(
  photo as string,
  format,
  20,
  180,
  120,
  70
);
}

  doc.line(20, 265, 190, 265);

  doc.text(
  "Inspector Signature: ___________________",
  20,
  280
);

  doc.save(
    `cornerstone-inspection-${reportId}.pdf`
  );
};
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Cornerstone Field Inspection</h1>

      <br />

      <input
        placeholder="Facility Name"
        value={facility}
        onChange={(e) =>
          setFacility(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Dock Number"
        value={dock}
        onChange={(e) =>
          setDock(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Site Contact"
        value={contact}
        onChange={(e) =>
          setContact(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={asset}
        onChange={(e) =>
          setAsset(e.target.value)
        }
      >
        <option value="">
          Select Asset
        </option>

        <option>
          Overhead Door
        </option>

        <option>
          Dock Leveler
        </option>

        <option>
          Dock Seal
        </option>
      </select>

      <br />
      <br />

      <select
        value={defect}
        onChange={(e) =>
          setDefect(e.target.value)
        }
      >
        <option value="">
          Select Defect
        </option>

        <option>
          Track Misalignment
        </option>

        <option>
          Seal Damage
        </option>

        <option>
          Hydraulic Leak
        </option>
      </select>

      <br />
      <br />

      <select
        value={severity}
        onChange={(e) =>
          setSeverity(e.target.value)
        }
      >
        <option value="">
          Select Severity
        </option>

        <option>Monitor</option>

        <option>
          Maintenance Needed
        </option>

        <option>
          Repair Recommended
        </option>

        <option>
          Immediate Safety Concern
        </option>
      </select>

      <br />
      <br />

      <textarea
        placeholder="Inspection Notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={saveInspection}>
        Save Inspection
      </button>

      <h2
        style={{
          marginTop: "40px",
        }}
      >
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