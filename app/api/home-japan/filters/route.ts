import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { createFilterPipeline } from "@/pipeline/filterCars";

export const preferredRegion = "home";
export const maxDuration = 60;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    // Force pathname to be japan
    const pathname = "japan";
    
    const search = searchParams.get("search") || "";
    const detailsParam = searchParams.get("details");
    let detailsFilter: {
      name: string;
      values: string[];
    }[] = [];

    const selectedFeatures = searchParams.get("features");
    let featuresFilter: string[] = [];
    if (selectedFeatures) {
      featuresFilter = selectedFeatures.split(",");
    }

    if (detailsParam) {
      detailsFilter = detailsParam
        .split(";")
        .map((detail) => {
          const [name, values] = detail.split(":");
          return { name, values: values ? values.split(",") : [] };
        })
        .filter(({ values }) => values.length > 0);
    }

    const pipeline = createFilterPipeline(
      pathname,
      search,
      detailsFilter,
      featuresFilter
    );

    const filters = await Car.aggregate(pipeline);

    return NextResponse.json(filters, { status: 200 });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}