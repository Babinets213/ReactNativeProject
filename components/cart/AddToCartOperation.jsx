import { useState, useEffect } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import CartButtons from './CartButtons'
import { Button } from '../common/Buttons'
import ProductPrice from '../product/ProductPrice'

import { useAppDispatch, useAppSelector, useUserInfo } from '@/hooks'
import { addToCart } from '@/store'
import { exsitItem } from '@/utils'

const AddToCartOperation = ({ product }) => {
  const dispatch = useAppDispatch()
  const { cartItems, tempColor, tempSize } = useAppSelector(state => state.cart)
  const { mustAuthAction } = useUserInfo()

  const [currentItemInCart, setCurrentItemInCart] = useState()

  useEffect(() => {
    setCurrentItemInCart(exsitItem(cartItems, product._id, tempColor, tempSize))
  }, [cartItems, product._id, tempColor, tempSize])

  const handleAddItem = () =>
    mustAuthAction(() => {
      if (!product.inStock) {
        return Toast.show({
          type: 'error',
          text1: 'Out of Stock',
          text2: 'This product is currently unavailable',
        })
      }

      dispatch(
        addToCart({
          productID: product._id,
          name: product.title,
          price: product.price,
          discount: product.discount,
          inStock: product.inStock,
          sold: product.sold,
          color: tempColor,
          size: tempSize,
          img: product.images?.[0],
          quantity: 1,
        })
      )
    })

  return (
    <View className="flex-row items-center justify-between p-4 bg-white border-t border-gray-200 shadow-md rounded-t-lg">
      {currentItemInCart ? (
        <CartButtons item={currentItemInCart} className="flex-1 mr-4" />
      ) : (
        <Button
          onPress={handleAddItem}
          className="flex-1 mr-4 bg-blue-600 text-white py-3 rounded-lg text-center"
        >
          Add to Cart
        </Button>
      )}

      <ProductPrice
        inStock={product.inStock}
        discount={product.discount}
        price={product.price}
        singleProduct
      />
    </View>
  )
}

export default AddToCartOperation
