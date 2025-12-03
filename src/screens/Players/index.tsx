import { useState, useEffect, useRef, useCallback } from 'react'
import { FlatList, Alert, TextInput } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { AppError } from '@utils/AppError'

import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'

import { Loading } from '@components/Loading'
import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@/components/ButtonIcon'
import { Input } from '@/components/Input'
import { Filter } from '@/components/Filter'
import { PlayerCard } from '@/components/PlayerCard'
import { ListEmpty } from '@/components/ListEmpty'
import { Button } from '@/components/Button'

import { Container, Form, HeaderList, NumberOfPlayers } from './styles'

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('Team A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const navigation = useNavigation()

  const route = useRoute()

  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('New player', "Enter the player's name to add.")
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      newPlayerNameInputRef.current?.blur()

      setNewPlayerName('')
      await fetchPlayersByTeam()
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('New player', error.message)
      } else {
        console.log(error)
        Alert.alert('New player', 'Could not add the player.')
      }
    }
  }

  const fetchPlayersByTeam = useCallback(async () => {
    try {
      setIsLoading(true)
      const playersByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Players',
        'Could not load the players for the selected team.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [group, team])

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)

      await fetchPlayersByTeam()
    } catch (error) {
      console.log(error)

      Alert.alert('Remove player', 'Could not remove this player.')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remove Team', 'Could not remove the team.')
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remove', 'Do you want to remove the team?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => groupRemove() },
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [fetchPlayersByTeam, team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Add people and split them into teams"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Player name"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Team A', 'Team B']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="No players in this team" />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title="Remove team"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
