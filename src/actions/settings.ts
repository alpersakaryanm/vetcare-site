"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";

export async function updateSettings(id: string | null, formData: FormData) {
  const clinic_name = formData.get("clinic_name") as string;
  const services_page_title = formData.get("services_page_title") as string;
  const services_page_desc = formData.get("services_page_desc") as string;
  
  const about_title = formData.get("about_title") as string;
  const about_content = formData.get("about_content") as string;
  const about_mission = formData.get("about_mission") as string;
  const about_vision = formData.get("about_vision") as string;

  const gallery_page_title = formData.get("gallery_page_title") as string;
  const gallery_page_desc = formData.get("gallery_page_desc") as string;
  
  const imageFile = formData.get("about_image") as File | null;
  const heroImageFile = formData.get("hero_image") as File | null;
  let imageUrl = undefined;
  let heroImageUrl = undefined;

  if (!clinic_name) {
    return { error: "Klinik adı zorunludur." };
  }

  // Handle about image upload if a new file is provided
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const filename = `${Date.now()}-about-${imageFile.name.replace(/\s+/g, '-')}`;
    
    imageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, imageFile.type);
    
    // If updating, delete old image
    if (id) {
      const oldSettings = await prisma.settings.findUnique({ where: { id } });
      if (oldSettings && oldSettings.about_image) {
        await deleteFileFromSupabase('vet-uploads', oldSettings.about_image);
      }
    }
  }

  // Handle hero image upload if a new file is provided
  if (heroImageFile && heroImageFile.size > 0) {
    const bytes = await heroImageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const filename = `${Date.now()}-hero-${heroImageFile.name.replace(/\s+/g, '-')}`;
    
    heroImageUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, heroImageFile.type);
    
    // If updating, delete old image
    if (id) {
      const oldSettings = await prisma.settings.findUnique({ where: { id } });
      if (oldSettings && oldSettings.hero_image) {
        await deleteFileFromSupabase('vet-uploads', oldSettings.hero_image);
      }
    }
  }

  const data: any = {
    clinic_name,
    services_page_title: services_page_title || null,
    services_page_desc: services_page_desc || null,
    about_title: about_title || null,
    about_content: about_content || null,
    about_mission: about_mission || null,
    about_vision: about_vision || null,
    gallery_page_title: gallery_page_title || null,
    gallery_page_desc: gallery_page_desc || null,
  };

  if (imageUrl) {
    data.about_image = imageUrl;
  }
  if (heroImageUrl) {
    data.hero_image = heroImageUrl;
  }

  try {
    if (id) {
      await prisma.settings.update({
        where: { id },
        data,
      });
    } else {
      await prisma.settings.create({
        data,
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/services");
    revalidatePath("/about");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { error: "Ayarlar kaydedilirken bir hata oluştu." };
  }
}

export async function updateContactSettings(id: string | null, formData: FormData) {
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const email = formData.get("email") as string;
  const instagram_link = formData.get("instagram_link") as string;
  const facebook_link = formData.get("facebook_link") as string;
  const youtube_link = formData.get("youtube_link") as string;

  const data: any = {
    address: address || null,
    phone: phone || null,
    whatsapp: whatsapp || null,
    email: email || null,
    instagram_link: instagram_link || null,
    facebook_link: facebook_link || null,
    youtube_link: youtube_link || null,
  };

  try {
    if (id) {
      await prisma.settings.update({
        where: { id },
        data,
      });
    } else {
      await prisma.settings.create({
        data: {
          clinic_name: "Veteriner Kliniği",
          ...data
        },
      });
    }

    revalidatePath("/admin/pages");
    revalidatePath("/contact");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating contact settings:", error);
    return { error: "İletişim ayarları kaydedilirken bir hata oluştu." };
  }
}
