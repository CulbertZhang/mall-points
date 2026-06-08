// Backend API returns these exact shapes

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
  timestamp: number
}

// Auth
export interface AuthData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  userInfo: {
    userId: number
    nickname: string
    avatar: string | null
    phone: string
    memberLevel: number
    memberLevelName: string
  }
}

export interface UserInfo {
  userId: number
  nickname: string
  avatar: string | null
  phone: string
  gender: number
  birthday: string | null
  memberLevel: number
  memberLevelName: string
  growthValue: number
  pointsBalance: number
  couponCount: number
}

// Member
export interface MemberProfile {
  userId: number
  nickname: string
  avatar: string | null
  memberLevel: number
  memberLevelName: string
  memberLevelIcon: string
  growthValue: number
  nextLevelGrowth: number
  pointsBalance: number
  allLevels: Array<{
    level: number
    name: string
    icon: string | null
    minGrowth: number
    discountRate: string
  }>
}

// Products
export interface Product {
  id: number
  name: string
  subtitle: string | null
  coverImage: string
  price: string
  salesCount: number
  stock: number
  tags: string[]
}

export interface ProductDetail {
  id: number
  name: string
  subtitle: string | null
  categoryPath: string
  coverImage: string
  imageList: string[]
  price: string
  originalPrice: string
  salesCount: number
  stock: number
  tags: string[]
  description: string | null
  skus: ProductSku[]
}

export interface ProductSku {
  skuId: number
  skuName: string | null
  specInfo: Record<string, any>
  price: string
  stock: number
  skuImage: string | null
}

export interface PaginatedList<T> {
  list: T[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}

// Categories
export interface Category {
  id: number
  parentId: number
  name: string
  iconUrl: string | null
  imageUrl: string | null
  level: number
  isLeaf: boolean
  sortOrder: number
  children: Category[]
}

// Cart
export interface CartData {
  totalCount: number
  selectedCount: number
  totalPrice: number
  selectedPrice: number
  items: CartItem[]
}

export interface CartItem {
  cartItemId: number
  productId: number
  productName: string
  skuId: number
  skuDesc: string | null
  coverImage: string
  price: string
  originalPrice: string | null
  quantity: number
  selected: boolean
  stock: number
  isValid: boolean
  invalidReason: string | null
}

// Order
export interface OrderListItem {
  orderId: number
  orderNo: string
  status: string
  statusName: string
  totalAmount: string
  payAmount: string
  items: Array<{
    productId: number
    productName: string
    coverImage: string | null
    price: string
    quantity: number
  }>
  itemCount: number
  freight: string
  createdAt: string
}

export interface OrderDetail {
  orderId: number
  orderNo: string
  status: string
  totalAmount: string
  payAmount: string
  freight: string
  pointsUsed: number
  items: Array<{
    productId: number
    productName: string
    coverImage: string | null
    price: string
    quantity: number
    totalPrice: string
  }>
  address: {
    receiverName: string | null
    phone: string | null
    province: string | null
    city: string | null
    district: string | null
    detail: string | null
  }
  timeline: Array<{ time: string; status: string }>
  createdAt: string
}

export interface CreateOrderResult {
  orderId: number
  orderNo: string
  totalAmount: number
  pointsDeductionAmount: number
  freight: number
  payAmount: number
}

// Config
export interface Banner {
  id: number
  title: string
  imageUrl: string
  linkType: string
  linkValue: string
}

export interface NavItem {
  id: number
  name: string
  iconUrl: string | null
  linkType: string
  linkValue: string
}

// Address (backend shape)
export interface Address {
  id: number
  receiverName: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
  label: string
}

// SignIn (backend shape)
export interface SignInStatus {
  todaySigned: boolean
  consecutiveDays: number
}

export interface SignInResult {
  todayBonus: number
  consecutiveDays: number
  totalEarned: number
  balance: number
}
