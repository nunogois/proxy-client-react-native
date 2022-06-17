/** @format */

import 'react-native-get-random-values' // See: https://www.npmjs.com/package/uuid#react-native--expo

export type {
  IConfig,
  IContext,
  IMutableContext,
  IVariant,
  IToggle
} from 'unleash-proxy-client'
export {
  UnleashClient,
  IStorageProvider,
  LocalStorageProvider,
  InMemoryStorageProvider
} from 'unleash-proxy-client'

import FlagProvider from './FlagProvider'
import useFlag from './useFlag'
import useFlagsStatus from './useFlagsStatus'
import useVariant from './useVariant'
import useUnleashContext from './useUnleashContext'
import useUnleashClient from './useUnleashClient'
import { defaultStorageProvider } from './utils/defaultStorageProvider'

export {
  FlagProvider,
  useFlag,
  useFlagsStatus,
  useVariant,
  useUnleashContext,
  useUnleashClient,
  defaultStorageProvider
}

export default FlagProvider
