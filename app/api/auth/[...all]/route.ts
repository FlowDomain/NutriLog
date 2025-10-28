import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { connectToDatabase } from "@/database/mongoose";

// Ensure database connection before auth operations
const nextJsHandler = toNextJsHandler(auth);

const handler = async (req: Request) => {
  await connectToDatabase();
  if (req.method === 'GET') {
    return nextJsHandler.GET(req);
  }
  return nextJsHandler.POST(req);
};

export { handler as GET, handler as POST };