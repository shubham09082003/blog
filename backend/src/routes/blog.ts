import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from '@shubhambhatt/common';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: any;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("authorization") || "";
    const response = await verify(header, c.env.JWT_SECRET);
    if(response.id){
      c.set('userId',response.id);
      await next();
    }
    else {
      c.status(403);
      return c.json({
        error : "Un-authorised"
      });
    }
  })
  
  
blogRouter.post('/post', async (c)=>{
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get('userId')


    try{
      const post = await prisma.post.create({
        data : {
          title : body.title,
          content : body.content,
          authodId : userId
        }
      })
      c.status(200);
      return c.json({
        id : post.id
      })
    }
    catch(e){
      c.status(403);
      return c.json({
        error : "Error while posting blog"
      });
    }
  })
  
blogRouter.put('/update', async (c)=>{
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get('userId')
  
    try{
      const post = await prisma.post.update({
        where : {
          id : body.id,
          authodId : userId
        },
        data : {
          title : body.title,
          content : body.content
        }
      });
  
      c.status(200);
      return c.text('updated post');
    }
    catch(e){
      c.status(403);
      return c.json({
        error : "Error while updating post"
      })
    }
  
  })
  
blogRouter.get('/:id', async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try{
      const id = c.req.param('id');
      const post = await prisma.post.findUnique({
        where : {
          id
        },
        select : {
          id : true,
          title : true,
          content : true,
          author : {
            select : {
              name :true
            }
          }
        }
      })
      return c.json(post);
    }
    catch(e){
      c.status(403);
      return c.json({
        error : "Error while fetching post"
      })
    }
  
})



blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  try{
    const blogs = await prisma.post.findMany({
      select : {
        content : true,
        title : true,
        id : true,
        author : {
          select : {
            name : true
          }
        }
      }
    })
    c.status(200);
    c.json({
      blogs
    });
  }
  catch(e){
    c.status(403);
    c.json({
      error : "Error while fetching" +  e
    })
  }
});
