"use server";
import { currentUser } from "@clerk/nextjs/server";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeletecategorySchema,
  DeletecategorySchemaSchemaType,
} from "../../../schema/categories";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const ParseBody = CreateCategorySchema.safeParse(form);
  if (!ParseBody.success) {
    throw new Error(ParseBody.error.message);
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  // Create the category in the database
  const {name,icon,type}=  ParseBody.data;
  return await prisma.category.create({
    data:{
        userId:user.id,
        name,
        icon,
        type,
    },

});
}

export async function Deletecategory(form:DeletecategorySchemaSchemaType){
   const ParseBody = DeletecategorySchema.safeParse(form);
  if (!ParseBody.success) {
    throw new Error(ParseBody.error.message);
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
 return await prisma.category.delete({
    where: {
      name_userId_type: {
        name: ParseBody.data.name,
        userId: user.id,
        type: ParseBody.data.type,
      },
    },
  });
}
 

