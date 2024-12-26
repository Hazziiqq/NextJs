/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Search from "@/models/searchModel";
import Quote from "@/models/quoteModel";
import fetch from "node-fetch";

connectDB();

async function fetchWithRetry(url: string, retries: number = 3, delay: number = 2000): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${process.env.TOKEN_SEC}`,  
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        return await response.json();
    } catch (error: any) {
        if (retries > 0) {
            console.log(`Retrying fetch request. ${retries} retries left...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay);
        }
        throw new Error(`Failed to fetch after multiple retries: ${error.message}`);
    }
}

export async function GET(request: Request) {
    // Extract the query (search word) from the request
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";

    if (!query) {
        return NextResponse.json({ error: "No search word provided" }, { status: 400 });
    }

    try {
        //Store the word in the database (always add a new entry for history tracking)
        await Search.create({ word: query });

        // Fetch quotes from FavQs API (with retry logic)
        const apiUrl = `https://favqs.com/api/quotes?page=1&filter=${query}`;
        const data = await fetchWithRetry(apiUrl);

        // Filter out duplicates before storing quotes
        const quotes = await Promise.all(data.quotes.map(async (quote: any) => {
            const existingQuote = await Quote.findOne({
                quoteText: quote.body,
                author: quote.author,
            });

            if (existingQuote) {
                return null; // Skip duplicate quotes
            }

            return {
                word: query,
                quoteText: quote.body,
                author: quote.author,
            };
        }));

        // Filter out null values and insert new quotes
        const newQuotes = quotes.filter((quote) => quote !== null);
        if (newQuotes.length > 0) {
            await Quote.insertMany(newQuotes);
        }

        // Return all quotes for the word 
        const allQuotes = await Quote.find({ word: query });
        return NextResponse.json({ quotes: allQuotes });
    } catch (error) {
        console.log("Error fetching and saving quotes:", error);
        return NextResponse.json({ error: "Unable to fetch or save quotes" }, { status: 500 });
    }
}
