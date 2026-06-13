"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/lib/supabase";

export async function addVeterinarian(formData: FormData) {
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const specialization = formData.get("specialization") as string;
  const university = formData.get("university") as string;
  const graduationYear = formData.get("graduationYear") as string;
  const biography = formData.get("biography") as string;
  const photo = formData.get("photo") as File;

  if (!name || !title) {
    return { error: "İsim ve ünvan alanları zorunludur." };
  }

  let photoUrl = "";

  if (photo && photo.size > 0) {
    try {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${photo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      photoUrl = await uploadFileToSupabase('vet-uploads', filename, buffer, photo.type);
    } catch (error) {
      console.error("Error saving photo:", error);
      return { error: "Fotoğraf kaydedilirken bir hata oluştu." };
    }
  }

  try {
    await prisma.veterinarian.create({
      data: {
        name,
        title,
        specialization: specialization || null,
        university: university || null,
        graduationYear: graduationYear || null,
        biography: biography || null,
        photo: photoUrl || null,
        active: true,
      },
    });

    revalidatePath("/admin/veterinarians");
    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("Error adding veterinarian:", error);
    return { error: "Ekip üyesi eklenirken bir hata oluştu." };
  }
}

export async function deleteVeterinarian(id: string) {
  try {
    const vet = await prisma.veterinarian.findUnique({ where: { id } });
    if (vet && vet.photo) {
      await deleteFileFromSupabase('vet-uploads', vet.photo);
    }

    await prisma.veterinarian.delete({
      where: { id },
    });
    
    revalidatePath("/admin/veterinarians");
    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("Error deleting veterinarian:", error);
    return { error: "Ekip üyesi silinirken bir hata oluştu." };
  }
}

export async function updateVeterinarian(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const specialization = formData.get("specialization") as string;
  const university = formData.get("university") as string;
  const graduationYear = formData.get("graduationYear") as string;
  const biography = formData.get("biography") as string;
  const photo = formData.get("photo") as File;

  if (!name || !title) {
    return { error: "İsim ve ünvan alanları zorunludur." };
  }

  const updateData: any = {
    name,
    title,
    specialization: specialization || null,
    university: university || null,
    graduationYear: graduationYear || null,
    biography: biography || null,
  };

  if (photo && photo.size > 0) {
    try {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${photo.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      
      updateData.photo = await uploadFileToSupabase('vet-uploads', filename, buffer, photo.type);
      
      // Delete old photo
      const oldVet = await prisma.veterinarian.findUnique({ where: { id } });
      if (oldVet && oldVet.photo) {
        await deleteFileFromSupabase('vet-uploads', oldVet.photo);
      }
    } catch (error) {
      console.error("Error saving photo during update:", error);
      return { error: "Fotoğraf kaydedilirken bir hata oluştu." };
    }
  }

  try {
    await prisma.veterinarian.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/veterinarians");
    revalidatePath(`/admin/veterinarians/${id}/edit`);
    revalidatePath("/team");
    revalidatePath(`/team/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating veterinarian:", error);
    return { error: "Ekip üyesi güncellenirken bir hata oluştu." };
  }
}
