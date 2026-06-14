"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Sadece harf, rakam, boşluk ve tireye izin ver
    .replace(/\s+/g, "-") // Boşlukları tireye çevir
    .replace(/-+/g, "-") // Tekrar eden tireleri tek tire yap
    .trim() + "-" + Math.floor(Math.random() * 1000); // Eşsiz olması için rastgele sayı ekle
}

export async function addBlogPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const author = formData.get("author") as string;
  const cover_image = formData.get("cover_image") as File;

  if (!title || !content) {
    return { error: "Başlık ve içerik alanları zorunludur." };
  }

  const slug = generateSlug(title);

  try {
    let imageUrl: string | undefined = undefined;

    if (cover_image && cover_image.size > 0) {
      const bytes = await cover_image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${cover_image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, cover_image.type);
    }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        category,
        author,
        cover_image: imageUrl,
        published_at: new Date(),
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return { error: "Yazı eklenirken bir hata oluştu." };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const author = formData.get("author") as string;
  const cover_image = formData.get("cover_image") as File | null;
  const remove_image = formData.get("remove_image") === "on";

  if (!title || !content) {
    return { error: "Başlık ve içerik alanları zorunludur." };
  }

  try {
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return { error: "Yazı bulunamadı." };
    }

    let imageUrl = existingPost.cover_image;

    if (remove_image) {
      if (existingPost.cover_image) {
        await deleteFileFromSupabase('vet-uploads', existingPost.cover_image);
      }
      imageUrl = null;
    } else if (cover_image && cover_image.size > 0) {
      // Yeni görsel yüklendiyse, eski görseli sil ve yenisini yükle
      if (existingPost.cover_image) {
        await deleteFileFromSupabase('vet-uploads', existingPost.cover_image);
      }

      const bytes = await cover_image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${cover_image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, cover_image.type);
    }

    // Slug'ı güncelle (İsterseniz mevcut slug'ı koruyabilirsiniz ama başlık değiştiyse yenilemek SEO için iyi olabilir)
    const newSlug = existingPost.title !== title ? generateSlug(title) : existingPost.slug;

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: newSlug,
        content,
        category,
        author,
        cover_image: imageUrl,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existingPost.slug}`);
    if (newSlug !== existingPost.slug) {
       revalidatePath(`/blog/${newSlug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { error: "Yazı güncellenirken bir hata oluştu." };
  }
}
