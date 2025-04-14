import { NextResponse } from 'next/server';

// 模拟产品数据
const products = [
  { id: '1', name: 'Product 1', price: 100, category: 'electronics' },
  { id: '2', name: 'Product 2', price: 200, category: 'electronics' },
  { id: '3', name: 'Product 3', price: 300, category: 'clothing' },
  { id: '4', name: 'Product 4', price: 400, category: 'clothing' },
  { id: '5', name: 'Product 5', price: 500, category: 'books' },
];

export async function GET(request: Request) {
  // 获取URL对象以访问查询参数
  const { searchParams } = new URL(request.url);
  
  // 获取查询参数
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  // 根据查询参数过滤产品
  let filteredProducts = [...products];
  
  if (category) {
    filteredProducts = filteredProducts.filter(
      product => product.category === category
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.price >= parseInt(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      product => product.price <= parseInt(maxPrice)
    );
  }
  
  return NextResponse.json({
    products: filteredProducts,
    count: filteredProducts.length,
    filters: { category, minPrice, maxPrice }
  });
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    
    // 验证必要字段
    if (!body?.name || !body?.price || !body?.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      );
    }
    
    // 创建新产品（在实际应用中会保存到数据库）
    const newProduct = {
      id: (products.length + 1).toString(),
      name: body?.name,
      price: body?.price,
      category: body?.category
    };
    
    // 在实际应用中，这里会将产品保存到数据库
    // products.push(newProduct);
    
    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse request body' },
      { status: 400 }
    );
  }
}