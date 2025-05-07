import { NextRequest, NextResponse } from "next/server";
import { Car } from "@/models/Car";
import { connectToDatabase } from "@/lib/mongoose";
import { Types } from "mongoose";
import { Ordering } from "@/models/Ordering";
import { createCarPipeline } from "@/pipeline/filterCars";

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
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    
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

    const sortByParam = searchParams.get("sortBy");
    let sortStage: { [key: string]: 1 | -1 } = { carOrder: 1 };

    if (sortByParam) {
      sortStage = {};
      const sortByFilter = sortByParam.split(",").map((sort) => {
        const [name, order] = sort.split(":");
        return { name, order: order === "asc" ? 1 : -1 };
      });

      sortByFilter.forEach(({ name, order }) => {
        const sortFieldMap: { [key: string]: string } = {
          price: "numericPrice",
          year: "numericYear",
          mileage: "numericMileage",
          size: "numericSize",
          weight: "numericWeight",
        };

        if (sortFieldMap[name]) {
          sortStage[sortFieldMap[name]] = order as 1 | -1;
        }
      });
    }

    if (Object.keys(sortStage).length === 0) {
      sortStage = {
        carOrder: 1,
      };
    }

    const carDetailOrdering = await Ordering.findOne({ name: "CarDetail" });
    const carDetailOrderIds = carDetailOrdering?.ids ?? [];

    const carOrdering = await Ordering.findOne({ name: "Car", page: pathname });
    const carOrderIds = carOrdering?.ids ?? [];

    const skip = (page - 1) * limit;

    const pipeline = createCarPipeline(
      pathname,
      search,
      detailsFilter,
      featuresFilter,
      sortStage,
      skip,
      limit,
      carDetailOrderIds,
      carOrderIds,
    );

    const [result] = await Car.aggregate(pipeline);
    const { cars, totalCars, priceRange } = result || {
      cars: [],
      totalCars: 0,
      priceRange: { min: 0, max: 0 },
    };
    const totalPages = Math.ceil(totalCars / limit);

    return NextResponse.json(
      {
        data: cars,
        pagination: {
          currentPage: page,
          totalPages,
          limit,
          totalItems: totalCars,
          priceRange,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching car data:", error);
    return NextResponse.json(
      { error: "Failed to fetch car data" },
      { status: 500 },
    );
  }
}