import { Stack } from 'expo-router'
import { Text, View } from 'react-native'

import { Icons, Skeleton, UserMobileModal, UserNameModal } from '@/components'
import { useDisclosure, useUserInfo } from '@/hooks'

const InfoField = ({ label, info, editHandler, isLoading }) => (
  <View className="px-5">
    <View className="flex flex-row items-center justify-between py-4 border-b border-gray-200">
      <View className="flex gap-y-2">
        <Text className="text-xs text-gray-700">{label}</Text>
        {isLoading ? (
          <Skeleton.Item animated="background" height="h-5" width="w-44" />
        ) : (
          <Text className="h-5 text-sm">{info || ''}</Text>
        )}
      </View>

      {!isLoading && (
        <Icons.Feather
          onPress={editHandler}
          name={info ? 'edit' : 'plus'}
          size={16}
          className="icon"
        />
      )}
    </View>
  </View>
)

const PersonalInfoScreen = () => {
  // Modals
  const [isShowNameModal, nameModalHandlers] = useDisclosure()
  const [isShowPhoneModal, phoneModalHandlers] = useDisclosure()

  // User Data
  const { userInfo, isLoading } = useUserInfo()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account Info',
          headerBackTitleVisible: false,
        }}
      />

      {!isLoading && userInfo && (
        <>
          <UserNameModal
            isShow={isShowNameModal}
            onClose={nameModalHandlers.close}
            editedData={userInfo.name}
          />
          <UserMobileModal
            isShow={isShowPhoneModal}
            onClose={phoneModalHandlers.close}
            editedData={userInfo.mobile}
          />
        </>
      )}

      <View className="h-full bg-white">
        <InfoField
          label="Full Name"
          info={userInfo?.name}
          editHandler={nameModalHandlers.open}
          isLoading={isLoading}
        />
        <InfoField
          label="Phone Number"
          info={userInfo?.mobile}
          editHandler={phoneModalHandlers.open}
          isLoading={isLoading}
        />
      </View>
    </>
  )
}

export default PersonalInfoScreen
