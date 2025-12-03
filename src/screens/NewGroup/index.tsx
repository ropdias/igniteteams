import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'

import { AppError } from '@utils/AppError'

import { Container, Content, Icon } from './styles'

import { groupCreate } from '@/storage/group/groupCreate'

import { Header } from '@components/Header'
import { Button } from '@components/Button'
import { Highlight } from '@components/Highlight'
import { Input } from '@/components/Input'

export function NewGroup() {
  const [group, setGroup] = useState('')
  const navigation = useNavigation()

  async function handleNew() {
    try {
      if (group.trim().length === 0) {
        return Alert.alert('New Group', 'Enter the group name.')
      }
      await groupCreate(group)
      navigation.navigate('players', { group })
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('New Group', error.message)
      } else {
        Alert.alert('New Group', 'Could not create a new group.')
        console.log(error)
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title="New group"
          subtitle="create the group to add people"
        />

        <Input placeholder="Group name" onChangeText={setGroup} />

        <Button title="Create" style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  )
}
