import { Router } from "express";
import Book from "../models/books.js";
import auth from "../middleware/auth.js";

const bookRouter = Router();

// ======================= ADD NEW BOOK =======================
bookRouter.post("/books", auth, async (req, res) => {
    try {
        const { title, description, author, genre } = req.body;

        if (!title || !description || !author) {
            return res.status(400).send({ message: "Title, description, and author are required." });
        }

        const newBook = new Book({
            ...req.body
        });

        await newBook.save();
        res.status(201).send({ message: "Book added successfully", book: newBook });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
});

// ======================= GET ALL BOOKS =======================
bookRouter.get("/books", async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;   // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default 10 books per page
        const author = req.query.author; 
        const genre = req.query.genre;   

        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (author) filter.author = author;
        if (genre) filter.genre = genre;

        // Build query
        let query = Book.find(filter);

        query = query.sort({ createdAt: -1 });

        // Apply pagination
        const books = await query.skip(skip).limit(limit);

        // Count total books for pagination
        const totalBooks = await Book.countDocuments(filter);

        res.status(200).send({
            page,
            limit,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            books
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
});

// ======================= GET BOOKS BY ID  =======================
bookRouter.get("/books/:_id", async (req, res) => {
    try {
        const bookId = req.params._id.trim();
        const page = parseInt(req.query.page) || 1;    // reviews page
        const limit = parseInt(req.query.limit) || 5;  // reviews per page
        const skip = (page - 1) * limit;

        // Find the book and populate reviews with pagination
        const book = await Book.findById(bookId)
            .populate({
                path: "reviews",
                options: { sort: { createdAt: -1 }, skip, limit },
                populate: { path: "user", select: "username email" }
            });

        if (!book) return res.status(404).send({ message: "Book not found" });

        // Update averageRating using your model method
        book.updateAverageRating();
        await book.save();

        const totalReviews = book.reviews.length;

        res.status(200).send({
            book,
            averageRating: book.averageRating,
            reviews: book.reviews,
            reviewsPage: page,
            reviewsLimit: limit,
            totalReviews,
            totalReviewPages: Math.ceil(totalReviews / limit)
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});


// ======================= ADD A REVIEW =======================


bookRouter.post("/books/:_id/reviews", auth, async (req, res) => {
    try {
        const bookId = req.params._id.trim();
        const { rating, comment } = req.body;

        // Validate rating and comment
        if (rating === undefined || comment === undefined) {
            return res.status(400).send({ message: "Rating and comment are required." });
        }

        // Validate book exists
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).send({ message: "Book not found" });

        // Check if user already reviewed this book
        let alreadyReviewed = false;

        for (let review of book.reviews) {
            if (review.user.toString() === req.user._id.toString()) {
                alreadyReviewed = true;
                break;  
            }
        }
        if (alreadyReviewed) {
            return res.status(400).send({ message: "You have already reviewed this book." });
        }

        const newReview = {
            user: req.user._id,
            rating,
            comment
        };

        book.reviews.push(newReview);
        book.updateAverageRating();
        await book.save();

        res.status(201).send({ message: "Review added successfully", review: newReview });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// ======================= UPDATE A REVIEW =======================

bookRouter.put("/reviews/:id", auth, async (req, res) => {
    try {
        const reviewId = req.params.id.trim();
        const { rating, comment } = req.body;

        const book = await Book.findOne({ "reviews._id": reviewId });
        if (!book) return res.status(404).send({ message: "Review not found" });

        const review = book.reviews.id(reviewId);

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: "You can only update your own review" });
        }

        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        book.updateAverageRating();
        await book.save();

        res.status(200).send({ message: "Review updated successfully", review });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// ======================= DELETE A REVIEW =======================

bookRouter.delete("/reviews/:id", auth, async (req, res) => {
    try {
        const reviewId = req.params.id.trim();

        const book = await Book.findOne({ "reviews._id": reviewId });
        if (!book) return res.status(404).send({ message: "Review not found" });

        const review = book.reviews.id(reviewId);

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: "You can only delete your own review" });
        }

        review.remove();

        book.updateAverageRating();
        await book.save();

        res.status(200).send({ message: "Review deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// ======================= SEARCH BOOKS BY TITLE OR AUTHOR =======================

bookRouter.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // e.g., /search?query=harry
        if (!query) return res.status(400).send({ message: "Query parameter is required" });

        // Build a case-insensitive regex for partial match
        const regex = new RegExp(query, "i");

        // Search in title or author
        const books = await Book.find({
            $or: [
                { title: regex },
                { author: regex }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).send({ total: books.length, books });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});




export default bookRouter;