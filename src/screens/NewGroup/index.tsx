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
        return Alert.alert('New Team', 'Enter the team name.')
      }
      await groupCreate(group)
      navigation.navigate('players', { group })
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('New Team', error.message)
      } else {
        Alert.alert('New Team', 'Could not create a new team.')
        console.log(error)
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight title="New team" subtitle="Create the team to add people" />

        <Input placeholder="Team name" onChangeText={setGroup} />

        <Button title="Create" style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  )
}
