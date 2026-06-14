"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";

export async function addGalleryItem(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File;

  if (!image || image.size === 0) {
    return { error: "Lütfen bir resim yükleyin." };
  }

  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    
    // Upload to Supabase Storage bucket 'vet-uploads'
    const imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, image.type);

    await prisma.gallery.create({
      data: {
        title,
        category,
        image: imageUrl,
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return { error: "Resim yüklenirken bir hata oluştu." };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (item && item.image) {
      await deleteFileFromSupabase('vet-uploads', item.image);
    }

    await prisma.gallery.delete({
      where: { id },
    });
    
    // Vercel'deki revalidatePath çökmelerini önlemek için kaldırıldı.
    // İstemci tarafında router.refresh() kullanılıyor.
    // revalidatePath("/admin/gallery");
    // revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return { error: "Resim silinirken bir hata oluştu." };
  }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as File | null;

  try {
    let imageUrl: string | undefined = undefined;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, image.type);
      
      // Delete old image if a new one is uploaded
      const item = await prisma.gallery.findUnique({ where: { id } });
      if (item && item.image) {
        await deleteFileFromSupabase('vet-uploads', item.image);
      }
    }

    await prisma.gallery.update({
      where: { id },
      data: {
        title,
        category,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return { error: "Resim güncellenirken bir hata oluştu." };
  }
}
