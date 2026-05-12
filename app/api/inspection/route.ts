import { NextResponse } from "next/server";
import base from "@/lib/airtable";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const record = await base("Inspections").create([
      {
        fields: {
          Facility: body.facility,
          "Dock Number": body.dock,
          Defect: body.defect,
          Severity: body.severity,
          Notes: body.notes,
          Asset: body.asset,
          Contact: body.contact,
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
      {
        status: 500,
      }
    );
  }
}