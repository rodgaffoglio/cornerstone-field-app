import { NextResponse } from "next/server";
import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const record = await base(
      process.env.AIRTABLE_TABLE_NAME || "Inspections"
    ).create([
      {
        fields: {
          Facility: body.facility,
          Dock: body.dock,
          Contact: body.contact,
          Asset: body.asset,
          Defect: body.defect,
          Severity: body.severity,
          Notes: body.notes,
          Date: new Date().toLocaleDateString(),
          ReportID: `CDS-${Date.now()
            .toString()
            .slice(-6)}`,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}