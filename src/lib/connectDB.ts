
import mongoose from "mongoose";


type ConnectionObject ={
  isConnected?:number
}
const connection: ConnectionObject = {}

async function connectDB(): Promise<void> {
    

   if(connection.isConnected){
    console.log('database already is connected');
    
   }
   try {
    const db = await mongoose.connect(process.env.MONGO_URI || '',{})
    connection.isConnected = db.connections[0].readyState
    console.log('database connected successfully');
    
   } catch (error) {
    console.log('database connection is failed',error);
    process.exit(1)
    
   }
}
export default connectDB