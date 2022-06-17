import AsyncStorage from '@react-native-async-storage/async-storage'

export const defaultStorageProvider = (appName = 'unleash:repository') => ({
  save: (name: string, data: any) => {
    const repo = JSON.stringify(data)
    const key = `${appName}:${name}`
    return AsyncStorage.setItem(key, repo)
  },
  get: async (name: string) => {
    const key = `${appName}:${name}`
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
  }
})
