# API 路由说明

本项目使用 Next.js 的 App Router 实现了以下 API 端点：

## 公开 API

### GET /api/hello

返回一个简单的问候消息。

**响应示例：**
\`\`\`json
{
  "message": "Hello, World!"
}
\`\`\`

### POST /api/hello

接收并返回 JSON 数据。

**请求体示例：**
\`\`\`json
{
  "name": "John",
  "age": 30
}
\`\`\`

**响应示例：**
\`\`\`json
{
  "message": "Data received successfully",
  "data": {
    "name": "John",
    "age": 30
  }
}
\`\`\`

## 需要 API 密钥的端点

以下 API 端点需要在请求头中包含有效的 API 密钥：

\`\`\`
x-api-key: your-api-key-here
\`\`\`

### 用户 API

#### GET /api/users/[id]

获取特定用户的信息。

**响应示例：**
\`\`\`json
{
  "id": "1",
  "name": "User 1",
  "email": "user1@example.com"
}
\`\`\`

#### PUT /api/users/[id]

更新特定用户的信息。

**请求体示例：**
\`\`\`json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
\`\`\`

**响应示例：**
\`\`\`json
{
  "id": "1",
  "name": "Updated Name",
  "email": "updated@example.com",
  "updated": true
}
\`\`\`

#### DELETE /api/users/[id]

删除特定用户。

**响应示例：**
\`\`\`json
{
  "message": "User 1 deleted successfully"
}
\`\`\`

### 产品 API

#### GET /api/products

获取产品列表，支持以下查询参数：
- `category`: 按类别筛选
- `minPrice`: 最低价格
- `maxPrice`: 最高价格

**请求示例：**
\`\`\`
GET /api/products?category=electronics&minPrice=150
\`\`\`

**响应示例：**
\`\`\`json
{
  "products": [
    {
      "id": "2",
      "name": "Product 2",
      "price": 200,
      "category": "electronics"
    }
  ],
  "count": 1,
  "filters": {
    "category": "electronics",
    "minPrice": "150",
    "maxPrice": null
  }
}
\`\`\`

#### POST /api/products

创建新产品。

**请求体示例：**
\`\`\`json
{
  "name": "New Product",
  "price": 150,
  "category": "books"
}
\`\`\`

**响应示例：**
\`\`\`json
{
  "message": "Product created successfully",
  "product": {
    "id": "6",
    "name": "New Product",
    "price": 150,
    "category": "books"
  }
}
\`\`\`

## 中间件

本项目使用中间件实现了以下功能：

1. 请求日志记录
2. CORS 头设置
3. API 密钥验证（除了 `/api/hello` 端点外）

## 开发说明

要添加新的 API 路由，请在 `src/app/api` 目录下创建相应的文件夹和 `route.ts` 文件。例如：

\`\`\`
src/app/api/new-endpoint/route.ts
\`\`\`

对于带有动态参数的路由，使用方括号命名文件夹，例如：

\`\`\`
src/app/api/items/[id]/route.ts
\`\`\`