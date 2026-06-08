export interface UserInfo {
  userId: number
  nickname: string
  avatar: string
  phone: string
  memberLevel: number
  memberLevelName: string
  growthValue: number
  pointsBalance: number
  couponCount: number
}

export interface ProductItem {
  id: number
  name: string
  subtitle: string
  coverImage: string
  price: number
  originalPrice?: number
  salesCount: number
  stock: number
  tags: string[]
}

export interface ProductDetail extends ProductItem {
  categoryPath: string
  imageList: string[]
  description: string
  rating: number
  reviewCount: number
  skus: SkuItem[]
}

export interface SkuItem {
  skuId: number
  skuName: string
  specInfo: any
  price: number
  stock: number
  skuImage: string
}

export interface CartItem {
  cartItemId: number
  productId: number
  productName: string
  skuId: number
  skuDesc: string
  coverImage: string
  price: number
  originalPrice: number
  quantity: number
  selected: boolean
  stock: number
  isValid: boolean
  invalidReason: string | null
}

export interface OrderItem {
  orderId: number
  orderNo: string
  status: string
  statusName: string
  totalAmount: number
  payAmount: number
  items: Array<{
    productId: number
    productName: string
    coverImage: string
    price: number
    quantity: number
  }>
  itemCount: number
  freight: number
  createdAt: string
}

export interface AddressItem {
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

export interface BannerItem {
  id: number
  title: string
  imageUrl: string
  linkType: string
  linkValue: string
}

export interface CategoryItem {
  id: number
  name: string
  iconUrl: string
  children?: CategoryItem[]
}

export interface NavItem {
  id: number
  name: string
  iconUrl: string
  linkType: string
  linkValue: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginatedData<T> {
  list: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
