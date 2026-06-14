import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteFileFromSupabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yetki kontrolü
    if (!session || (session.user as any)?.role === "Member") {
      return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
    }

    const { id } = await props.params;

    // Önce kaydı bul
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }

    // Görsel varsa Supabase'den sil
    if (existingPost.cover_image) {
      try {
        await deleteFileFromSupabase('vet-uploads', existingPost.cover_image);
      } catch (err) {
        console.error("Supabase silme hatası (Blog):", err);
      }
    }

    // Veritabanından sil
    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Blog silme hatası:", error);
    return NextResponse.json(
      { error: "Silme işlemi sırasında sunucu hatası oluştu." }, 
      { status: 500 }
    );
  }
}
