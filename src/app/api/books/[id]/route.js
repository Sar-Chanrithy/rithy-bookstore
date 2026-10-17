// src/app/api/books/[id]/route.js
import { NextResponse } from 'next/server';
import { getBookById, updateBook, deleteBook } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const book = await getBookById(id);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateBook(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Book not found or update failed' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteBook(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
