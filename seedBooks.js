import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/books.js";

dotenv.config();

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.error("DB connection error:", err));

// 2. Array of books to insert
const books = [
  {"title":"The Alchemist","description":"A shepherd's journey to discover his personal legend.","author":"Paulo Coelho","genre":"Fiction"},
  {"title":"1984","description":"A dystopian novel about a totalitarian regime.","author":"George Orwell","genre":"Fiction"},
  {"title":"Clean Code","description":"A handbook of agile software craftsmanship.","author":"Robert C. Martin","genre":"Programming"},
  {"title":"The Pragmatic Programmer","description":"Tips for becoming a better programmer.","author":"Andrew Hunt","genre":"Programming"},
  {"title":"Harry Potter and the Sorcerer's Stone","description":"A boy discovers he is a wizard.","author":"J.K. Rowling","genre":"Fantasy"},
  {"title":"Harry Potter and the Chamber of Secrets","description":"The second year at Hogwarts.","author":"J.K. Rowling","genre":"Fantasy"},
  {"title":"To Kill a Mockingbird","description":"A story of racial injustice in the Deep South.","author":"Harper Lee","genre":"Fiction"},
  {"title":"The Great Gatsby","description":"A critique of the American Dream.","author":"F. Scott Fitzgerald","genre":"Fiction"},
  {"title":"The Hobbit","description":"Bilbo's adventure to win treasure from a dragon.","author":"J.R.R. Tolkien","genre":"Fantasy"},
  {"title":"The Lord of the Rings: The Fellowship of the Ring","description":"The start of the epic journey in Middle-earth.","author":"J.R.R. Tolkien","genre":"Fantasy"},
  {"title":"The Lord of the Rings: The Two Towers","description":"The journey continues with new challenges.","author":"J.R.R. Tolkien","genre":"Fantasy"},
  {"title":"The Lord of the Rings: The Return of the King","description":"The epic conclusion of the saga.","author":"J.R.R. Tolkien","genre":"Fantasy"},
  {"title":"Thinking, Fast and Slow","description":"Insights into human decision making.","author":"Daniel Kahneman","genre":"Psychology"},
  {"title":"Sapiens: A Brief History of Humankind","description":"Exploring the history of our species.","author":"Yuval Noah Harari","genre":"History"},
  {"title":"Homo Deus: A Brief History of Tomorrow","description":"Exploring the future of humanity.","author":"Yuval Noah Harari","genre":"History"},
  {"title":"The Catcher in the Rye","description":"A young boy navigates life after expulsion from school.","author":"J.D. Salinger","genre":"Fiction"},
  {"title":"Brave New World","description":"A futuristic society shaped by technology and control.","author":"Aldous Huxley","genre":"Fiction"},
  {"title":"The Lean Startup","description":"A guide to building startups efficiently.","author":"Eric Ries","genre":"Business"},
  {"title":"Zero to One","description":"Notes on startups, or how to build the future.","author":"Peter Thiel","genre":"Business"},
  {"title":"Deep Work","description":"Rules for focused success in a distracted world.","author":"Cal Newport","genre":"Self-help"},
  {"title":"Atomic Habits","description":"An easy & proven way to build good habits.","author":"James Clear","genre":"Self-help"},
  {"title":"The Power of Habit","description":"Why we do what we do in life and business.","author":"Charles Duhigg","genre":"Self-help"}
];

// 3. Insert books
const seedBooks = async () => {
    try {
        await Book.deleteMany({}); // optional: clears existing books
        const result = await Book.insertMany(books);
        console.log(`${result.length} books added successfully.`);
        mongoose.connection.close();
    } catch (err) {
        console.error("Error inserting books:", err);
    }
};

seedBooks();
