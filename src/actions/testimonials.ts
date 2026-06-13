"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export async function addTestimonial(formData: FormData) {
  // ── 1. Oturum kontrolü ────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Yorum yazabilmek için giriş yapmanız gerekiyor." };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) {
    return { error: "Kullanıcı bulunamadı." };
  }

  // ── 2. Limit kontrolü (Ayarlardan oku) ───────────────────
  const settings = await prisma.settings.findFirst();
  const LIMIT_DAYS = settings?.testimonial_limit_days || 15;
  const LIMIT_COUNT = settings?.testimonial_limit_count || 2;

  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - LIMIT_DAYS);

  const recentCount = await prisma.testimonial.count({
    where: {
      userId: dbUser.id,
      createdAt: { gte: windowStart },
    },
  });

  if (recentCount >= LIMIT_COUNT) {
    // En eski yorumun tarihinden ne zaman serbest kalacağını hesapla
    const oldest = await prisma.testimonial.findFirst({
      where: {
        userId: dbUser.id,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
    });

    const releaseDate = oldest
      ? new Date(oldest.createdAt.getTime() + LIMIT_DAYS * 24 * 60 * 60 * 1000)
      : null;

    const releaseDateStr = releaseDate
      ? releaseDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
      : "";

    return {
      error: `Son ${LIMIT_DAYS} gün içinde ${LIMIT_COUNT} yorum hakkınızı kullandınız. ${releaseDateStr} tarihinden itibaren yeniden yorum yazabilirsiniz.`,
    };
  }

  // ── 3. Form verileri ──────────────────────────────────────
  const owner_name = formData.get("owner_name") as string;
  const pet_name = formData.get("pet_name") as string | null;
  const comment = formData.get("comment") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const photo = formData.get("photo") as File | null;

  if (!owner_name || !comment) {
    return { error: "Lütfen adınızı ve yorumunuzu girin." };
  }

  try {
    let photoUrl = null;

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${photo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      photoUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, photo.type);
    }

    await prisma.testimonial.create({
      data: {
        owner_name,
        pet_name,
        comment,
        rating,
        userId: dbUser.id,           // ← kimin yazdığını kaydet
        ...(photoUrl ? { photo: photoUrl } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return { error: "Yorumunuz gönderilirken bir hata oluştu." };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (testimonial && testimonial.photo) {
      await deleteFileFromSupabase('vet-uploads', testimonial.photo);
    }

    await prisma.testimonial.delete({
      where: { id },
    });
    
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { error: "Yorum silinirken bir hata oluştu." };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const owner_name = formData.get("owner_name") as string;
  const pet_name = formData.get("pet_name") as string | null;
  const comment = formData.get("comment") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const remove_photo = formData.get("remove_photo") === "on";

  if (!owner_name || !comment) {
    return { error: "İsim ve yorum zorunludur." };
  }

  try {
    const dataToUpdate: any = {
      owner_name,
      pet_name,
      comment,
      rating,
    };

    if (remove_photo) {
      const testimonial = await prisma.testimonial.findUnique({ where: { id } });
      if (testimonial && testimonial.photo) {
        await deleteFileFromSupabase('vet-uploads', testimonial.photo);
      }
      dataToUpdate.photo = null;
    }

    await prisma.testimonial.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { error: "Yorum güncellenirken bir hata oluştu." };
  }
}

export async function updateTestimonialSettings(formData: FormData) {
  const testimonial_limit_days = parseInt(formData.get("testimonial_limit_days") as string) || 15;
  const testimonial_limit_count = parseInt(formData.get("testimonial_limit_count") as string) || 2;

  try {
    const existing = await prisma.settings.findFirst();
    
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: {
          testimonial_limit_days,
          testimonial_limit_count,
        },
      });
    } else {
      await prisma.settings.create({
        data: {
          testimonial_limit_days,
          testimonial_limit_count,
        },
      });
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial settings:", error);
    return { error: "Ayarlar güncellenirken bir hata oluştu." };
  }
}
