"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";

export async function addService(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  if (!title || !description) {
    return { error: "Başlık ve açıklama alanları zorunludur." };
  }

  let imageUrl = "";

  if (image && image.size > 0) {
    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, image.type);
    } catch (error) {
      console.error("Error saving image:", error);
      return { error: "Fotoğraf kaydedilirken bir hata oluştu." };
    }
  }

  const parsedPrice = price ? parseFloat(price) : null;

  try {
    await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || null,
        price: parsedPrice,
        image: imageUrl || null,
        active: true,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding service:", error);
    return { error: "Hizmet eklenirken bir hata oluştu." };
  }
}

export async function deleteService(id: string) {
  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (service && service.image) {
      await deleteFileFromSupabase('vet-uploads', service.image);
    }

    await prisma.service.delete({
      where: { id },
    });
    
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { error: "Hizmet silinirken bir hata oluştu." };
  }
}

export async function updateService(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const price = formData.get("price") as string;
  const image = formData.get("image") as File;

  if (!title || !description) {
    return { error: "Başlık ve açıklama alanları zorunludur." };
  }

  const parsedPrice = price ? parseFloat(price) : null;

  const updateData: any = {
    title,
    description,
    icon: icon || null,
    price: parsedPrice,
  };

  if (image && image.size > 0) {
    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      updateData.image = await uploadFileToSupabase('vet-uploads', filename, buffer, image.type);
      
      const oldService = await prisma.service.findUnique({ where: { id } });
      if (oldService && oldService.image) {
        await deleteFileFromSupabase('vet-uploads', oldService.image);
      }
    } catch (error) {
      console.error("Error saving image during update:", error);
      return { error: "Fotoğraf kaydedilirken bir hata oluştu." };
    }
  }

  try {
    await prisma.service.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}/edit`);
    revalidatePath("/services");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Hizmet güncellenirken bir hata oluştu." };
  }
}
