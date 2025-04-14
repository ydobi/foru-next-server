import { NextResponse } from 'next/server';

// 获取特定用户信息
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // 这里通常会从数据库或其他数据源获取用户数据
  // 这里仅作为示例返回模拟数据
  return NextResponse.json({
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  });
}

// 更新特定用户信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const body = await request.json() as Record<string, any>;
    
    // 这里通常会更新数据库中的用户数据
    // 这里仅作为示例返回接收到的数据
    return NextResponse.json({
      id,
      ...body,
      updated: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse request body' },
      { status: 400 }
    );
  }
}

// 删除特定用户
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // 这里通常会从数据库中删除用户
  // 这里仅作为示例返回成功消息
  return NextResponse.json({
    message: `User ${id} deleted successfully`,
  });
}