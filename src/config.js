const mongoose = require("mongoose");


const dbURI = "mongodb+srv://w1953903:hmmqPCKWeuJRJifx@user.pkoxlgs.mongodb.net/?retryWrites=true&w=majority&appName=User";
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Database connected successfully!"))
.catch(err => console.log("Error connecting to the database:", err));


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
