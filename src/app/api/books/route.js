// src/app/api/books/route.js
import { NextResponse } from 'next/server';
import { getBooks, createBook } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const categoriesParam = searchParams.get('categories');
    const categories = categoriesParam ? categoriesParam.split(',') : undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const limit = searchParams.get('limit');

    const result = await getBooks({
      search,
      category,
      categories,
      minPrice,
      maxPrice,
      sort,
      featured: featured !== null && featured !== undefined ? featured === 'true' : undefined,
      onSale: onSale !== null && onSale !== undefined ? onSale === 'true' : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    if (page) {
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Title and Price are required' },
        { status: 400 }
      );
    }
    const created = await createBook(body);
    return NextResponse.json(
      { success: true, message: 'Book created successfully', data: created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
