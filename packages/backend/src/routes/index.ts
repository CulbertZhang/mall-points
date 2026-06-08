import { Router } from 'express'
import { authRequired, authOptional } from '../middlewares/auth'
import * as authCtrl from '../controllers/auth'
import * as productCtrl from '../controllers/product'
import * as cartCtrl from '../controllers/cart'
import * as orderCtrl from '../controllers/order'
import * as memberCtrl from '../controllers/member'
import * as configCtrl from '../controllers/config'

const router = Router()

// Auth
router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.get('/user/profile', authRequired, authCtrl.getProfile)

// Products
router.get('/products', productCtrl.list)
router.get('/products/search', productCtrl.list)
router.get('/products/:id', productCtrl.detail)
router.get('/categories', productCtrl.categories)

// Cart
router.post('/cart/items', authRequired, cartCtrl.add)
router.get('/cart', authRequired, cartCtrl.list)
router.put('/cart/items/:id', authRequired, cartCtrl.update)
router.delete('/cart/items/:id', authRequired, cartCtrl.remove)

// Orders
router.post('/orders', authRequired, orderCtrl.create)
router.get('/orders', authRequired, orderCtrl.list)
router.get('/orders/:id', authRequired, orderCtrl.detail)
router.put('/orders/:id/cancel', authRequired, orderCtrl.cancel)

// Member
router.get('/member/profile', authRequired, memberCtrl.profile)
router.get('/member/level', authRequired, memberCtrl.profile)
router.post('/points/signin', authRequired, memberCtrl.signIn)
router.get('/points/signin/status', authRequired, memberCtrl.signInStatus)

// Addresses
router.get('/addresses', authRequired, memberCtrl.addresses)
router.post('/addresses', authRequired, memberCtrl.createAddress)
router.put('/addresses/:id', authRequired, memberCtrl.updateAddress)
router.delete('/addresses/:id', authRequired, memberCtrl.deleteAddress)

// Config
router.get('/marketing/banners', configCtrl.banners)
router.get('/config/nav', configCtrl.navigations)

export default router
