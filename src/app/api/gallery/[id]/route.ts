import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFileFromSupabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Yetki kontrolü
    if (!session || (session.user as any)?.role === "Member") {
      return NextResponse.json({ error: "Bu işlemi yapmak için yetkiniz yok." }, { status: 401 });
    }

    const { id } = params;

    const item = await prisma.gallery.findUnique({ where: { id } });
    
    if (!item) {
      return NextResponse.json({ error: "Silinmek istenen resim veritabanında bulunamadı." }, { status: 404 });
    }

    if (item.image) {
      await deleteFileFromSupabase('vet-uploads', item.image);
    }

    await prisma.gallery.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error deleting gallery item:", error);
    return NextResponse.json({ error: "Resim silinirken sunucu kaynaklı bir hata oluştu." }, { status: 500 });
  }
}
