const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1);  
  }
};

module.exports = connectDB;