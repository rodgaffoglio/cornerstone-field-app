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

  const [workOrders, setWorkOrders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(
      "cornerstoneHistory"
    );

    const savedWorkOrders = localStorage.getItem(
      "cornerstoneWorkOrders"
    );

    if (saved) {
      setHistory(JSON.parse(saved));
    }

    if (savedWorkOrders) {
      setWorkOrders(JSON.parse(savedWorkOrders));
    }
  }, []);

  const defectData: Record<
    string,
    {
      recommendation: string;
      labor: number;
      materials: number;
    }
  > = {
    "Track Misalignment": {
      recommendation:
        "Recommend immediate track realignment and hardware inspection.",
      labor: 250,
      materials: 200,
    },

    "Seal Damage": {
      recommendation:
        "Recommend perimeter seal replacement to prevent energy loss.",
      labor: 350,
      materials: 300,
    },

    "Hydraulic Leak": {
      recommendation:
        "Recommend hydraulic system inspection and seal replacement.",
      labor: 700,
      materials: 500,
    },
  };

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

  const createWorkOrder = () => {
    const repair = defectData[defect];

    const labor = repair?.labor || 0;

    const materials = repair?.materials || 0;

    const total = labor + materials;

    const newWorkOrder = {
      id: `WO-${Date.now()
        .toString()
        .slice(-6)}`,
      facility,
      dock,
      contact,
      asset,
      defect,
      severity,
      total,
      technician: "",
      scheduledDate: "",
      scheduledTime: "",
      partsNeeded: "",
      completionNotes: "",
      status: "Quoted",
      created: new Date().toLocaleDateString(),
    };

    const updated = [...workOrders, newWorkOrder];

    setWorkOrders(updated);

    localStorage.setItem(
      "cornerstoneWorkOrders",
      JSON.stringify(updated)
    );
  };

  const updateWorkOrder = (
    id: string,
    field: string,
    value: string
  ) => {
    const updated = workOrders.map((order) => {
      if (order.id === id) {
        return {
          ...order,
          [field]: value,
        };
      }

      return order;
    });

    setWorkOrders(updated);

    localStorage.setItem(
      "cornerstoneWorkOrders",
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

  const addHeader = (
    doc: jsPDF,
    title: string,
    reportDate: string,
    reportTime: string,
    reportId: string
  ) => {
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

    doc.text(title, 20, 48);

    doc.setFontSize(10);

    doc.text(`Date: ${reportDate}`, 145, 18);

    doc.text(`Time: ${reportTime}`, 145, 26);

    doc.text(`Report ID: ${reportId}`, 145, 34);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const now = new Date();

    const reportDate = now.toLocaleDateString();

    const reportTime = now.toLocaleTimeString();

    const reportId = `CDS-${Date.now()
      .toString()
      .slice(-6)}`;

    addHeader(
      doc,
      "Professional Inspection Report",
      reportDate,
      reportTime,
      reportId
    );

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);

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

    doc.setTextColor(0, 0, 0);

    doc.text(`Notes: ${notes}`, 20, 150);

    doc.text(
      `Recommendation: ${
        defectData[defect]?.recommendation || ""
      }`,
      20,
      165
    );

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

    doc.line(20, 245, 190, 245);

    doc.text(
      "Inspector Signature: ___________________",
      20,
      257
    );

    doc.save(
      `cornerstone-inspection-${reportId}.pdf`
    );
  };

  const generateQuote = () => {
    const doc = new jsPDF();

    const now = new Date();

    const reportDate = now.toLocaleDateString();

    const reportTime = now.toLocaleTimeString();

    const reportId = `QTE-${Date.now()
      .toString()
      .slice(-6)}`;

    const repair = defectData[defect];

    const labor = repair?.labor || 0;

    const materials = repair?.materials || 0;

    const total = labor + materials;

    addHeader(
      doc,
      "Repair Proposal & Estimate",
      reportDate,
      reportTime,
      reportId
    );

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);

    doc.text(`Facility: ${facility}`, 20, 75);

    doc.text(`Dock: ${dock}`, 20, 90);

    doc.text(`Contact: ${contact}`, 20, 105);

    doc.text(`Asset: ${asset}`, 20, 120);

    doc.text(`Defect: ${defect}`, 20, 135);

    doc.text(
      `Scope of Work: ${
        repair?.recommendation || ""
      }`,
      20,
      155,
      {
        maxWidth: 170,
      }
    );

    doc.setFontSize(14);

    doc.text("Estimated Pricing", 20, 190);

    doc.setFontSize(12);

    doc.text(`Labor: $${labor}`, 20, 205);

    doc.text(`Materials: $${materials}`, 20, 220);

    doc.setFontSize(16);

    doc.text(`Total Estimate: $${total}`, 20, 240);

    doc.line(20, 260, 190, 260);

    doc.setFontSize(12);

    doc.text(
      "Customer Approval Signature: ___________________",
      20,
      272
    );

    doc.save(`cornerstone-quote-${facility}.pdf`);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={saveInspection}>
          Save Inspection
        </button>

        <button
          onClick={generatePDF}
          style={{ marginLeft: "15px" }}
        >
          Generate Inspection Report
        </button>

        <button
          onClick={generateQuote}
          style={{ marginLeft: "15px" }}
        >
          Generate Repair Quote
        </button>

        <button
          onClick={createWorkOrder}
          style={{ marginLeft: "15px" }}
        >
          Create Work Order
        </button>
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Inspection History
      </h2>

      {history.map((item, index) => (
        <div key={index}>
          {item.date} | {item.facility} |
          Dock {item.dock} | {item.defect}
        </div>
      ))}

      <h2 style={{ marginTop: "50px" }}>
        Work Order Dashboard
      </h2>

      {workOrders.map((order, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
          }}
        >
          <strong>{order.id}</strong>

          <br />
          <br />

          {order.facility} | Dock {order.dock}

          <br />

          {order.defect}

          <br />

          Status: {order.status}

          <br />

          Total: ${order.total}

          <br />
          <br />

          Technician:
          <input
            placeholder="Assign Tech"
            value={order.technician}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "technician",
                e.target.value
              )
            }
          />

          <br />
          <br />

          Scheduled Date:
          <input
            type="date"
            value={order.scheduledDate}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "scheduledDate",
                e.target.value
              )
            }
          />

          <br />
          <br />

          Scheduled Time:
          <input
            type="time"
            value={order.scheduledTime}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "scheduledTime",
                e.target.value
              )
            }
          />

          <br />
          <br />

          Parts Needed:
          <input
            placeholder="Parts Needed"
            value={order.partsNeeded}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "partsNeeded",
                e.target.value
              )
            }
          />

          <br />
          <br />

          Completion Notes:
          <textarea
            placeholder="Completion Notes"
            value={order.completionNotes}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "completionNotes",
                e.target.value
              )
            }
          />

          <br />
          <br />

          <select
            value={order.status}
            onChange={(e) =>
              updateWorkOrder(
                order.id,
                "status",
                e.target.value
              )
            }
          >
            <option>Quoted</option>
            <option>Approved</option>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Invoiced</option>
          </select>
        </div>
      ))}
    </div>
  );
}