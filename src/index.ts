import express, { Request, Response } from "express";
import imageRoutes from "./routes/imageRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/images", imageRoutes);

app.get("/", (_req: Request, res: Response): void => {
  res.send("Use /images?filename=fjord&width=200&height=200");
});

app.listen(PORT, (): void => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
