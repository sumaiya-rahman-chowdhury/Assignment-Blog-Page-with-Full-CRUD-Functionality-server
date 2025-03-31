import express, { Request, Response } from "express";
import upload from "../middleware/upload";
import cloudinary from "../utils/cloudinary";
import Blog from "../model/Blog";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { page = 1, limit = 10, category, subCategory } = req.query;
  try {
    const query: any = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    const totalCount = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalCount / +limit);

    const blogs = await Blog.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ blogs, totalPages });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response):Promise<any> => {
    const {id} = req.params
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
});
router.post(
  "/post",
  upload.array("images", 10),
  async (req: Request, res: Response) => {
    try {
      let imageUrls: string[] = [];

      if (req.files && Array.isArray(req.files)) {
        imageUrls = await Promise.all(
          req.files.map((file: Express.Multer.File) => {
            return new Promise<string>((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "blog-images" },
                (error, result) => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(result?.secure_url as string);
                }
              );
              stream.end(file.buffer);
            });
          })
        );
      }

      const {
        author,
        title,
        publicationDate,
        category,
        subCategory,
        travelTags,
        summary,
        content,
      } = req.body;

      const blogPost = new Blog({
        author,
        title,
        publicationDate,
        category,
        subCategory,
        travelTags,
        summary,
        content,
        imageUrls,
      });

      const savedBlog = await blogPost.save();
      res.status(201).json(savedBlog);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);
router.put("/:id", async (req: Request<{ id: string }>, res: Response):Promise<any> => {
    const { id } = req.params;
   const {
    author,
    title,
    publicationDate,
    category,
    subCategory,
    travelTags,
    summary,
    content,
    imageUrls, 
  } = req.body;
  
   try {
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        author,
        title,
        publicationDate,
        category,
        subCategory,
        travelTags,
        summary,
        content,
        imageUrls, 
      },
      { new: true } 
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }

  });
router.delete("/:id", async (req: Request<{ id: string }>, res: Response):Promise<any> => {
    const { id } = req.params;
  
    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
  
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });
  
export default router;
