import { yupResolver } from '@hookform/resolvers/yup'
import Slider from '@react-native-community/slider'
import { nanoid } from '@reduxjs/toolkit'
import { useLocalSearchParams, router } from 'expo-router'
import Stack from 'expo-router/stack'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'

import { HandleResponse, Icons, SubmitModalBtn, TextField } from '@/components'
import { useCreateReviewMutation } from '@/services'
import { ratingStatus, reviewSchema } from '@/utils'

export default function ReviewCommentScreen() {
  // ✅ Params
  const { productID, productTitle } = useLocalSearchParams()

  // ✅ Local state
  const [positiveValue, setPositiveValue] = useState('')
  const [negativeValue, setNegativeValue] = useState('')
  const [rating, setRating] = useState(5)

  // ✅ Form hook
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      comment: '',
      title: '',
      positivePoints: [],
      negativePoints: [],
      rating: 1,
      product: '',
    },
  })

  const {
    fields: positivePointsFields,
    append: appendPositivePoint,
    remove: removePositivePoint,
  } = useFieldArray({
    name: 'positivePoints',
    control,
  })

  const {
    fields: negativePointsFields,
    append: appendNegativePoint,
    remove: removeNegativePoint,
  } = useFieldArray({
    name: 'negativePoints',
    control,
  })

  // ✅ API
  const [createReview, { isSuccess, isLoading, data, isError, error }] = useCreateReviewMutation()

  // ✅ Handlers
  const handleAddPositivePoint = () => {
    if (positiveValue.trim()) {
      appendPositivePoint({ id: nanoid(), title: positiveValue })
      setPositiveValue('')
    }
  }

  const handleAddNegativePoint = () => {
    if (negativeValue.trim()) {
      appendNegativePoint({ id: nanoid(), title: negativeValue })
      setNegativeValue('')
    }
  }

  const submitHandler = formData =>
    createReview({
      body: { ...formData, rating, product: productID },
    })

  return (
    <>
      <Stack.Screen
        options={{
          title: `Review: ${productTitle}`,
          headerBackTitleVisible: false,
        }}
      />

      {/* ✅ Handle Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error?.data?.message}
          message={data?.message}
          onSuccess={() => {
            reset()
            setRating(1)
            router.back()
          }}
          onError={() => {}}
        />
      )}

      <ScrollView className="bg-white">
        <View className="flex flex-col flex-1 p-4 gap-y-5">
          {/* Rating */}
          <View>
            <View className="my-2 flex flex-row justify-center">
              <Text className="text-sm text-black">Rating:</Text>
              <Text className="px-1 text-sm text-sky-500">{ratingStatus[rating]}</Text>
            </View>
            <Slider
              step={1}
              maximumValue={5}
              minimumValue={1}
              style={{ width: '100%' }}
              value={rating}
              onValueChange={setRating}
              maximumTrackTintColor="#CCCCCC"
            />
          </View>

          {/* Title */}
          <TextField label="Title" control={control} errors={errors.title} name="title" />

          {/* Positive Points */}
          <View className="space-y-3">
            <Text className="text-xs text-gray-700">Pros</Text>
            <View className="flex flex-row items-center border border-gray-200 rounded-md px-3 py-2.5 bg-zinc-50/30">
              <TextInput
                className="flex-auto"
                value={positiveValue}
                onChangeText={setPositiveValue}
                placeholder="Add a positive point"
              />
              <Pressable onPress={handleAddPositivePoint}>
                <Icons.AntDesign size={16} name="plus" className="icon" />
              </Pressable>
            </View>

            {positivePointsFields.map((field, index) => (
              <View key={field.id} className="flex flex-row items-center px-3 gap-x-4">
                <Icons.AntDesign size={16} name="plus" className="text-green-500" />
                <Text className="flex-auto">{field.title}</Text>
                <Pressable onPress={() => removePositivePoint(index)}>
                  <Icons.AntDesign size={16} name="delete" className="text-gray-500" />
                </Pressable>
              </View>
            ))}
          </View>

          {/* Negative Points */}
          <View className="space-y-3">
            <Text className="text-xs text-gray-700">Cons</Text>
            <View className="flex flex-row items-center border border-gray-200 rounded-md px-3 py-2.5 bg-zinc-50/30">
              <TextInput
                className="flex-auto"
                value={negativeValue}
                onChangeText={setNegativeValue}
                placeholder="Add a negative point"
              />
              <Pressable onPress={handleAddNegativePoint}>
                <Icons.AntDesign size={16} name="plus" className="icon" />
              </Pressable>
            </View>

            {negativePointsFields.map((field, index) => (
              <View key={field.id} className="flex flex-row items-center px-3 gap-x-4">
                <Icons.AntDesign size={16} name="minus" className="text-red-500" />
                <Text className="flex-auto">{field.title}</Text>
                <Pressable onPress={() => removeNegativePoint(index)}>
                  <Icons.AntDesign size={16} name="delete" className="text-gray-500" />
                </Pressable>
              </View>
            ))}
          </View>

          {/* Comment */}
          <TextField label="Comment" control={control} errors={errors.comment} name="comment" />

          {/* Submit */}
          <View className="py-3">
            <SubmitModalBtn onPress={handleSubmit(submitHandler)} isLoading={isLoading}>
              Submit Review
            </SubmitModalBtn>
          </View>
        </View>
      </ScrollView>
    </>
  )
}
