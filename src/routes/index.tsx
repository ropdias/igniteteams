import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'

import { AppRoutes } from './app.routes'

export function Routes() {
  const { COLORS } = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.GRAY_600 }}>
      {/* View wrapper is to prevent white screen glitch when navigating between routes */}
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}
