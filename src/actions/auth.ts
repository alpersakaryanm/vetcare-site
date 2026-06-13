"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Tüm alanlar zorunludur." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kullanımda." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "Member", // Set default role for normal members
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Kayıt işlemi sırasında bir hata oluştu." };
  }
}

export async function promoteUserByEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string || "Administrator";

  if (!email) {
    return { error: "E-posta adresi zorunludur." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Bu e-posta adresine sahip bir kullanıcı bulunamadı." };
    }

    await prisma.user.update({
      where: { email },
      data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Promotion error:", error);
    return { error: "Yetki güncelleme sırasında bir hata oluştu." };
  }
}

export async function updateUserRole(userId: string, role: string) {
  if (!userId || !role) {
    return { error: "Geçersiz parametreler." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update role error:", error);
    return { error: "Rol güncellenirken bir hata oluştu." };
  }
}
