// @flow

import type { AbstractContext } from './types'

import invariant from 'invariant'
import warning from 'warning'

export opaque type Identity = {}
export type ContextMap = Map<string | AbstractContext, mixed>

let currentIdentity: Identity | null = null
let currentContextMap: ContextMap = new Map()

export const makeIdentity = (): Identity => ({})

export const setCurrentIdentity = (id: Identity | null) => {
  currentIdentity = id
}

export const getCurrentIdentity = (): Identity => {
  invariant(
    currentIdentity !== null,
    'Hooks can only be called inside the body of a function component. ' +
      '(https://fb.me/react-invalid-hook-call)'
  )

  // NOTE: The warning that is used in ReactPartialRendererHooks is obsolete
  // in a prepass, since it'll be caught by a subsequent renderer anyway
  // https://github.com/facebook/react/blob/c21c41e/packages/react-dom/src/server/ReactPartialRendererHooks.js#L63-L71

  return (currentIdentity: Identity)
}

export const setCurrentContextMap = (map: ContextMap) => {
  currentContextMap = map
}

export const getCurrentContextMap = (): ContextMap => {
  return currentContextMap
}

export const readContextMap = (context: string | AbstractContext) => {
  if (currentContextMap.has(context)) {
    return currentContextMap.get(context)
  } else if (typeof context === 'string') {
    // A legacy context has no default value
    return undefined
  }

  // Return default if context has no value yet
  return context._currentValue
}

export const forkContextMap = (
  context: string | AbstractContext,
  value: mixed
): ContextMap => {
  // Create cloned ContextMap of currentContextMap
  const newContextMap: ContextMap = new Map(currentContextMap)
  newContextMap.set(context, value)
  return newContextMap
}