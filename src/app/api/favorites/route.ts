/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Favorite from "@/models/favoritesModel";

connectDB();

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { word, quoteText, author } = body;
  
      if (!word || !quoteText) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Check if the quote already exists in favorites
      const existingFav = await Favorite.findOne({
        quoteText,
        author: author || { $exists: false }, 
      });
  
      if (existingFav) {
        return NextResponse.json({ message: "Quote is already in favorites" });
      }
  
      
      const newFavorite = await Favorite.create({ word, quoteText, author });
  
      return NextResponse.json({ message: "Quote added to favorites", favorite: newFavorite });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Failed to add quote to favorites" }, { status: 500 });
    }  
}

export async function GET() {
    try {
      const favorites = await Favorite.find();
  
      if (favorites.length === 0) {
        return NextResponse.json({ message: "No favorites found" });
      }
  
      return NextResponse.json({ favorites });
    } catch (error: any) {
        console.log(error);
      return NextResponse.json({ error: "Failed to retrieve favorites" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); 

    if (!id) {
      return NextResponse.json({ error: "Missing favorite ID" }, { status: 400 });
    }

    // Find and delete the favorite with the given ID
    const deletedFavorite = await Favorite.findByIdAndDelete(id);

    if (!deletedFavorite) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Favorite deleted successfully" });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 });
  }
}
